const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { createNotification } = require('../utils/notifications');
const asyncHandler = require('../utils/asyncHandler');
const { runInTransaction } = require('../utils/transaction');

// GET /api/posts/:postId/comments — Get comments for a post
exports.getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [comments, total] = await Promise.all([
    Comment.find({ postId, isActive: true })
      .populate('authorId', 'firstName avatar verification.verified')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Comment.countDocuments({ postId, isActive: true }),
  ]);

  const formatted = comments.map((c) => ({ ...c, author: c.authorId }));

  res.status(200).json({
    success: true,
    comments: formatted,
    hasMore: skip + comments.length < total,
    total,
  });
});

// POST /api/posts/:postId/comments — Add a comment to a post
exports.createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ success: false, message: 'Comment content is required' });
  }

  const result = await runInTransaction(async (session) => {
    const post = await Post.findOne({ _id: postId, isActive: true }).session(session);
    if (!post) {
      return { status: 404, message: 'Post not found' };
    }

    const comment = (await Comment.create([{
      postId,
      authorId: req.userId,
      content: content.trim(),
    }], { session }))[0];

    // Atomically increment commentsCount
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }).session(session);

    // Trigger notification for post author
    if (post.authorId.toString() !== req.userId.toString()) {
      const sender = await User.findById(req.userId).select('firstName').session(session);
      const senderName = sender ? sender.firstName : 'A neighbor';
      await createNotification(req.io, {
        recipientId: post.authorId,
        senderId: req.userId,
        type: 'comment',
        entityId: post._id,
        entityType: 'Post',
        content: `${senderName} replied to your post: "${post.content.slice(0, 30)}..."`,
      });
    }

    await comment.populate('authorId', 'firstName avatar verification.verified');
    return { success: true, comment };
  });

  if (!result.success) {
    return res.status(result.status).json({ success: false, message: result.message });
  }

  const formatted = { ...result.comment.toObject(), author: result.comment.authorId };

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    comment: formatted,
  });
});

// DELETE /api/posts/:postId/comments/:commentId — Delete a comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  const result = await runInTransaction(async (session) => {
    const comment = await Comment.findOne({ _id: commentId, postId, isActive: true }).session(session);
    if (!comment) {
      return { status: 404, message: 'Comment not found' };
    }

    const post = await Post.findById(postId).session(session);
    const isAuthorized =
      comment.authorId.toString() === req.userId ||
      (post && post.authorId.toString() === req.userId);

    if (!isAuthorized) {
      return { status: 403, message: 'Not authorized to delete this comment' };
    }

    comment.isActive = false;
    await comment.save({ session });

    // Atomically decrement commentsCount
    if (post) {
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } }).session(session);
    }

    return { success: true };
  });

  if (!result.success) {
    return res.status(result.status).json({ success: false, message: result.message });
  }

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});
