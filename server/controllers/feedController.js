const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const Bookmark = require('../models/Bookmark');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/feed
exports.getFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, authorId, q } = req.query;
  const localityId = req.localityId;
  if (!localityId) {
    return res.status(400).json({ success: false, message: 'Locality not set for your account' });
  }

  const filter = { localityId, isActive: true };
  if (category && category !== 'all') filter.category = category;
  if (authorId) filter.authorId = authorId;
  if (q) filter.content = { $regex: q, $options: 'i' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('authorId', 'firstName avatar verification.verified')
      .populate('localityId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Post.countDocuments(filter),
  ]);

  const postIds = posts.map((p) => p._id);

  // Fetch user's reactions and bookmarks for these posts in parallel
  const [userReactions, userBookmarks] = await Promise.all([
    Reaction.find({ userId: req.userId, postId: { $in: postIds } }).lean(),
    Bookmark.find({ userId: req.userId, postId: { $in: postIds } }).lean(),
  ]);

  const reactionMap = new Map(userReactions.map((r) => [r.postId.toString(), r.type]));
  const bookmarkSet = new Set(userBookmarks.map((b) => b.postId.toString()));

  // Format for frontend
  const formatted = posts.map((p) => {
    const postIdStr = p._id.toString();
    return {
      ...p,
      author: p.authorId,
      locality: p.localityId,
      userReaction: reactionMap.get(postIdStr) || null,
      userBookmarked: bookmarkSet.has(postIdStr),
    };
  });

  res.status(200).json({
    success: true,
    posts: formatted,
    hasMore: skip + posts.length < total,
    total,
  });
});
