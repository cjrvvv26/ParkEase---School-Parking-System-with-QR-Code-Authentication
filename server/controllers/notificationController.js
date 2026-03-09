const Notification = require('../models/notificationModel');
const Student = require('../models/studentModel');
const Guard = require('../models/guardModel');
const SuperAdmin = require('../models/superAdminModel');
//const Faculty = require('../models/facultyModel');
const mongoose = require('mongoose');

exports.getNotifications = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10, type = 'all' } = req.query;
    console.log(req.query);

    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (type === 'read') query.read = true;
    if (type === 'unread') query.read = false;

    const notifications = await Notification.find(query)
      .populate('userId', 'role profileDetails username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Notification.countDocuments(query);

    const notificationsData = [];

    for (const notif of notifications) {
      let fullName = 'System';

      if (notif.userId) {
        const { _id, role } = notif.userId;

        if (role === 'student') {
          const student = await Student.findOne({ userId: _id }).select('name');
          if (student)
            fullName = `${student.name.firstName} ${student.name.lastName}`;
        }

        if (role === 'guard') {
          const guard = await Guard.findOne({ userId: _id }).select('name');
          if (guard)
            fullName = `${guard.name.firstName} ${guard.name.lastName}`;
        }

        if (role === 'super admin') {
          const superAdmin = await SuperAdmin.findOne({ userId: _id }).select(
            'name',
          );
          if (superAdmin) fullName = superAdmin.name;
        }
      }

      notificationsData.push({
        ...notif.toObject(),
        userFullName: fullName,
      });
    }

    res.status(200).json({
      notifications: notificationsData,
      total,
      current: notifications.length + skip,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    let fullName = 'System';
    const notification = await Notification.findById(id).populate(
      'userId',
      'username role profileDetails status',
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId) {
      const { _id, role } = notification.userId;

      if (role === 'student') {
        const student = await Student.findOne({ userId: _id }).select('name');
        if (student)
          fullName = `${student.name.firstName} ${student.name.lastName}`;
      }

      if (role === 'guard') {
        const guard = await Guard.findOne({ userId: _id }).select('name');
        if (guard) fullName = `${guard.name.firstName} ${guard.name.lastName}`;
      }

      if (role === 'super admin') {
        const superAdmin = await SuperAdmin.findOne({ userId: _id }).select(
          'name',
        );
        if (superAdmin) fullName = superAdmin.name;
      }
    }

    const notificationData = {
      ...notification.toObject(),
      userFullName: fullName,
    };

    res.status(200).json({ notification: notificationData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
