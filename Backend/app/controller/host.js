"use strict";
const moment = require("moment");
const response = require("../response");
const models = require("../models");
const sp = require("../sp");
const utils = require("../utils");
const perf = require("execution-time")();

exports.get = async function (req, res) {
  var data = { data: req.query };
  try {
    // LINE WAJIB DIBAWA
    perf.start();

    // const require_data = ["billno"];
    // for (const row of require_data) {
    //   if (!req.query[`${row}`]) {
    //     data.error = true;
    //     data.message = `${row} is required!`;
    //     return response.response(data, res);
    //   }
    // }

    // LINE WAJIB DIBAWA
    var query = `
    SELECT  a.*,b.*,c.*,d.hostlocationdesc
    FROM host AS a 
    left join hoststatus as b on a.hoststatuscode = b.hoststatuscode 
    left join hostcategory as c on a.hostcategoryid= c.hostcategoryid 
    left join hostlocation as d on a.hostlocationid= d.hostlocationid 
    WHERE 1+1=2 `;
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
    query += ` ORDER BY hostdesc ASC`;
    const host = await models.exec_query(query);

    var query = `
    SELECT  hostlocationdesc
    FROM hostlocation WHERE 1+1=2 `;
    return response.response(host, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
