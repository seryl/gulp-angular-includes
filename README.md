gulp-angular-includes
=====================

Builds an `includes.(js|coffee)` for your angular `app.(js|coffee)` to support [functionality-split]("#Directory_Structure") angularjs projects.
[Gulp](http://gulpjs.com/) and [browserify](http://browserify.org/) have done a great job at making the build process straightforward so I wanted to extend that onto my angular apps.

This basically allows the following:

```javascript
'use strict';
var myApp;

myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']);

require('./includes');
```

Requirements
------------

Your gulpfile needs to have the following:

```javascript
// gulpfile.js
var gulp = require('gulp');
var gutil = require('gulp-util');
var angularinc = require('gulp-angular-includes');
var source = require('vinyl-source-stream');

var paths = {
  "angular": ["./app/*/*/*.js"]
};

gulp.task('angular_includes', function() {
  return gulp.src(paths.angular, read: false)
    .pipe(angularinc())
    .pipe(source('includes.js'))
    .pipe(gulp.dest('app')).on('error', gutil.log);
});
```

And your .gitignore should include (assuming the above pathing):

```
/app/includes.js
```

### Directory Structure

Note: `common` is always the first group in the resulting includes file.

```
.
├── app
│   ├── app.js
│   ├── common
│   │   ├── controllers
│   │   ├── directives
│   │   ├── filters
│   │   └── services
│   ├── page1
│   │   ├── controllers
│   │   │   ├── FirstCtrl.js
│   │   │   └── SecondCtrl.js
│   │   ├── directives
│   │   │   └── directive1.js
│   │   ├── filters
│   │   │   ├── filter1.js
│   │   │   └── filter2.js
│   │   └── services
│   │       ├── service1.js
│   │       └── service2.js
│   └── page2
│       ├── controllers
│       │   └── ThirdCtrl.js
│       ├── directives
│       │   ├── directive2.js
│       │   └── directive3.js
│       ├── filters
│       │   └── filter3.js
│       └── services
│           └── service3.js
├── partials
├── lib
└── test
```
