"use strict";
const moment = require("moment");
const response = require("../response");
const models = require("../models");
const sp = require("../sp");
const utils = require("../utils");
const perf = require("execution-time")();
var path = require("path");
// const Buffer = "buffer";

exports.get = async function (req, res) {
  var data = { data: req.query };
  try {
    perf.start();

    // LINE WAJIB DIBAWA
    const require_data = ["linkno"];
    for (const row of require_data) {
      if (!req.query[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    var query = `SELECT  * FROM pic AS a WHERE 1+1=2`;
    for (const k in req.query) {
      if (k != "page" && k != "limit") {
        query += ` AND ${k}='${req.query[k]}'`;
      }
    }
    if (req.query.page || req.query.limit) {
      var start = 0;
      if (req.query.page > 1) {
        start = parseInt((req.query.page - 1) * req.query.limit);
      }
      var end = parseInt(start) + parseInt(req.query.limit);
      query += ` LIMIT ${end} OFFSET ${start} `;
    }
    // query += ` ORDER BY b.itgrpname,a.itemdesc ASC  ;`;
    const check = await models.get_query(query);
    if (!check.error) {
      let data = check.data[0];
      if (!data) {
        return res.sendFile(path.resolve("app/assets/image/no_image.png"));
      }
      const file = Buffer.from(data.picdata, "base64");
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": file.length,
      });
      return res.end(file);
    }
    return response.response(check, res, false);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
