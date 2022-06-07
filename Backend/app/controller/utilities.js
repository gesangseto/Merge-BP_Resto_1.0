"use strict";
const response = require("../response");
const models = require("../models");
const utils = require("../utils");
const perf = require("execution-time")();
const fs = require("fs");
var path = require("path");

exports.printBill = async function (req, res) {
  var data = { data: req.query };
  try {
    let header = "printer_template/" + process.env.CONF_PRINT_HEADER;
    let content = "printer_template/" + process.env.CONF_PRINT_CONTENT;
    let footer = "printer_template/" + process.env.CONF_PRINT_FOOTER;
    let startField = process.env.CONF_PRINT_START_FIELD;
    let endField = process.env.CONF_PRINT_END_FIELD;
    let txtFile = "";
    // HEADER
    header = await utils.getFileContent(header);
    content = await utils.getFileContent(content);
    footer = await utils.getFileContent(footer);
    data.data = header + content + footer;
    return response.response(data, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.getKasirStatus = async function (req, res) {
  var data = { data: req.query };
  try {
    perf.start();
    var query = `
    SELECT  *
    FROM posses AS a
    WHERE a.endtime IS NULL `;
    for (const k in req.query) {
      if (k != "page" && k != "limit") {
        query += ` AND a.${k}='${req.query[k]}'`;
      }
    }
    if (req.query.page || req.query.limit) {
      var start = 0;
      if (req.query.page > 1) {
        start = parseInt((req.query.page - 1) * req.query.limit);
      }
      var end = parseInt(start) + parseInt(req.query.limit);
      query += ` LIMIT ${start},${end} `;
    }
    const _data = await models.get_query(query);
    return response.response(_data, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
