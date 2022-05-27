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

    let ip = req.connection.localAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7);
    }
    let server_ip = `http://${ip}:${process.env.APP_PORT}`;

    var query = `    
    SELECT row_number() OVER() -1 AS index, *, '${server_ip}/api/master/picture?linkno=' || a.itemid AS link_picture 
    FROM vwpricelistall as v 
    left join item AS a on v.itemid =a.itemid 
    left join itgrp as b on a.itgrpid =b.itgrpid
    left join itemkitchen as c on a.itemid = c.itemid 
    WHERE b.ispos is true and c.ispos is true and a.active is true 
    `;
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
    return response.response(check, res, false);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
