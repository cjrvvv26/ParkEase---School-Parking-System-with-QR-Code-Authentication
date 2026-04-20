const User = require('../models/userModel');
const Guard = require('../models/guardModel');
const mongoose = require('mongoose');

const requiredAnalyticsAccess = async (req, res, next) => {
  const { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(401).json({ error: 'Invalid Object ID' });
  }

  try {
    const user = await User.findById(id).select('role');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'super admin') {
      req.user = user;
      return next();
    }

    if (user.role === 'guard') {
      const guard = await Guard.findOne({ userId: id }).select('permissions');
      if (guard?.permissions?.canViewAnalytics) {
        req.user = { ...user.toObject(), permissions: guard.permissions };
        return next();
      }
    }

    return res
      .status(403)
      .json({ error: 'You do not have permission to view analytics data.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = requiredAnalyticsAccess;
