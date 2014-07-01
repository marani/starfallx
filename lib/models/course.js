var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimeSlotSchema = new Schema({
    remark: {
        type: String,
        enum: ["O", "M", "N"] //Online, Missing Values, Normal
    }, 
    startTime: Number,
    endTime: Number,
    weeks: [{
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    }],
    day: {
        type: String,
        enum: ['NA', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    },
    slotType: String,
    group: String,
    location: String
});

var IndexSchema = new Schema({
    code: String,
    timeSlots: [TimeSlotSchema]
});


var CourseSchema = new Schema({
    code: { 
        type: String,
        index: {
            unique: true
        }
    },
    title: String,
    // year: Number,
    // semester: Number,
    examDate: String,
    aus: Number,
    auTypes: [String],
    mutualExclusives: [String],
    preRequisites: [String],
    indexes: [{
        code: String,
        timeSlots: [{
            remark: {
                type: String,
                enum: ["O", "M", "N"] //Online, Missing Values, Normal
            }, 
            startTime: Number,
            endTime: Number,
            weeks: [{
                type: Number,
                enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            }],
            day: {
                type: String,
                enum: ['NA', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
            },
            slotType: String,
            group: String,
            location: String
        }]
    }],
});

var IndexRestrictSchema = new Schema({
    programme: { 
        type: String,
        index: {
            unique: true
        }
    },
    title: {
        type: String,
        index: {
            unique: true
        }
    },
    // year: Number,
    // semester: Number,
    courses: [{
        code: String,
        indexes: [String]
    }]
});

//TODO:
//  validate model data, see user.js

exports.CourseSchema = CourseSchema;
// exports.IndexSchema = IndexSchema;
// exports.TimeSlotSchema = TimeSlotSchema;