/* Only init   */

"use strict";
const Joi = require("joi");
const User = require("../../models/user.model");
const Project = require("../../models/project.model");
const Task = require("../../models/task.model");
const mongoose = require("mongoose");

function objectId() {
  return Joi.string().regex(/^[0-9a-fA-F]{24}$/, "valid mongo id");
}

const projectSchema = Joi.object().keys({
  _id: objectId(), // objectId
  project_name: Joi.string().required().max(250, "utf8"),
  project_customer: Joi.string(),
  description: Joi.string(), //.max(250, 'utf8'),// just like gitlab
  status: Joi.string(),
  private: Joi.boolean(), // Default set to false in mongoose part
  time_start: Joi.date().timestamp(),
  time_due: Joi.date().timestamp(),
  creater_id: Joi.string().required(), // objectId
  assigned: Joi.array().items(Joi.string()),
  sub_tasks: Joi.array().items(Joi.string(), objectId()),
  budget: Joi.number(),
});

// * Define the search term
const projectSearchSchema = Joi.object().keys({
  searchTerm: Joi.string().max(256, "utf8").allow(""),
});

const projectPremissionSchema = Joi.object().keys({
  user_id: objectId().required(),
  project_id: objectId().required(),
  removecheckbox: Joi.boolean().required(),
});

module.exports = {
  all_projects,
  add_project,
  new_project,
  get_project,
  update_project,
  project_update_put,
  project_delete,
  project_detail_get,
  project_search_post,
  project_list_get,
  project_prikklok_get,
  project_users_get,
  project_premissions_put,
  projects_get_year,
};

async function all_projects(req, res) {
  let user_id = req.user._id.toString();
  let project_list = await Project.aggregate([
    {
      $match: {
        assigned: {
          $nin: [user_id],
        },
      },
    },
    {
      $project: {
        _id: 1,
        project_name: 1,
      },
    },
  ]);
  return res.json(project_list);
}

async function new_project(req, res) {
  const project = new Project({
    project_name: req.body.projectName,
    project_customer: req.body.projectClient,
    description: req.body.description,
    private: true,
    time_start: req.body.startDate,
    time_due: req.body.dueDate,
    creater_id: mongoose.Types.ObjectId(req.user._id),
    assigned: req.body.assignedSelect1,
    tasks: req.body.tasks,
    createdAt: new Date(),
  });

  project.save((error, project) => {
    if (error) {
      console.log("Failed to save project", error);
    } else {
      console.log("Project saved successfully", project);
    }
  });
  const success = true;
  return res.json(success);
}

async function add_project(req, res) {
  let project_id = req.body.id;
  let user_id = req.user._id.toString();
  await Project.findByIdAndUpdate(
    project_id,
    { $push: { assigned:  user_id} }
  );
  const success = true;
  return res.json(success);
}


async function get_project(req, res) {
  let project_id = req.body.id;
  let project = await Project.findById(project_id);
  return res.json(project);
}

async function update_project(req, res) {
  let project_id = req.body.projectId;
  await Project.findByIdAndUpdate(project_id, {
    project_name: req.body.projectName,
    time_start: req.body.startDate,
    time_due: req.body.dueDate,
    project_customer: req.body.projectClient,
    description: req.body.description,
    tasks: req.body.tasks,
    assigned: req.body.assignedUsers
  }, { new: true });
  const success = true;
  return res.json(success);
}














async function project_update_put(req, res) {
  const result = Joi.validate(req.body, projectSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error.name, success: false });
  }

  let updated_project = await Project.findByIdAndUpdate(
    result.value._id,
    result.value,
    { new: true }
  ); // new for update return

  return res.json({ updated_project, success: true });
}

async function project_delete(req, res) {
  let removed_object = await Project.findByIdAndRemove(req.params.id);
  return res.json({ removed_object });
}

async function project_detail_get(req, res) {
  console.log(req.params.id);

  let jsondata = await Project.find({ _id: req.params.id }); // params.id -> getting from url

  return res.json(jsondata);
}

async function project_prikklok_get(req, res) {
  let _id = String(req.user._id);

  let user_assigned_projects = await Project.aggregate([
    {
      $match: {
        assigned: { $in: [_id] },
        status: "active",
      },
    },
  ]);

  // console.timeEnd("projects_list_get"); // 5 ms
  user_assigned_projects.success = true;
  return res.json(user_assigned_projects);
}

//  not used
async function project_search_post(req, res) {
  const result = Joi.validate(req.body, projectSearchSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error.name, success: false }); // for debugging; when  release needs .name
  }

  console.log("search term: ", result.value.searchTerm);
  if (!result.value.searchTerm || result.value.searchTerm === "") {
    // console.log("adfafafaf\n\n\n");

    let project_list = await Project.find(null, null, {
      limit: 25,
      sort: { createdAt: -1 },
    });
    return res.json({ project_list, success: true });
  }

  let project_list = await Project.aggregate([
    {
      $match: {
        $text: {
          $search: result.value.searchTerm,
          $caseSensitive: false,
        },
      },
    },
    {
      $project: {
        _id: 1,
        project_name: 1,
        description: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $limit: 250 },
  ]);
  // limit in bouwen

  return res.json({ project_list, success: true });
}

