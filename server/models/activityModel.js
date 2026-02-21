const mongoose = require("mongoose");
const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for system actions
    },

    actionType: {
      type: String,
      enum: ["system", "users", "parking", "gate"],
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
      ],
    },

    description: {
      type: String,
      required: true,
      // Human-readable summary
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
      ],
      required: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      refPath: "entityType",
      default: null,
      // dynamically reference the proper collection
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
      /* Example metadata: 
       { semesterId, amount, slotId, oldValue, newValue, ip, device } 
    */
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
