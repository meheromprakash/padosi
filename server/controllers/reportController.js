const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/reports — File a moderation report
exports.createReport = asyncHandler(async (req, res) => {
  const { targetId, targetType, reason } = req.body;
  const userId = req.userId;

  if (!targetId || !targetType || !reason?.trim()) {
    return res.status(400).json({ success: false, message: 'Target ID, type, and reason are required' });
  }

  const report = await Report.create({
    reporterId: userId,
    targetId,
    targetType,
    reason: reason.trim(),
  });

  res.status(201).json({
    success: true,
    message: 'Report submitted successfully. Thank you for keeping Padosi safe.',
    report,
  });
});
