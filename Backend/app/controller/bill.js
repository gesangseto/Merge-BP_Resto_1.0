"use strict";
const response = require("../response");
const models = require("../models");
const sp = require("../sp");
const utils = require("../utils");
const perf = require("execution-time")();

const structure_bill = {
  billno: "varchar",
  bpid: "varchar(15)",
  bpname: "varchar(100)",
  billtype: "varchar(15)",
  rtbno: "varchar(15)",
  billdate: "date",
  bpphone: "varchar(100)",
  billto: "varchar(255)",
  shipto: "varchar(255)",
  pax: "int2",
  arrivetime: "time",
  leavetime: "time",
  billnote: "varchar(255)",
  billtotal: "numeric(19, 4)",
  paystatus: "varchar(1)",
  billstatus: "varchar(10)",
  srepid: "varchar(10)",
  hostid: "int8",
  dpamt: "numeric(19, 2)",
  upbillno: "varchar(15)",
  possesno: "varchar(8)",
  isopenbill: "bool",
};

exports.get = async function (req, res) {
  var data = { data: req.query };
  try {
    // LINE WAJIB DIBAWA
    perf.start();
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
    query = `SELECT * FROM billso AS a
    LEFT JOIN so AS b ON a.sono = b.sono
    WHERE a.billno = '${header.billno}'`;
    let so = [];
    let get_so = await models.exec_query(query);

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
    header.can_cancel = can_cancel;
    data.total = 1;
    data.total_row = 1;
    data.data = [];
    data.data.push(header);
    data.data[0].so = so;
    return response.response(data, res, false);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.insert = async function (req, res) {
  var data = { data: req.body };
  try {
    perf.start();
    req.body.created_by = req.headers.user_id;

    const require_data = [
      // "billno",
      "bpid",
      "billtype",
      "billdate",
      "pax",
      // "arrivetime",
      "srepid", // user login dari android (srep)
      "paystatus",
      "billstatus",
      "hostid",
    ];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    // GET BILL NUMBER
    let noid = await utils.generate_number("BILL");
    if (!noid) {
      data.error = true;
      data.message = `Failed generate Bill No`;
      return response.response(data, res);
    }
    let bill_no = noid.noid;
    req.body.billno = bill_no;

    // GET AVALAIBLE TABLE
    var query = `SELECT * FROM host WHERE hostid = ${req.body.hostid} AND billno IS NULL AND hoststatuscode='KSNG' AND active IS TRUE`;
    let exec = await models.exec_query(query);
    if (exec.error || exec.data.length == 0) {
      exec.error = true;
      exec.message = "Meja tidak aktif atau sudah terisi";
      return response.response(exec, res);
    }

    // CREATE SP
    // let store_sp = sp.spfix_duplicatehost_gesang();
    // store_sp = await models.exec_query(store_sp);

    // INSERT BILL NUMBER
    var insert_bill = models.generate_query_insert({
      structure: structure_bill,
      table: "bill",
      values: req.body,
    });
    insert_bill += `\nSELECT spbill_new('${bill_no}');`; //Fixing bill new
    insert_bill += `\nSELECT spfix_hoststatus('${bill_no}');`; // Fixing table status
    insert_bill += `\n${await utils.generate_query_update_curno("BILL")}`;

    var _res = await models.exec_query(insert_bill);
    _res.data = [{ billno: bill_no }];
    return response.response(_res, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};

exports.delete = async function (req, res) {
  var data = { data: req.body };
  try {
    perf.start();
    const require_data = ["billno", "note"];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    let body = req.body;
    let get_bill_detail = `SELECT * FROM bill AS a
    LEFT JOIN billso AS b ON a.billno = b.billno
    LEFT JOIN so AS c ON b.sono = c.sono
    LEFT JOIN sod AS d ON c.sono = d.sono
    WHERE a.billno = '${req.body.billno}'`;
    get_bill_detail = await models.exec_query(get_bill_detail);
    let cancel = [];
    for (const it of get_bill_detail.data) {
      let sono = it.sono;
      if (!it.isclosed || !it.iscancel) {
        data.error = true;
        data.message = `So ${it.sono} masih ada pesanan, silahkan cancel dahulu`;
        return response.response(data, res);
      }
      cancel.push(`SELECT spso_void('${it.sono}');`);
    }
    cancel.push(`SELECT spbill_cancel('${body.billno}','${body.note}');`);
    cancel = [...new Set(cancel)];
    cancel = cancel.join("\n");
    cancel = await models.exec_query(cancel);
    return response.response(cancel, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
