const Locality = require('../models/Locality');

// GET /api/localities/search?q=...
exports.searchLocalities = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ localities: [] });

    const localities = await Locality.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { pincode: { $regex: q, $options: 'i' } },
      ],
      isActive: true,
    }).limit(10).lean();

    res.json({ localities });
  } catch (err) { next(err); }
};

// GET /api/localities/:id
exports.getLocality = async (req, res, next) => {
  try {
    const locality = await Locality.findById(req.params.id);
    if (!locality) return res.status(404).json({ message: 'Locality not found' });
    res.json({ locality });
  } catch (err) { next(err); }
};
