#Starfall 
A webapp that helps student find possible schedules faster. 

###Current state
- Starfall is online at [starfallx-marani.rhcloud.com](starfallx-marani.rhcloud.com)
- Features:
    - A course filter with group select index, show n/a index, 
    - Possible plans browsing and display.
    - Undo/Redo command stack integrated in browser's history stack
    - Bookmark to save


###Growth Direction
 - ####Unit Test
 

 - ####Important Optimizations
    - Angular memory leak with ng-repeat. Seems to be webkit issue but need to be researched more.
    - Timetable Plot's ng-class/ng-show/ng-hide watcher bindings to be changed into 1 single timetable directive with delta updating.
    - ng-mouseenters needs to be changed.
 

 - ####Filters
    At the moment filter is a set of course. Next filters will be more focused on higher level requirement, for example:
        - Filter possible plans based on student's AU requirement.
        - Filter possible plans based on student's preferred profession / career path.
        - Improve current filter, consider 'Add Course' button.
        - Decouple command stack from browser's history stack for better performance.


 - ####Cloud Schedule Integration
    - Outlook 
    - Google Calendar


 - ####Plan Analytics
    To support registration, and to 
    be used as student's daily schedule
        - Better timetable details.
        - Total class hours / lab hours / tut hours
        - How early does student need to wake up in average
        - Show/hide lecture time (evil feature)
        - Classroom map & In-Campus Travel time estimation: shortest path problems.
        - Plan comparison, operations (add/drop) to do to switch from one plan to another
        - How likely can student can register the plan.
    

 - ####User Profile and Social Features
    - Save Plan
    - Load Plan
    - Group Planning


###Contribution
- Report issues under github's issue page. Issues will be addressed as soon as possible.
- Contact me through facebook.com/yzioh if you are interested in developing this awesome app.