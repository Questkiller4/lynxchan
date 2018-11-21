'use strict';

var formOps = require('../engine/formOps');
var lang = require('../engine/langOps').languagePack;
var modOps = require('../engine/modOps').edit;
var mandatoryParameters = [ 'boardUri', 'threadId' ];

exports.saveThreadSettings = function(user, parameters, res, auth, language) {

  if (formOps.checkBlankParameters(parameters, mandatoryParameters, res,
      language)) {
    return;
  }

  modOps.setThreadSettings(user, parameters, language,
      function setThreadSettings(error) {
        if (error) {
          formOps.outputError(error, 500, res, language, null, auth);
        } else {
          var redirectLink = '/mod.js?boardUri=' + parameters.boardUri;
          redirectLink += '&threadId=' + parameters.threadId;
          formOps.outputResponse(lang(language).msgThreadSettingsSaved,
              redirectLink, res, null, auth, language);
        }

      });
};

exports.process = function(req, res) {

  formOps.getAuthenticatedPost(req, res, true, function gotData(auth, userData,
      parameters) {
    exports.saveThreadSettings(userData, parameters, res, auth, req.language);
  });

};