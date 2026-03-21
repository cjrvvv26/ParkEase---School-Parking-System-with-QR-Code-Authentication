const mongoose = require("mongoose");
const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    actionType: {
      type: String,
      enum: ["system", "users", "parking", "map"],
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CHANGE_THEME",
        "UPDATE_ACCOUNT",
        "UPDATE_PAYMENT_STATUS",
        "ENTRY_TIME",
        "OUT_TIME",
        "SIGN_IN",
        "REGISTER",
        "UPDATE_MAP",
        "DELETE_MAP",
        "PARKED",
        "UNPARKED",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    entityType: {
      type: String,
      enum: [
        "Semester",
        "User",
        "Slot",
        "SlotAssignment",
        "Theme",
        "Attendance",
        "Map",
      ],
      required: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      refPath: "entityType",
      default: null,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
