const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/bookmarks — Get user's saved posts
exports.getBookmarks = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const bookmarks = await Bookmark.find({ userId })
    .populate({
      path: 'postId',
      populate: [
        { path: 'authorId', select: 'firstName avatar verification.verified' },
        { path: 'localityId', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  const posts = bookmarks
    .map((b) => b.postId)
    .filter((p) => p && p.isActive)
    .map((p) => ({
      ...p,
      author: p.authorId,
      locality: p.localityId,
      userBookmarked: true,
    }));

  res.status(200).json({
    success: true,
    posts,
  });
});

// POST /api/bookmarks/:postId — Bookmark a post
exports.addBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  const post = await Post.findById(postId);
  if (!post || !post.isActive) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const existing = await Bookmark.findOne({ userId, postId });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Post already bookmarked' });
  }

  await Bookmark.create({ userId, postId });
  res.status(201).json({
    success: true,
    message: 'Post bookmarked successfully',
  });
});

// DELETE /api/bookmarks/:postId — Remove bookmark
exports.removeBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  const result = await Bookmark.findOneAndDelete({ userId, postId });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Bookmark not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Bookmark removed successfully',
  });
});
