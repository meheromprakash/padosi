const Locality = require('../models/Locality');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/localities/search?q=...
exports.searchLocalities = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.status(200).json({ success: true, localities: [] });
  }

  const localities = await Locality.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { city: { $regex: q, $options: 'i' } },
      { pincode: { $regex: q, $options: 'i' } },
    ],
    isActive: true,
  }).limit(10).lean();

  res.status(200).json({
    success: true,
    localities,
  });
});

// GET /api/localities/:id
exports.getLocality = asyncHandler(async (req, res) => {
  const locality = await Locality.findById(req.params.id);
  if (!locality) {
    return res.status(404).json({ success: false, message: 'Locality not found' });
  }
  res.status(200).json({
    success: true,
    locality,
  });
});
