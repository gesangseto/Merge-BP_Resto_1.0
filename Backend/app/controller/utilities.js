"use strict";
const response = require("../response");
const models = require("../models");
const utils = require("../utils");
const perf = require("execution-time")();
const fs = require("fs");
const moment = require("moment");
var path = require("path");

const getDataField = async (request) => {
  let req = request;
  var query = `SELECT 
  *
  FROM bill AS a
  LEFT JOIN billso AS b ON a.billno = b.billno
  LEFT JOIN so AS c ON b.sono = c.sono
  LEFT JOIN host AS d ON a.hostid = d.hostid
  LEFT JOIN srep AS e ON a.srepid = e.srepid
  WHERE 1+1=2 `;
  for (const k in req.query) {
    if (k != "page" && k != "limit" && k != "kitchenno") {
      query += ` AND b.${k}='${req.query[k]}'`;
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
    return header;
  }
  let _field_header = {
    billno: null,
    grand_total: 0,
    crcid: null,
    custid: null,
    billto: null,
    shipto: null,
    billdate: null,
    pax: null,
    arrivetime: null,
    hostcode: null,
    hostdesc: null,
    srepid: null,
    srepname: null,
    total_variant: 0,
    total_quantity: 0,
    content: [],
  };
  for (const it of header.data) {
    _field_header.billno = it.billno;
    _field_header.grand_total += parseInt(it.total);
    _field_header.crcid = it.crcid;
    _field_header.custid = it.custid;
    _field_header.billto = it.billto;
    _field_header.shipto = it.shipto;
    _field_header.billdate = moment(it.billdate).format("DD-MM-YYYY");
    _field_header.pax = it.pax;
    _field_header.arrivetime = it.arrivetime;
    _field_header.hostcode = it.hostcode;
    _field_header.hostdesc = it.hostdesc;
    _field_header.srepid = it.srepid;
    _field_header.srepname = it.srepname ?? "";
    let get_sod = `
    SELECT 
    CASE WHEN (ispacked IS TRUE) THEN 'Bks' ELSE '-' END AS bungkus,
    CASE WHEN (iscancel IS TRUE) THEN '0' ELSE qty END AS quantity,
    * 
    FROM sod AS a
    LEFT JOIN item AS b ON a.itemid = b.itemid 
    LEFT JOIN itemkitchen AS c ON b.itemid = c.itemid
    LEFT JOIN kitchen AS d ON c.kitchenno = d.kitchenno
    WHERE sono ='${it.sono}' `;
    if (req.query.kitchenno) {
      get_sod += ` AND d.kitchenno = '${req.query.kitchenno}'`;
    }
    get_sod = await models.exec_query(get_sod);
    for (const ch of get_sod.data) {
      _field_header.content.push(ch);
      _field_header.total_variant += parseInt(ch.quantity > 0 ? 1 : 0);
      _field_header.total_quantity += parseInt(ch.quantity);
    }
  }
  _field_header.content = _field_header.content.sort(
    utils.dynamicSort("quantity")
  );
  if (_field_header.content.length === 0) {
    return false;
  }
  // data.data = [_field_header];
  return _field_header;
};
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

exports.printBill = async function (req, res) {
  var data = { data: req.query };
  try {
    if (!req.query["billno"] && !req.query["sono"]) {
      data.error = true;
      data.message = `Billno or Sono is required!`;
      return response.response(data, res);
    }
    let _data = await getDataField(req);
    if (!_data) {
      data.error = true;
      data.message = `Query: ${JSON.stringify(req.query)} tidak ditemukan`;
      return response.response(data, res, false);
    }
    // console.log(_data);
    let header = "printer_template/" + process.env.CONF_PRINT_HEADER;
    let content = "printer_template/" + process.env.CONF_PRINT_CONTENT;
    let footer = "printer_template/" + process.env.CONF_PRINT_FOOTER;
    let startField = process.env.CONF_PRINT_START_FIELD;
    let endField = process.env.CONF_PRINT_END_FIELD;
    header = await utils.getFileContent(header);
    content = await utils.getFileContent(content);
    footer = await utils.getFileContent(footer);

    let contents = "";
    for (const it of _data.content) {
      let keys = Object.keys(it);
      let txt = content;
      for (const key of keys) {
        let find = startField + key + endField;
        if (utils.isInt(it[key])) {
          it[key] = parseInt(it[key]);
        }
        let replace = it[key] ?? "";
        txt = replaceAll(txt, find, replace);
      }
      contents += txt;
    }

    let txtFile = header + contents + footer;
    for (const key in _data) {
      let find = startField + key + endField;
      let replace = _data[key];
      txtFile = replaceAll(txtFile, find, replace);
    }

    // HEADER
    data.data = txtFile;
    return response.response(data, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.printField = async function (req, res, { get_data = false }) {
  var data = { data: req.query };
  try {
    // LINE WAJIB DIBAWA
    if (!req.query["billno"] && !req.query["sono"]) {
      data.error = true;
      data.message = `Billno or Sono is required!`;
      return response.response(data, res);
    }
    let _data = await getDataField(req);
    if (!_data) {
      data.error = true;
      data.message = `Query: ${JSON.stringify(req.query)} tidak ditemukan`;
      return response.response(data, res, false);
    }
    data.data = [_data];
    // LINE WAJIB DIBAWA
    return response.response(data, res, false);
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

exports.getKitchen = async function (req, res) {
  var data = { data: req.query };
  try {
    if (!req.query["billno"] && !req.query["sono"]) {
      data.error = true;
      data.message = `Billno or Sono is required!`;
      return response.response(data, res);
    }
    var query = `SELECT 
      max(d.kitchenno) AS kitchenno,
      max(d.kitchenname) AS kitchenname,
      max(d.printername) AS printername 
      FROM billso as a 
      left join sod as b on a.sono =b.sono 
      left join itemkitchen as c on b.itemid = c.itemid 
      left join kitchen as d on c.kitchenno = d.kitchenno 
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
    query += ` GROUP BY d.kitchenno `;
    const _data = await models.exec_query(query);

    return response.response(_data, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
