/* Only init   */

"use strict";
const Joi = require("joi");
const Task = require("../../models/task.model");
const Project = require("../../models/project.model");
const Event = require("../../models/event.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

function objectId() {
  return Joi.string().regex(/^[0-9a-fA-F]{24}$/, "valid mongo id");
}

const reportSchema = Joi.object().keys({
  template: Joi.array().items(Joi.string()),
  years: Joi.array().items(Joi.string()),
  assigned: Joi.array().items(Joi.string()),
});

module.exports = {
  get_report,
  get_analytics,
};

/**
 * @brief  Convert project,user,year from database to readable user data
 * @param year array of years where only to the first position is been looked at
 * @param user array of users that are being find on the project that where active then
 * @param template the type of output template, this is ignored for now
 * @retval event to project/tasks where eacht event has some extra properties
 */
async function get_report(req, res) {
  let report = [];
  let start_date = new Date(req.body.start_date);
  let stop_date = new Date(req.body.stop_date);
  stop_date.setDate(stop_date.getDate() + 1);
  let users = req.body.assigned;
  for (let i = 0; i < users.length; i++) {
    const user_id = users[i];
    const events = await Event.find({
      $and: [
        { event_time: { $gte: start_date } },
        { event_time: { $lt: stop_date } },
      ],
      user_id: user_id,
    }).exec();

    for (let j = 0; j < events.length; j++) {
      let event = events[j];
      let user = await User.findById(event.user_id);
      console.log(user);
      if (user) {
        let project = await Project.findById(event.project_id);
        let manager = "";
        if (user.manager && user.manager !== "") {
          const managerUser = await User.findById(user.manager);
          if (managerUser) {
            manager = managerUser.fullname;
          }
        }

        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const date = event.event_time.toLocaleDateString("en-US", options);
        let row = {
          "Associate Name": user.fullname,
          "Manager Name": manager,
          "Project Name": project.project_name,
          "Project Client": project.project_customer,
          Task: event.task,
          Date: date,
          Hours: event.hours,
          Comments: event.comment,
        };
        report.push(row);
      } else {
        console.log(`User not found for ID: ${event.user_id}`);
      }
    }
  }
  res.json(report);
}

async function get_analytics(req, res) {
  let users = await User.find({}).exec();
  let projects = await Project.find({}).exec();
  let events = [];
  Event.aggregate([
    {
      $group: {
        _id: {
          user_id: "$user_id",
          project_id: "$project_id",
        },
        total_hours: { $sum: "$hours" },
      },
    },
    {
      $project: {
        _id: 0,
        user_id: "$_id.user_id",
        project_id: "$_id.project_id",
        total_hours: 1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      // handle error
      console.error(err);
    } else {
      // process result
      events = result;
      const userMap = users.reduce((map, user) => {
        map[user._id] = user.fullname;
        return map;
      }, {});

      const projectMap = projects.reduce((map, project) => {
        map[project._id] = project.project_name;
        return map;
      }, {});

      // Transform the data
      const transformedData = events.reduce((result, event) => {
        const userName = userMap[event.user_id];
        const projectName = projectMap[event.project_id];

        if (!result[userName]) {
          result[userName] = {};
        }

        result[userName][projectName] =
          (result[userName][projectName] || 0) + event.total_hours;

        return result;
      }, {});
      res.json(transformedData);
    }
  });
}
