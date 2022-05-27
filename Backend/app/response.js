"use strict";
const moment = require("moment");

exports.response = function (data = null, res, useLog = true) {
  var body_res = {
    currentTime:
      moment().format("Y-MM-D") + " " + moment().format("HH:mm:ss:SSS"),
    error: data.error || false,
    message: data.message || null,
    total: data.error ? null : data.total || 0,
    total_row: data.error ? null : data.total_row || 0,
    data: data.data || [],
  };
  if (data.status_code) {
    body_res.status_code = data.status_code;
  }

  // Create Log On Response
  if (useLog) {
    console.log(`res : ${JSON.stringify(body_res)}`);
  } else {
    let res = {
      currentTime: body_res.currentTime,
      error: body_res.error,
      message: body_res.message,
    };
    console.log(`res : ${JSON.stringify(res)}`);
  }
  // End Create Log On Response
  res.json(body_res);
  res.end();
};
