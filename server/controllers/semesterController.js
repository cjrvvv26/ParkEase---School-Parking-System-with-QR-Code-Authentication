const Semester = require("../models/semesterModel");
const Student = require("../models/studentModel");
const Slot = require("../models/slotModel");

// Get all semesters with pagination
exports.getAllSemesters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const semesters = await Semester.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Semester.countDocuments();

    res.status(200).json({
      success: true,
      data: semesters,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get current active semester
exports.getCurrentSemester = async (req, res) => {
  try {
    const semester = await Semester.findOne({ status: "active" });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: "No active semester found",
      });
    }

    res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get semester by ID
exports.getSemesterById = async (req, res) => {
  try {
    const { id } = req.params;

    const semester = await Semester.findById(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new semester
exports.createSemester = async (req, res) => {
  try {
    console.log("Create semester request received:", req.body);
    const { name, startDate, endDate, slotPrice } = req.body;

    // Validate input
    if (!name || !startDate || !endDate || slotPrice === undefined) {
      console.log("Validation failed:", {
        name,
        startDate,
        endDate,
        slotPrice,
      });
      return res.status(400).json({
        success: false,
        error: "All fields are required: name, startDate, endDate, slotPrice",
      });
    }

    // Check if there's already an active semester
    const activeSemester = await Semester.findOne({ status: "active" });
    if (activeSemester) {
      console.log("Active semester already exists:", activeSemester._id);
      return res.status(400).json({
        success: false,
        error: "An active semester already exists. Please expire it first.",
      });
    }

    const semester = new Semester({
      name,
      startDate,
      endDate,
      slotPrice,
      status: "active",
      revenue: 0,
    });

    await semester.save();
    console.log("Semester created successfully:", semester._id);

    res.status(201).json({
      success: true,
      message: "Semester created successfully",
      data: semester,
    });
  } catch (error) {
    console.error("Error creating semester:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update semester
exports.updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only allow updating specific fields
    const allowedUpdates = ["name", "slotPrice"];
    const providedUpdates = Object.keys(updates);
    const isValidUpdate = providedUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid update fields. Only 'name' and 'slotPrice' can be updated.",
      });
    }

    const semester = await Semester.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Semester updated successfully",
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Expire semester and reset students' slots
exports.expireSemester = async (req, res) => {
  try {
    const { id } = req.params;

    const semester = await Semester.findById(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: "Semester not found",
      });
    }

    if (semester.status === "expired") {
      return res.status(400).json({
        success: false,
        error: "Semester is already expired",
      });
    }

    // Update semester status to expired
    semester.status = "expired";
    await semester.save();

    // Reset all students' paid status, payment amount, and remove slot assignments
    await Student.updateMany(
      { hasPaidCurrentSemester: true },
      {
        hasPaidCurrentSemester: false,
        assignedSlot: null,
        "payment.isPaid": false,
        "payment.amount": 0,
      },
    );

    // Update all slots to remove student assignments
    await Slot.updateMany(
      { assignedStudent: { $exists: true, $ne: null } },
      { $unset: { assignedStudent: 1 } },
    );

    res.status(200).json({
      success: true,
      message: "Semester expired and students reset for new semester",
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get semester statistics
exports.getSemesterStats = async (req, res) => {
  try {
    // Get all semesters
    const allSemesters = await Semester.find();

    // Calculate total revenue across all semesters in real-time
    let totalRevenue = 0;
    let highestEarningSemester = null;
    let highestRevenue = 0;

    for (const semester of allSemesters) {
      const paidStudentsCount = await Student.countDocuments({
        "payment.isPaid": true,
        "payment.semesterId": semester._id,
      });
      const semesterRevenue = paidStudentsCount * semester.slotPrice;
      totalRevenue += semesterRevenue;

      if (semesterRevenue > highestRevenue) {
        highestRevenue = semesterRevenue;
        highestEarningSemester = {
          id: semester._id,
          name: semester.name,
          revenue: semesterRevenue,
        };
      }
    }

    const totalSemesters = allSemesters.length;
    const averageRevenue =
      totalSemesters > 0 ? (totalRevenue / totalSemesters).toFixed(2) : 0;

    const stats = [
      { title: "Total Revenue", data: totalRevenue },
      { title: "Total Semesters", data: totalSemesters },
      { title: "Average Revenue", data: parseFloat(averageRevenue) },
      {
        title: "Highest Earning",
        data: highestEarningSemester?.revenue || "N/A",
      },
    ];

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
