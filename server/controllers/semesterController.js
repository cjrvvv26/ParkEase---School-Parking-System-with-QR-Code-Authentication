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

    // Calculate final revenue before expiring
    const paidStudentsCount = await Student.countDocuments({
      "payment.isPaid": true,
      "payment.semesterId": semester._id,
    });
    const finalRevenue = paidStudentsCount * semester.slotPrice;

    // Update semester status to expired and save final revenue
    semester.status = "expired";
    semester.revenue = finalRevenue;
    await semester.save();

    // Get all students from this semester to unassign from slots
    const studentsToUnassign = await Student.find({
      "payment.semesterId": semester._id,
    }).select("userId");

    const studentUserIds = studentsToUnassign.map((s) => s.userId);

    // Reset all students' paid status, payment amount, and semesterId for this semester
    await Student.updateMany(
      {
        "payment.isPaid": true,
        "payment.semesterId": semester._id,
      },
      {
        "payment.isPaid": false,
        "payment.amount": 0,
        "payment.semesterId": null,
        hasPaidCurrentSemester: false,
        assignedSlot: null,
      },
    );

    // Remove these students from their assigned slots
    await Slot.updateMany(
      { assignedStudentId: { $in: studentUserIds } },
      { $set: { assignedStudentId: null, status: "available" } },
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

    // Calculate total revenue - use stored revenue for expired semesters, calculate for active
    let totalRevenue = 0;
    let highestEarningSemester = null;
    let highestRevenue = 0;

    for (const semester of allSemesters) {
      let semesterRevenue = semester.revenue || 0;

      // If semester is active, calculate revenue in real-time since stored revenue might be stale
      if (semester.status === "active") {
        const paidStudentsCount = await Student.countDocuments({
          "payment.isPaid": true,
          "payment.semesterId": semester._id,
        });
        semesterRevenue = paidStudentsCount * semester.slotPrice;
      }

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

// Get current and last semester revenue
exports.getSemesterRevenueData = async (req, res) => {
  try {
    // Get current active semester
    const currentSemester = await Semester.findOne({ status: "active" });

    // Get last (most recent expired) semester
    const lastSemester = await Semester.findOne({ status: "expired" }).sort({
      createdAt: -1,
    });

    // Calculate revenue for current semester
    let currentRevenue = 0;
    if (currentSemester) {
      const currentPaidStudents = await Student.countDocuments({
        "payment.isPaid": true,
        "payment.semesterId": currentSemester._id,
      });
      currentRevenue = currentPaidStudents * currentSemester.slotPrice;
    }

    // Use stored revenue for last semester (since it's expired and students are reset)
    let lastRevenue = 0;
    if (lastSemester) {
      lastRevenue = lastSemester.revenue || 0;
    }

    // Calculate percentage change
    let percentageChange = 0;
    if (lastRevenue > 0) {
      percentageChange = Math.round(
        ((currentRevenue - lastRevenue) / lastRevenue) * 100,
      );
    }

    res.status(200).json({
      success: true,
      data: {
        currentSemester: {
          name: currentSemester?.name || "No active semester",
          revenue: currentRevenue,
        },
        lastSemester: {
          name: lastSemester?.name || "No previous semester",
          revenue: lastRevenue,
        },
        percentageChange,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
