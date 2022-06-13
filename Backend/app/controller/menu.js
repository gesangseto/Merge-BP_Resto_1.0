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

    var query = `SELECT row_number() OVER() -1 AS index, *, '${server_ip}/api/master/picture?linkno=' || a.itemid AS link_picture 
    FROM vwpricelistall as v 
    left join item AS a on v.itemid =a.itemid 
    left join itgrp as b on a.itgrpid =b.itgrpid
    left join itemkitchen as c on a.itemid = c.itemid 
    WHERE b.ispos is true and c.ispos is true and a.active is true
    `;
    for (const k in req.query) {
      if (k != "page" && k != "limit" && k != "sort_by" && k != "sort_asc") {
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
    if (req.query.sort_by) {
      query += ` ORDER BY ${req.query.sort_by} `;
      query += req.query.sort_asc ? ` ASC` : " DESC";
    }
    const check = await models.exec_query(query);
    return response.response(check, res, false);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.getOpenMenu = async function (req, res) {
  var data = { data: req.query };
  try {
    // LINE WAJIB DIBAWA
    perf.start();

    let ip = req.connection.localAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7);
    }
    let server_ip = `http://${ip}:${process.env.APP_PORT}`;

    let query = `
    SELECT row_number() OVER() -1 AS index, *, true AS is_openmenu, '${server_ip}/api/master/picture?linkno=' || a.itemid AS link_picture 
    FROM vwpricelistall as v 
    left join item AS a on v.itemid =a.itemid 
    left join itgrp as b on a.itgrpid =b.itgrpid
    left join itemkitchen as c on a.itemid = c.itemid 
    WHERE a.itemid in (SELECT freg('OPENMENU'))`;
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
    const check = await models.get_query(query);
    return response.response(check, res, false);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.update = async function (req, res) {
  var data = { data: req.body };
  try {
    perf.start();
    req.body.created_by = req.headers.user_id;
    const require_data = ["itemid"];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    await models.addColumnItem();
    let _update = await models.generate_query_update({
      table: "item",
      values: req.body,
      key: "itemid",
    });
    let _res = await models.exec_query(_update);
    return response.response(_res, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
