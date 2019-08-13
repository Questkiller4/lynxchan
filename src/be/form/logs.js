'use strict';

var url = require('url');
var aggregatedLogs = require('../db').aggregatedLogs();
var miscOps = require('../engine/miscOps');
var formOps = require('../engine/formOps');
var domManipulator = require('../engine/domManipulator').dynamicPages.miscPages;

exports.getMinDate = function(informedYear) {

  var date = new Date();

  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCDate(1);
  date.setUTCMilliseconds(0);
  date.setUTCMonth(0);

  if (informedYear) {

    var parsedYear = +informedYear;

    if (parsedYear) {
      date.setUTCFullYear(parsedYear);
    }
  }

  return date;

};

exports.process = function(req, res) {

  var parameters = url.parse(req.url, true).query;
  var date = exports.getMinDate(parameters.year);
  var json = parameters.json;

  var maxDate = new Date(date);

  maxDate.setUTCFullYear(maxDate.getUTCFullYear() + 1);

  aggregatedLogs.aggregate([ {
    $match : {
      date : {
        $gte : date,
        $lt : maxDate
      }
    }
  }, {
    $sort : {
      date : -1
    }
  }, {
    $group : {
      _id : '$boardUri',
      dates : {
        $push : '$date'
      }
    }
  }, {
    $sort : {
      _id : 1
    }
  } ]).toArray(function gotDates(error, results) {

    if (error) {
      formOps.outputError(error, 500, res, req.language, json);
    } else {

      if (json) {
        formOps.outputResponse('ok', results.map(function(element) {
          element.boardUri = element._id;
          delete element._id;
          return element;
        }), res, null, null, null, true);
      } else {
        res.writeHead(200, miscOps.getHeader('text/html'));
        res.end(domManipulator.logs(results, req.language));
      }
    }

  });

};