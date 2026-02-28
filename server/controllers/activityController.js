const Logs = require("../models/activityModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Guard = require("../models/guardModel");
const SuperAdmin = require("../models/superAdminModel");
//const Faculty = require("../models/facultyModel");

exports.getAllLogs = async (req, res) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;
    const { actionType } = req.query || "all";
    const skip = (page - 1) * limit;

    let query = {};

    if (actionType !== "all") {
      query.actionType = actionType;
    }

    const logs = await Logs.find(query)
      .populate("userId", "role profileDetails username")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Logs.countDocuments();

    const logsData = [];

    for (const log of logs) {
      let fullName = "System";

      if (log.userId) {
        const { _id, role } = log.userId;

        if (role === "student") {
          const student = await Student.findOne({ userId: _id }).select("name");
          if (student)
            fullName = `${student.name.firstName} ${student.name.lastName}`;
        }

        if (role === "guard") {
          const guard = await Guard.findOne({ userId: _id }).select("name");
          if (guard)
            fullName = `${guard.name.firstName} ${guard.name.lastName}`;
        }

        if (role === "super admin") {
          const superAdmin = await SuperAdmin.findOne({ userId: _id }).select(
            "name",
          );

          if (superAdmin) fullName = superAdmin.name;
        }

        // if (role === "faculty") {
        //   const faculty = await Faculty.findOne({ userId: _id }).select("name");
        //   if (faculty)
        //     fullName = `${faculty.name.firstName} ${faculty.name.lastName}`;
        // }
      }

      logsData.push({
        ...log.toObject(),
        userFullName: fullName,
      });
    }

    res.status(200).json({
      logs: logsData,
      total,
      current: logsData.length + skip,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
