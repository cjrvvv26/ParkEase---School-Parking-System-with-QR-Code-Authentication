const Logs = require("../models/activityModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Guard = require("../models/guardModel");
const SuperAdmin = require("../models/superAdminModel");
const Faculty = require("../models/facultyModel");

async function buildLogsData(logs) {
  const logsData = [];
  for (const log of logs) {
    let fullName = 'System';
    if (log.userId) {
      const { _id, role } = log.userId;
      if (role === 'student') {
        const s = await Student.findOne({ userId: _id }).select('name');
        if (s) fullName = `${s.name.firstName} ${s.name.lastName}`;
      } else if (role === 'guard') {
        const g = await Guard.findOne({ userId: _id }).select('name');
        if (g) fullName = `${g.name.firstName} ${g.name.lastName}`;
      } else if (role === 'faculty') {
        const f = await Faculty.findOne({ userId: _id }).select('name');
        if (f) fullName = `${f.name.firstName} ${f.name.lastName}`;
      } else if (role === 'super admin') {
        const sa = await SuperAdmin.findOne({ userId: _id }).select('name');
        if (sa) fullName = sa.name;
      }
    }
    logsData.push({ ...log.toObject(), userFullName: fullName });
  }
  return logsData;
}

exports.getAllLogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { actionType } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (actionType && actionType !== 'all') {
      query.actionType = actionType;
    }

    const logs = await Logs.find(query)
      .populate('userId', 'role profileDetails username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Logs.countDocuments(query);
    const logsData = await buildLogsData(logs);

    res.status(200).json({ logs: logsData, total, current: logsData.length + skip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const mongoose = require('mongoose');
    const oid = new mongoose.Types.ObjectId(userId);

    const logs = await Logs.find({
      $or: [
        { userId: oid },
        { 'metadata.scannedUserId': oid },
        { entityId: oid },
      ],
    })
      .populate('userId', 'role profileDetails username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Logs.countDocuments({
      $or: [
        { userId: oid },
        { 'metadata.scannedUserId': oid },
        { entityId: oid },
      ],
    });

    const logsData = await buildLogsData(logs);

    res.status(200).json({ logs: logsData, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
