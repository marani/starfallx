var formidable = require('formidable'),
    fs = require('fs'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    CourseSchema = require('../models/course.js').CourseSchema;
    
var password = 'lyra',
    CourseModel, saveCount, recordCount, startTick, tmpFilePath;

/**
 * CallbackFactory, closing savedValue for logging purpose
 */
function buildUpdateCallback(savedValue, done) {
    return function (err, numberAffected, raw) {
        saveCount +=1;
        // console.log(numberAffected);
        if (err) 
            console.log(err, saveCount, courseList.length, 'course code: ', savedValue[1]);
        // else 
            // console.log('mongo stored', savedValue, saveCount);
        if (saveCount == recordCount) {
            console.log('Finished all updates in', + new Date() - startTick, 'ms');
            fs.unlink(tmpFilePath, function() {
                console.log('DB update finished, deleted temp file');
                CourseModel.count({}, function(err, count) {
                    console.log('Doc count:', count);
                    done();
                });
            });
        }
    }
}

exports.update = function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/';
    form.keepExtensions = false;
    form.parse(req, function(err, fields, files) {
        for (name in files) {
            var file = files[name];
            fs.readFile(file.path, 'utf8', function(err, data) {
                console.log(crypto.createHash('md5').update(data + password).digest('hex'));
                console.log(req.params);
                if (crypto.createHash('md5').update(data + password).digest('hex') != req.params['hash']) {
                    res.send('No.');
                    return;
                }

                var year = req.params['year'];
                var sem = req.params['sem'];
                // var modelName = 'c' + year + '' + sem + 'server';
                var modelName = 'c' + year + '' + sem;
                console.log('Target collection:','<' + modelName + '>');
                CourseModel = mongoose.model(modelName, CourseSchema);
                // console.log(CourseModel);
                
                var courseDict = JSON.parse(data);
                // fs.writeFileSync('cs3.json', data);
                tmpFilePath = file.path;
                saveCount = 0;
                recordCount = 0;
                for (code in courseDict)
                    if (courseDict.hasOwnProperty(code))
                        recordCount++;
                startTick = + new Date();
                console.log('There are', recordCount, 'courses');
                console.log('Start updating db..');
                for (code in courseDict) {
                    CourseModel.update(
                        { 'code': code },
                        courseDict[code],
                        { upsert: true },
                        buildUpdateCallback([code], function() {
                            res.send('Done.');
                        })
                    );
                }
            });
            break;
        }
    });
};

exports.get = function(req, res) {
    var modelName = 'c' + req.params['year'] + '' + req.params['sem'];
    CourseModel = mongoose.model(modelName, CourseSchema);
    CourseModel.findOne({ code: req.params['code'] }, function(err, doc) {
        if (err) {
            console.log(err);
            res.json({status: 'error', detail: err});
        } else 
            res.json(doc);
    });
};