// removed ?
async function project_list_get(req, res) {
  var _id = req.user._id;
  // console.log(_id);

  let user_assigned_projects = await Project.aggregate([
    {
      $match: {
        assigned: { $in: [String(_id)] },
      },
    },
  ]);

  // console.log("\n\n\nuser_assigned_projects",user_assigned_projects,"\n\n\n");
  // let project_list;

  // console.timeEnd("projects_list_get"); // 5 ms
  user_assigned_projects.success = true;
  return res.json(user_assigned_projects);
}

async function project_users_get(req, res) {
  /* Users with premissions to questions can get a list of all users with prikklok in there name */
  // get list of users with project thingy
  let user_list = await User.aggregate([
    {
      $project: {
        username: 1,
        email: 1,
      },
    },
  ]);

  return res.json({ user_list, success: true });
}

async function project_premissions_put(req, res) {
  const result = Joi.validate(req.body, projectPremissionSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error.name });
  }

  let user_id = result.value.user_id;

  if (result.value.removecheckbox === true) {
    let update = {
      $pull: { assigned: user_id }, // REMOVE REMOVE REMOVE
    };
    console.log(update);

    await Project.findByIdAndUpdate(result.value.project_id, update);
  } else {
    let update = {
      $addToSet: { assigned: [user_id] },
    };
    await Project.findByIdAndUpdate(result.value.project_id, update);
  }

  let response = await Project.findById(result.value.project_id);
  return res.json({ response, success: true });
}

/**
 * @brief Return for each project, task and event their stuff [unfinished]
 * @param None
 * @retval array with jsons if success
 */

async function accounting_user_get(req, res) {
  return;

  const result = Joi.validate(req.body, accountingGetSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error, success: false });
  }

  if (!req.user.roles.includes("admin")) {
    // TODO fix that this is new user premission
    return res.json({ error: "No premission", success: true });
  }

  let user_assigned_project = await Project.aggregate([
    // {
    //     $match: {
    //         "_id": { "$eq": mongoose.Types.ObjectId(project_id) }
    //     }
    // },
    {
      $project: {
        _id: 1,
        project_name: 1,
        sub_tasks: 1,
      },
    },
  ]);

  for (let index = 0; index < user_assigned_project.length; index++) {
    user_assigned_project[index].sub_tasks = await Task.aggregate([
      {
        $match: {
          _id: {
            $in: user_assigned_project[index].sub_tasks.map(
              mongoose.Types.ObjectId
            ),
          },
        },
      },
      {
        $project: {
          _id: 1,
          task_name: 1,
          clock_out_events: 1,
        },
      },
    ]);

    // console.log(user_assigned_project);

    // * Get the clock out event with their week number
    for (let j = 0; j < user_assigned_project[j].sub_tasks.length; j++) {
      if (
        user_assigned_project[index].sub_tasks[j] &&
        user_assigned_project[index].sub_tasks[j].clock_out_events
      ) {
        user_assigned_project[index].sub_tasks[j].clock_out_events =
          await Event.aggregate([
            {
              $match: {
                _id: {
                  $in: user_assigned_project[index].sub_tasks[
                    j
                  ].clock_out_events.map(mongoose.Types.ObjectId),
                },
              },
            },
            {
              $project: {
                _id: 0,
                // "time_start": 1,
                // "time_stop": 1,
                user_id: 1,
                week: { $week: "$time_start" },
                hour: { $add: [{ $hour: "$time_stop" }, 1] },
              },
            },
          ]);
      }
    }
  }

  const accounting_info = {
    // clock_events: clock_events,
    user_assigned_project: user_assigned_project,
    // project_id: project_id,
    success: true,
  };

  return res.json(accounting_info);
}

/**
 * @brief Get project list with their info for the project frontpage
 * @param id the date of the year the info should come from
 * @retval array with jsons object of all the projects that year
 */
async function projects_get_year(req, res) {
  if (!req.user.roles.includes("admin")) {
    // TODO fix that this is new user premission
    return res.json({ error: "No premission", success: true });
  }

  let year = new Date(req.params.id).getFullYear();
  let year_end = new Date(year + 1, 0, 1);
  let year_start = new Date(year, 0, 1);

  let projects_year = await Project.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { time_start: { $lt: year_end } },
              { time_start: { $exists: false } },
            ],
          },
          {
            $or: [
              { time_due: { $gt: year_start } },
              { time_due: { $exists: false } },
            ],
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        project_name: 1,
        status: 1,
        project_customer: 1,
        description: 1,
        time_start: 1,
        time_due: 1,
      },
    },
  ]);

  // console.log(projects_year);

  return res.json({ success: true, projects: projects_year });
}
