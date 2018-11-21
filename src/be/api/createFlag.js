'use strict';

var apiOps = require('../engine/apiOps');
var boardOps = require('../engine/boardOps').flags;
var mandatoryParameters = [ 'flagName', 'boardUri' ];

exports.createFlag = function(auth, parameters, userData, res, language) {

  if (apiOps.checkBlankParameters(parameters, mandatoryParameters, res)) {
    return;
  }

  boardOps.createFlag(userData, parameters, language, function createdFlag(
      error, id) {
    if (error) {
      apiOps.outputError(error, res, auth);
    } else {
      apiOps.outputResponse(auth, id, 'ok', res);
    }
  });
};

exports.process = function(req, res) {

  apiOps.getAuthenticatedData(req, res, function gotData(auth, userData,
      parameters) {

    exports.createFlag(auth, parameters, userData, res, req.language);
  });
};