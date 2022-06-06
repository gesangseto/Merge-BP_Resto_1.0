"use strict";
const moment = require("moment");
const response = require("../response");
const models = require("../models");
const sp = require("../sp");
const utils = require("../utils");
const perf = require("execution-time")();

const structure_so = {
  istaxed: "bool",
  taxinc: "bool",
  active: "bool",
  isautogen: "bool",
  _xt: "bool",
  islocked: "bool",
  isdraft: "bool",
  ismemorized: "bool",
  issc: "bool",
  isautogendp: "bool",
  sodate: "date",
  soexpdate: "date",
  duedays: "int2",
  discdays: "int2",
  version: "int8",
  printcount: "int8",
  excrate: "numeric(19,4)",
  fisrate: "numeric(19,4)",
  costtot: "numeric(19,4)",
  subtotal: "numeric(19,4)",
  discamt: "numeric(19,4)",
  taxamt: "numeric(19,4)",
  freight: "numeric(19, 4)",
  others: "numeric(19,4)",
  total: "numeric(19,4)",
  basesubtotal: "numeric(19,4)",
  basetaxamt: "numeric(19,4)",
  basediscamt: "numeric(19,4)",
  basetotal: "numeric(19,4)",
  basftaxamt: "numeric(19,4)",
  dpayment: "numeric(19, 4)",
  scamt: "numeric(19,4)",
  dpamt: "numeric(19,4)",
  billto: "text",
  shipto: "text",
  sonote: "text",
  memorizednote: "text",
  reqdtime: "timestamp",
  shipdtime: "timestamp",
  crtdate: "timestamp",
  upddate: "timestamp",
  syncdate: "timestamp",
  tstatus: "varchar(1)",
  termtype: "varchar(1)",
  shipid: "varchar(10)",
  srepid: "varchar(10)",
  chkby: "varchar(10)",
  aprby: "varchar(10)",
  crtby: "varchar(10)",
  updby: "varchar(10)",
  sono: "varchar(15)",
  empid: "varchar(15)",
  custid: "varchar(15)",
  refrid: "varchar(15)",
  earlydisc: "varchar(15)",
  latecharge: "varchar(15)",
  discexp: "varchar(15)",
  refno: "varchar(15)",
  sostatus: "varchar(2)",
  docno: "varchar(20)",
  custpono: "varchar(20)",
  whid: "varchar(3)",
  crcid: "varchar(5)",
  reftype: "varchar(5)",
  topid: "varchar(5)",
  taxid: "varchar(5)",
  perid: "varchar(5)",
  fobid: "varchar(5)",
  sotype: "varchar(5)",
  branchid: "varchar(5)",
};

