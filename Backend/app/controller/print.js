"use strict";
const response = require("../response");
const models = require("../models");
const utils = require("../utils");
const perf = require("execution-time")();
const fs = require("fs");
var path = require("path");

exports.get = async function (req, res) {
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

exports.printBill = async function (req, res) {
  var data = { data: req.query };
  try {
    const require_data = ["billno"];
    for (const row of require_data) {
      if (!req.query[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    // LINE WAJIB DIBAWA
    var query = `
    SELECT  *
    FROM bill AS a
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
    var header = await models.get_query(query);
    if (header.error) {
      return response.response(header, res);
    }
    header = header.data[0];
    query = `SELECT 
    MAX(billno) as billno, 
    MAX(c.itemdesc) as itemdesc, 
    SUM(c.qty) as qty,
    MIN(c.subtotal) as price, 
    SUM(c.baseprice) as total
    FROM billso AS a
      LEFT JOIN so AS b ON a.sono = b.sono
      LEFT JOIN sod AS c ON b.sono = c.sono
      WHERE a.billno =  '${header.billno}'
      group  by c.itemid `;
    let so = [];
    console.log(query);
    let get_so = await models.exec_query(query);
    // console.log(get_so);
    return;
    let ip = req.connection.localAddress;
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7);
    }
    let server_ip = `http://${ip}:${process.env.APP_PORT}`;

    let can_cancel = true;
    for (const it of get_so.data) {
      query = `SELECT *, '${server_ip}/api/master/picture?linkno='  || a.itemid AS link_picture FROM sod AS a WHERE sono = '${it.sono}'`;
      let get_item = await models.exec_query(query);
      for (const sod of get_item.data) {
        if (sod.isclosed === false) {
          can_cancel = false;
        }
      }
      it.data = get_item.data;
      so.push(it);
    }
    data.total = 1;
    data.total_row = 1;
    data.data = [];
    data.data.push(header);
    data.data[0].so = so;
    return response.response(data, res);
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
