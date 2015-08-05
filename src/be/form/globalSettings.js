'use strict';

var formOps = require('../engine/formOps');
var miscOps = require('../engine/miscOps');
var domManipulator = require('../engine/domManipulator');

function getGlobalSettings(userData, res) {

  miscOps.getGlobalSettingsData(userData, function gotBannerData(error,
      settings) {
    if (error) {
      formOps.outputError(error, 500, res);
    } else {
      res.writeHead(200, miscOps.corsHeader('text/html'));

      res.end(domManipulator.globalSettings(settings));
    }
  });

}

exports.process = function(req, res) {

  formOps.getAuthenticatedPost(req, res, false,
      function gotData(auth, userData) {

        getGlobalSettings(userData, res);

      });

};