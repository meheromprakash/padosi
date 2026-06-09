const Alert = require('../models/Alert');

// GET /api/alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const { severity } = req.query;
    const filter = { localityId: req.localityId, isActive: true };
    if (severity && severity !== 'all') filter.severity = severity;

    const alerts = await Alert.find(filter)
      .populate('authorId', 'firstName avatar verification.verified')
      .sort({ severity: 1, createdAt: -1 })
      .limit(50)
      .lean();

    const formatted = alerts.map((a) => ({ ...a, author: a.authorId }));
    res.json({ alerts: formatted });
  } catch (err) { next(err); }
};

// POST /api/alerts
exports.createAlert = async (req, res, next) => {
  try {
    const { title, description, severity = 'medium', type = 'general' } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const alert = await Alert.create({
      title: title.trim(),
      description: description.trim(),
      severity,
      type,
      localityId: req.localityId,
      authorId: req.userId,
    });

    await alert.populate('authorId', 'firstName avatar verification.verified');

    // Emit socket event for real-time alert
    req.io?.to(`locality:${req.localityId}`).emit('alert:new', alert);

    res.status(201).json({ alert });
  } catch (err) { next(err); }
};
