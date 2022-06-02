"use strict";
const response = require("../response");
const models = require("../models");
const perf = require("execution-time")();
const fs = require("fs");
var path = require("path");

exports.get = async function (req, res) {
  var data = { data: req.query };
  try {
    let file = process.env.CONF_PRINT_TEMPLATE;
    let startField = process.env.CONF_PRINT_START_FIELD;
    let endField = process.env.CONF_PRINT_END_FIELD;
    let txtFile = "";

    fs.readFile(path.resolve(file), "utf8", function (e, hasil) {
      if (e) {
        data.error = true;
        data.message = e;
      }
      data.data = hasil;
      return response.response(data, res);
    });
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
