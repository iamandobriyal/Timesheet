const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        user_id: Object,
        project_id: Object,
        project_name: String,
        task: String,
        event_time: Date,
        current_time: Date,
        hours: Number,
        comment: String,
    },
    {
        versionKey: false
    });

// The init of the scheme
module.exports = mongoose.model('event', eventSchema);

