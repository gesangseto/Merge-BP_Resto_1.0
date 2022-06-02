"use strict";
const response = require("../response");
const models = require("../models");
const sp = require("../sp");
const utils = require("../utils");
const perf = require("execution-time")();

const default_status = [
  {
    hoststatuscode: "KSNG",
    hoststatusdesc: "KOSONG",
    hoststatuscolor: "#3dd167",
  },
  {
    hoststatuscode: "DINE",
    hoststatusdesc: "DINE IN",
    hoststatuscolor: "#bccc41",
  },
  {
    hoststatuscode: "ORDER",
    hoststatusdesc: "ORDER ON",
    hoststatuscolor: "#455fd1",
  },
  {
    hoststatuscode: "PAID",
    hoststatusdesc: "PAID OFF",
    hoststatuscolor: "#4ab8ba",
  },
  {
    hoststatuscode: "RESERVED",
    hoststatusdesc: "RESERVASI",
    hoststatuscolor: "#c7c5c5",
  },
  {
    hoststatuscode: "BILL",
    hoststatusdesc: "BILL ON",
    hoststatuscolor: "#c94f49",
  },
];

const color_map = {
  KSNG: "#3dd167",
  DINE: "#bccc41",
  ORDER: "#455fd1",
  PAID: "#4ab8ba",
  RESERVED: "#c7c5c5",
  BILL: "#c94f49",
};

exports.get = async function (req, res) {
  var data = { data: req.query };
  try {
    perf.start();
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
    let _data = [];
    for (const it of host.data) {
      if (!it.hoststatuscolor) {
        it.hoststatuscolor = color_map[it.hoststatuscode];
      }
      _data.push(it);
    }
    return response.response(host, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.get_hoststatus = async function (req, res) {
  var data = { data: req.query };
  try {
    perf.start();
    var query = `
    SELECT  *
    FROM hoststatus AS a
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
    query += ` ORDER BY hoststatuscode DESC`;
    const host = await models.exec_query(query);
    let _data = [];
    for (const it of host.data) {
      if (!it.hoststatuscolor) {
        it.hoststatuscolor = color_map[it.hoststatuscode];
      }
      _data.push(it);
    }
    host.data = _data;
    return response.response(host, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
exports.update_hoststatus = async function (req, res) {
  var data = { data: req.query };
  try {
    const require_data = [
      "hoststatuscode",
      "hoststatusdesc",
      "hoststatuscolor",
    ];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    let _update = await models.update_query({
      data: req.body,
      key: "hoststatuscode",
      table: "hoststatus",
    });
    return response.response(_update, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
