angular.module('starfallxApp')
    .service('Course', function(params) {
        params = params || {};
        this.year = params.year;
        this.semester = params.semester;
        this.code = params.moduleCode;
        this.indexes = params.indexes || [];
        this.examDate = params.examDate;
        this.aus = params.aus;
        this.auTypes = params.auTypes;

        this.mutualExcusives = params.mutualExclusives || [];
        this.preRequisite = params.preRequisite || [];
    })
    .service('Index', function(params) {
        params = params || {};
        this.code = params.code;
        this.timeSlots = params.timeSlots || {};
    })
    .service('TimeSlot', function(params) {
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.weeks = params.weeks;
        this.day = params.day;
        this.slotType = params.slotType;
        this.location = params.location;
    })
