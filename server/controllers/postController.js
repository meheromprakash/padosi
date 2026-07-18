const fs = require('fs');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { createNotification } = require('../utils/notifications');
const asyncHandler = require('../utils/asyncHandler');
const { runInTransaction } = require('../utils/transaction');

// POST /api/posts — Create a post
exports.createPost = asyncHandler(async (req, res) => {
  const { content, category } = req.body;
  if (!content?.trim()) {
    if (req.files) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
    }
    return res.status(400).json({ success: false, message: 'Content is required' });
  }

  const mediaUrls = [];
  try {
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'padosi/posts');
        mediaUrls.push(result.secure_url);
        fs.unlink(file.path, () => {});
      }
    }
  } catch (uploadError) {
    if (req.files) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
    }
    throw uploadError;
  }

  const post = await Post.create({
    content: content.trim(),
    category: category || 'general',
    localityId: req.localityId,
    authorId: req.userId,
    media: mediaUrls,
  });

  await post.populate([
    { path: 'authorId', select: 'firstName avatar verification.verified' },
    { path: 'localityId', select: 'name' },
  ]);

  const formatted = { ...post.toObject(), author: post.authorId, locality: post.localityId };
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post: formatted,
  });
});

// GET /api/posts/:id — Get a post's details
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('authorId', 'firstName avatar verification.verified')
    .populate('localityId', 'name')
    .lean();

  if (!post || !post.isActive) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const userReaction = await Reaction.findOne({ postId: post._id, userId: req.userId }).lean();

  const formatted = {
    ...post,
    author: post.authorId,
    locality: post.localityId,
    userReaction: userReaction ? userReaction.type : null,
  };

  res.status(200).json({
    success: true,
    post: formatted,
  });
});

// POST /api/posts/:id/react — Toggle/update post reaction
exports.reactToPost = asyncHandler(async (req, res) => {
  const { reaction = 'like' } = req.body;
  const valid = ['like', 'heart', 'support'];
  if (!valid.includes(reaction)) {
    return res.status(400).json({ success: false, message: 'Invalid reaction' });
  }

  const postId = req.params.id;
  const userId = req.userId;

  const result = await runInTransaction(async (session) => {
    const existing = await Reaction.findOne({ postId, userId }).session(session);
    let post;

    if (existing) {
      if (existing.type === reaction) {
        // Toggle reaction off
        await Reaction.deleteOne({ _id: existing._id }).session(session);
        post = await Post.findByIdAndUpdate(
          postId,
          { $inc: { [`reactions.${reaction}`]: -1 } },
          { new: true, session }
        );
      } else {
        // Update to new reaction type
        const oldType = existing.type;
        existing.type = reaction;
        await existing.save({ session });

        post = await Post.findByIdAndUpdate(
          postId,
          {
            $inc: {
              [`reactions.${oldType}`]: -1,
              [`reactions.${reaction}`]: 1,
            },
          },
          { new: true, session }
        );
      }
    } else {
      // Create new reaction
      await Reaction.create([{ postId, userId, type: reaction }], { session });
      post = await Post.findByIdAndUpdate(
        postId,
        { $inc: { [`reactions.${reaction}`]: 1 } },
        { new: true, session }
      );

      // Trigger notification for the author
      if (post && post.authorId.toString() !== userId.toString()) {
        const sender = await User.findById(userId).select('firstName').session(session);
        const senderName = sender ? sender.firstName : 'A neighbor';
        await createNotification(req.io, {
          recipientId: post.authorId,
          senderId: userId,
          type: 'like',
          entityId: post._id,
          entityType: 'Post',
          content: `${senderName} reacted to your post: "${post.content.slice(0, 30)}..."`,
        });
      }
    }

    if (!post) {
      return { status: 404, message: 'Post not found' };
    }

    const userReactionDoc = await Reaction.findOne({ postId, userId }).session(session).lean();

    return { success: true, post, userReactionDoc };
  });

  if (!result.success) {
    return res.status(result.status).json({ success: false, message: result.message });
  }

  res.status(200).json({
    success: true,
    reactions: result.post.reactions,
    userReaction: result.userReactionDoc ? result.userReactionDoc.type : null,
  });
});

// DELETE /api/posts/:id — Soft delete a post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, authorId: req.userId });
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found or not authorized' });
  }

  post.isActive = false;
  await post.save();
  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});

// PUT /api/posts/:id — Update a post
exports.updatePost = asyncHandler(async (req, res) => {
  const { content, category } = req.body;
  const post = await Post.findOne({ _id: req.params.id, authorId: req.userId });
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found or not authorized' });
  }

  if (content !== undefined) post.content = content.trim();
  if (category !== undefined) post.category = category;
  await post.save();

  await post.populate([
    { path: 'authorId', select: 'firstName avatar verification.verified' },
    { path: 'localityId', select: 'name' },
  ]);

  const formatted = { ...post.toObject(), author: post.authorId, locality: post.localityId };

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    post: formatted,
  });
});
