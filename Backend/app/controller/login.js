"use strict";
const response = require("../response");
const models = require("../models");
const utils = require("../utils");
const perf = require("execution-time")();
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config(); //- MYSQL Module
const crypto = require("crypto");

exports.login_sales = async function (req, res) {
  // LINE WAJIB DIBAWA
  perf.start();

  var data = { data: req.body };
  const require_data = ["email", "password"];
  for (const row of require_data) {
    if (!req.body[`${row}`]) {
      data.error = true;
      data.message = `${row} is required!`;
      return response.response(data, res);
    }
  }

  let body = req.body;
  // LINE WAJIB DIBAWA
  body.password = crypto.createHash("md5").update(body.password).digest("hex");
  let $query = `
  SELECT * FROM srep AS a 
  WHERE a.email='${body.email}' AND a.passwd='${body.password}' LIMIT 1`;
  var check = await models.exec_query($query);
  if (check.error || check.data.length == 0) {
    check.error = true;
    check.message = "Wrong Username Or Password !";
    return response.response(check, res);
  }
  return response.response(check, res);
};
