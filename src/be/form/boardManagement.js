'use strict';

var boardOps = require('../engine/boardOps').meta;
var url = require('url');
var miscOps = require('../engine/miscOps');
var jsonBuilder = require('../engine/jsonBuilder');
var dom = require('../engine/domManipulator').dynamicPages.managementPages;
var formOps = require('../engine/formOps');

function getBoardManagementData(board, userData, res, json) {

  boardOps.getBoardManagementData(userData, board, function gotManagementData(
      error, boardData, reports) {
    if (error) {
      formOps.outputError(error, 500, res);
    } else {
      res.writeHead(200, miscOps.corsHeader(json ? 'application/json'
          : 'text/html'));

      if (json) {
        res.end(jsonBuilder.boardManagement(userData, boardData, reports));
      } else {
        res.end(dom.boardManagement(userData, boardData, reports));
      }

    }
  });
}

exports.process = function(req, res) {

  formOps.getAuthenticatedPost(req, res, false,
      function gotData(auth, userData) {
        var parameters = url.parse(req.url, true).query;

        getBoardManagementData(parameters.boardUri, userData, res,
            parameters.json);
      });
};