const structure_sod = {
  sono: "varchar(15)",
  sodno: "int2",
  taxid: "varchar(5)",
  deptid: "varchar(5)",
  srepid: "varchar(10)",
  prjid: "varchar(5)",
  whid: "varchar(3)",
  itemid: "varchar(20)",
  pid: "varchar(25)",
  itemdesc: "varchar(50)",
  qty: "numeric(15,4)",
  unit: "varchar(5)",
  conv: "numeric(15,4)",
  qtyx: "numeric(15,4)",
  qtydo: "numeric(15,4)",
  qtyxdo: "numeric(15,4)",
  qtydelivered: "numeric(15,4)",
  qtyxdelivered: "numeric(15,4)",
  qtybo: "numeric(15,4)",
  qtyxbo: "numeric(15,4)",
  cost: "numeric(19, 4)",
  listprice: "numeric(19,4)",
  baseprice: "numeric(19,4)",
  discexp: "varchar(15)",
  discamt: "numeric(19,4)",
  disc2amt: "numeric(19,4)",
  taxamt: "numeric(19,4)",
  reqdate: "date",
  sodnote: "text",
  isclosed: "bool",
  subtotal: "numeric(19,4)",
  taxableamt: "numeric(19,4)",
  totaltaxamt: "numeric(19,4)",
  totaldiscamt: "numeric(19,4)",
  totaldisc2amt: "numeric(19,4)",
  basesubtotal: "numeric(19,4)",
  basetotaltaxamt: "numeric(19,4)",
  basftotaltaxamt: "numeric(19,4)",
  ispacked: "bool",
  iscancel: "bool",
  scid: "varchar(5)",
  scamt: "numeric(19,4)",
  scableamt: "numeric(19,4)",
  totalscamt: "numeric(19,4)",
};
/*

bill :
billstatus = CHECKIN => ORDER

host :
billstatus = DINE => ORDER

so : ALL
sod : ALL





*/
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
    var $query = `
    SELECT  a.*, c.*
    FROM bill AS a 
    LEFT JOIN billso AS b ON a.billno = b.billno
    Left JOIN so AS c ON b.sono = c.sono
    WHERE 1+1=2 `;
    for (const k in req.query) {
      if (k != "page" && k != "limit") {
        $query += ` AND a.${k}='${req.query[k]}'`;
      }
    }
    if (req.query.page || req.query.limit) {
      var start = 0;
      if (req.query.page > 1) {
        start = parseInt((req.query.page - 1) * req.query.limit);
      }
      var end = parseInt(start) + parseInt(req.query.limit);
      $query += ` LIMIT ${start},${end} `;
    }
    const check = await models.get_query($query);
    return response.response(check, res);
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

    const require_data = ["billno"];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }

    const required_items = ["itemid", "pid", "qty"];
    for (const it of req.body.items) {
      for (const row of required_items) {
        if (!it[`${row}`]) {
          data.error = true;
          data.message = `${row} in items is required!`;
          return response.response(data, res);
        }
      }
    }
    if (req.body.items.length === 0) {
      data.error = true;
      data.message = `Items is required!`;
      return response.response(data, res);
    }

    let wh_id = "G01"; //PILIH SETELAH LOGIN ANDROID
    // GENERATE NEW SONO
    let noid = await utils.generate_number("SO");
    if (!noid) {
      data.error = true;
      data.message = `Failed generate So No`;
      return response.response(data, res);
    }
    let so_no = noid.noid;
    let bill_no = req.body.billno;
    req.body.sono = bill_no;
    var query = `SELECT * 
      FROM bill AS a
      LEFT JOIN bp AS b ON a.bpid = b.bpid 
      where a.billno = '${bill_no}'`;
    let BILL = await models.exec_query(query);
    BILL = BILL.data[0];
    var prop_so = {
      billno: BILL.billno,
      sono: so_no,
      crcid: BILL.crcid,
      reftype: "PO",
      taxid: BILL.saletaxid,
      whid: wh_id,
      custid: BILL.bpid,
      termtype: "R", //Default R artinya Credit
      perid: "01002", //Default
      sodate: `${moment().format("YYYY-MM-DD")}`,
      billto: `CASH\nLG\nTelp: -`,
      shipto: `CASH\nLG\nTelp: -`,
      duedays: "14", // ? DEFAULT 14
      discdays: "0", // ? DEFAULT 0
      istaxed: true, // ? DEFAULT TRUE
      taxinc: true, // ? DEFAULT TRUE
      excrate: "1", // ? DEFAULT 1
      fisrate: "1", // ? DEFAULT 1
      costtot: "0", // ? DEFAULT 0
      subtotal: 0, // JUMLAH dari harga item
      discamt: 0, // ? DEFAULT 0
      taxamt: null, // 10 % dari harga subtotal
      freight: "0", // ? DEFAULT 0
      others: "0", // ? DEFAULT 0
      total: null, // taxamt + subtotal
      crtby: "Android",
      crtdate: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
      updby: "Android",
      upddate: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
      basesubtotal: 0, // JUMLAH dari harga item
      basetaxamt: 0, // 10 % dari harga subtotal
      basediscamt: 0,
      basetotal: 0, //  taxamt + subtotal
      basftaxamt: 0, // 10 % dari harga subtotal
    };

    const prop_sod = {
      sono: so_no,
      sodno: null,
      itemid: null,
      qty: null,
      conv: "1",
      qtyx: "0",
      qtydo: "0",
      qtyxdo: "0",
      qtydelivered: "0",
      qtyxdelivered: "0",
      qtybo: "0",
      qtyxbo: "0",
      cost: "0",
      discexp: "0%",
      discamt: "0",
      disc2amt: "0",
      sodnote: "",
    };

    let sodno = 1;
    let insert_sod = "";
    let no = 0;
    for (const it of req.body.items) {
      query = `SELECT * FROM vwpricelistall as a 
      left join vwstock as b on a.itemid =b.itemid 
      left join item as c on a.itemid =c.itemid 
      left join tax as d on c.saletaxid = d.taxid 
      where prclvlid ='${BILL.prclvlid}' AND a.itemid = '${it.itemid}'`;
      let item = await models.exec_query(query);
      if (item.error || item.data == 0) {
        item.error = true;
        item.message = `"itemid" : "${it.itemid}" not found`;
        return response.response(item, res);
      }
      item = item.data[0];
      let tax = parseFloat(item.taxexp);
      if (item.itemtype == "GOOD" && item.qty < it.qty) {
        item.error = true;
        item.message = `"itemid" : "${it.itemid}" is empty stock`;
        return response.response(item, res);
      }

      if (it.is_openmenu) {
        if (!it.price1 || !it.itemdesc) {
          data.error = true;
          data.message = "Open menu must fill price or item desc";
          return response.response(_resp, res);
        }
        item.price1 = it.price1;
        item.itemdesc = it.itemdesc;
      }
      prop_sod.sodno = sodno;
      prop_sod.taxid = item.saletaxid;
      prop_sod.whid = wh_id;
      prop_sod.itemid = it.itemid;
      prop_sod.ispacked = it.ispacked ?? false;
      prop_sod.sodnote = it.sodnote ?? "";
      prop_sod.itemdesc = item.itemdesc;
      prop_sod.unit = item.saleunit;
      prop_sod.listprice = item.price1;
      prop_sod.taxamt = item.price1 / (1 + tax) || 0;
      prop_sod.baseprice = (item.price1 - prop_sod.taxamt).toFixed(2);
      prop_sod.subtotal = (prop_sod.baseprice * it.qty).toFixed(2);
      prop_sod.taxableamt = (prop_sod.baseprice * it.qty).toFixed(2);
      prop_sod.totaltaxamt = (prop_sod.taxamt * it.qty).toFixed(2);
      prop_sod.basesubtotal = (prop_sod.baseprice * it.qty).toFixed(2);
      prop_sod.basetotaltaxamt = (prop_sod.taxamt * it.qty).toFixed(2);
      prop_sod.basftotaltaxamt = (prop_sod.taxamt * it.qty).toFixed(2);
      prop_sod.scableamt = (item.price1 * it.qty).toFixed(2);
      prop_sod.qty = it.qty;
      no += 1;
      console.log(no, "==============Between=================", no);
      console.log(no, "=================================", prop_sod.subtotal);

      prop_so.subtotal += parseInt(prop_sod.subtotal);
      prop_so.taxamt += parseInt(prop_sod.totaltaxamt);
      prop_so.total += parseInt(prop_sod.scableamt);
      prop_so.basesubtotal += parseInt(prop_sod.basesubtotal);
      prop_so.basetaxamt += parseInt(prop_sod.basetotaltaxamt);
      prop_so.basetotal += parseInt(prop_sod.scableamt);
      prop_so.basftaxamt += parseInt(prop_sod.basftotaltaxamt);
      insert_sod += models.generate_query_insert({
        structure: structure_sod,
        table: "sod",
        values: prop_sod,
      });
      it.sono = so_no;
      it.sodno = sodno;
      insert_sod += `\nSELECT spso_new('${so_no}','${bill_no}');`;
      sodno += 1;
    }
    insert_sod += `\n${await utils.generate_query_update_curno("SO")}`;
    let insert_so = models.generate_query_insert({
      structure: structure_so,
      table: "so",
      values: prop_so,
    });

    let all_query = `
    ${insert_so} 
    ${insert_sod}`;
    let _resp = await models.exec_query(all_query);
    // return;
    return response.response(_resp, res);
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
    const require_data = ["sono", "itemid", "sodno", "qty", "note"];
    for (const row of require_data) {
      if (!req.body[`${row}`]) {
        data.error = true;
        data.message = `${row} is required!`;
        return response.response(data, res);
      }
    }
    let body = req.body;
    let checkBillStatus = `SELECT * FROM billso AS a LEFT JOIN bill AS b ON a.billno = b.billno WHERE a.sono='${body.sono}' LIMIT 1`;
    checkBillStatus = await models.exec_query(checkBillStatus);
    if (checkBillStatus.error) return response.response(checkBillStatus, res);
    if (checkBillStatus.data.length === 0) {
      checkBillStatus.error = true;
      checkBillStatus.message = "SOD not found";
      return response.response(checkBillStatus, res);
    }
    checkBillStatus = checkBillStatus.data[0];
    let check = `SELECT * FROM sod WHERE itemid = '${body.itemid}' AND sono = '${body.sono}' AND sodno = '${body.sodno}' AND itemid = '${body.itemid}'`;
    if (checkBillStatus.billstatus !== "ORDER") {
      checkBillStatus.error = true;
      checkBillStatus.message = `Cannot cancel item with ${checkBillStatus.billstatus} status`;
      return response.response(checkBillStatus, res);
    }
    check = await models.exec_query(check);
    if (check.error) return response.response(check, res);
    if (check.data.length === 0) {
      check.error = true;
      check.message = "SOD not found";
      return response.response(check, res);
    }
    let sod_data = check.data[0];
    if (sod_data.qty < body.qty || body.qty <= 0) {
      check.error = true;
      check.message = "Qty tidak sesuai";
      return response.response(check, res);
    }

    var note = `CANCEL: ${body.note}`;
    if (parseInt(sod_data.qty) === parseInt(body.qty)) {
      var full_query = `\n UPDATE sod SET qty='${body.qty}' , isclosed=TRUE, iscancel=TRUE, sodnote='${note}' WHERE sono='${body.sono}' AND sodno='${body.sodno}'; `;
      var sodno = body.sodno;
    } else {
      let qty = sod_data.qty - body.qty;
      var sodno = await models.exec_query(
        `SELECT MAX(sodno)+1 AS sodno  FROM sod WHERE sono = '${body.sono}';`
      );
      sodno = sodno.data[0].sodno ?? -1;

      let _data = check.data[0];
      sod_data.sodno = sodno;
      sod_data.qty = body.qty;
      sod_data.sodnote = note;
      sod_data.iscancel = true;
      sod_data.isclosed = true;
      sod_data.subtotal = _data.baseprice * body.qty;
      sod_data.taxableamt = _data.baseprice * body.qty;
      sod_data.totaltaxamt = _data.taxamt * body.qty;
      sod_data.basesubtotal = _data.baseprice * body.qty;
      sod_data.basetotaltaxamt = _data.taxamt * body.qty;
      sod_data.basftotaltaxamt = _data.taxamt * body.qty;
      sod_data.scableamt = _data.price1 * body.qty;

      var full_query = models.generate_query_insert({
        structure: structure_sod,
        table: "sod",
        values: sod_data,
      });
      full_query += `\n UPDATE sod SET qty='${qty}' WHERE sono='${body.sono}' AND sodno='${body.sodno}'; `;
    }

    full_query += `\n SELECT spso_item_cancel('${body.sono}' , '${
      body.itemid
    }', '${body.pid ?? 1}', '${body.qty}','${sodno}')`;
    var _res = await models.exec_query(full_query);
    return response.response(_res, res);
  } catch (error) {
    data.error = true;
    data.message = `${error}`;
    return response.response(data, res);
  }
};
