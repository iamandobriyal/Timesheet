const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      required: true,
      unique: true,
    },
    project_customer:{
      type: String,
      required: true,
    },
    description: String,
    private: {
      type: Boolean,
      default: true,
    },
    time_start: Date,
    time_due: Date,
    creater_id: {
      type: Object,
      required: true,
    },
    assigned: [Object],
    tasks: {
      type: [String],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

projectSchema.index(
  {
    project_name: "text",
    description: "text",
  },
  {
    weights: {
      project_name: 5,
      description: 5,
    },
  }
);

// The init of the scheme
module.exports = mongoose.model("project", projectSchema);
