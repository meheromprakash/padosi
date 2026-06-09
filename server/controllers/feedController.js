const Post = require('../models/Post');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET /api/feed
exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const localityId = req.localityId;
    if (!localityId) return res.status(400).json({ message: 'Locality not set for your account' });

    const filter = { localityId, isActive: true };
    if (category && category !== 'all') filter.category = category;

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

    // Rename authorId -> author for frontend
    const formatted = posts.map((p) => ({ ...p, author: p.authorId, locality: p.localityId }));

    res.json({ posts: formatted, hasMore: skip + posts.length < total, total });
  } catch (err) { next(err); }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { content, category } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Content is required' });

    const mediaUrls = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'padosi/posts');
        mediaUrls.push(result.secure_url);
      }
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
    res.status(201).json({ post: formatted });
  } catch (err) { next(err); }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'firstName avatar verification.verified')
      .populate('localityId', 'name');
    if (!post || !post.isActive) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/react
exports.reactToPost = async (req, res, next) => {
  try {
    const { reaction = 'like' } = req.body;
    const valid = ['like', 'heart', 'support'];
    if (!valid.includes(reaction)) return res.status(400).json({ message: 'Invalid reaction' });

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${reaction}`]: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ reactions: post.reactions });
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, authorId: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found or not authorized' });
    post.isActive = false;
    await post.save();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};
