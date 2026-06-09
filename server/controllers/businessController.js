const Business = require('../models/Business');

// GET /api/businesses
exports.getBusinesses = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const filter = { localityId: req.localityId, isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (q) filter.$text = { $search: q };

    const businesses = await Business.find(filter)
      .populate('localityId', 'name')
      .sort({ isVerified: -1, rating: -1 })
      .limit(50)
      .lean();

    const formatted = businesses.map((b) => ({ ...b, locality: b.localityId }));
    res.json({ businesses: formatted });
  } catch (err) { next(err); }
};

// POST /api/businesses
exports.createBusiness = async (req, res, next) => {
  try {
    const { name, category, contact, whatsapp, address, description } = req.body;
    if (!name?.trim() || !category) return res.status(400).json({ message: 'Name and category required' });

    const business = await Business.create({
      name: name.trim(), category, contact, whatsapp, address, description,
      localityId: req.localityId, addedBy: req.userId,
    });
    res.status(201).json({ business });
  } catch (err) { next(err); }
};
