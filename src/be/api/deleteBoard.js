'use strict';

var apiOps = require('../engine/apiOps');
var deletionOps = require('../engine/deletionOps').miscDeletions;

exports.deleteBoard = function(auth, userData, parameters, res, language) {

  if (apiOps.checkBlankParameters(parameters, [ 'boardUri' ], res)) {
    return;
  }

  deletionOps.board(userData, parameters, language,
      function deletedBoard(error) {
        if (error) {
          apiOps.outputError(error, res, auth);
        } else {
          apiOps.outputResponse(auth, null, 'ok', res);
        }
      });
};

exports.process = function(req, res) {

  apiOps.getAuthenticatedData(req, res, function gotData(auth, userData,
      parameters) {

    exports.deleteBoard(auth, userData, parameters, res, req.language);
  });
};