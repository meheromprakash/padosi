const fs = require('fs');
const Listing = require('../models/Listing');
const { uploadToCloudinary } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/listings
exports.getListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, isFree } = req.query;
  const filter = { localityId: req.localityId, status: 'available' };
  if (category && category !== 'all') filter.category = category;
  if (isFree === 'true') filter.isFree = true;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate('sellerId', 'firstName avatar verification.verified')
      .populate('localityId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Listing.countDocuments(filter),
  ]);

  const formatted = listings.map((l) => ({ ...l, seller: l.sellerId, locality: l.localityId }));
  res.status(200).json({
    success: true,
    listings: formatted,
    hasMore: skip + listings.length < total,
    total,
  });
});

// POST /api/listings
exports.createListing = asyncHandler(async (req, res) => {
  const { title, description, price, isFree, category, condition } = req.body;
  if (!title?.trim()) {
    if (req.files) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
    }
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const imageUrls = [];
  try {
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'padosi/listings');
        imageUrls.push(result.secure_url);
        fs.unlink(file.path, () => {});
      }
    }
  } catch (uploadError) {
    if (req.files) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
    }
    throw uploadError;
  }

  const listing = await Listing.create({
    title: title.trim(),
    description: description?.trim(),
    price: isFree === 'true' ? 0 : Number(price) || 0,
    isFree: isFree === 'true',
    category: category || 'other',
    condition: condition || 'good',
    images: imageUrls,
    localityId: req.localityId,
    sellerId: req.userId,
  });

  await listing.populate([
    { path: 'sellerId', select: 'firstName avatar verification.verified' },
    { path: 'localityId', select: 'name' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Listing created successfully',
    listing,
  });
});

// PUT /api/listings/:id
exports.updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id, sellerId: req.userId });
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found or not authorized' });
  }

  const allowed = ['title', 'description', 'price', 'isFree', 'status', 'condition'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) listing[field] = req.body[field];
  });

  await listing.save();
  res.status(200).json({
    success: true,
    message: 'Listing updated successfully',
    listing,
  });
});

// DELETE /api/listings/:id
exports.deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOneAndDelete({ _id: req.params.id, sellerId: req.userId });
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Not found or not authorized' });
  }
  res.status(200).json({
    success: true,
    message: 'Listing removed successfully',
  });
});
