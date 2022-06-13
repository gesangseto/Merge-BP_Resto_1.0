"use strict";
const response = require("../response");
const models = require("../models");
const perf = require("execution-time")();
const crypto = require("crypto");

const structure_srep = {
  srepid: null,
  stateid: null,
  countryid: null,
  cityid: null,
  srepname: null,
  sreptype: null,
  addr: null,
  zipcode: null,
  phone: null,
  mobile: null,
  email: null,
  status: null,
  arlimitamt: null,
  passwd: null,
  usrid: null,
};

exports.login_sales = async function (req, res) {
  // LINE WAJIB DIBAWA
  perf.start();
  var data = { data: req.body };
  const require_data = ["phone", "password"];
  for (const row of require_data) {
    if (!req.body[`${row}`]) {
      data.error = true;
      data.message = `${row} is required!`;
      return response.response(data, res);
    }
  }

  let update = await models.addColumnItem();
  let body = req.body;
  let sa = { phone: process.env.SA_PHONE, password: process.env.SA_PASSWORD };
  if (sa.phone === body.phone && sa.password === body.password) {
    structure_srep.phone = sa.phone;
    structure_srep.passwd = sa.password;
    structure_srep.srepname = "Super Admin";
    structure_srep.sreptype = "Super Admin";
    structure_srep.is_superadmin = true;
    data.data = [];
    data.data[0] = structure_srep;
    return response.response(data, res);
  }

  body.password = crypto.createHash("md5").update(body.password).digest("hex");
  let $query = `
  SELECT * FROM srep AS a 
  WHERE a.phone='${body.phone}' AND a.passwd='${body.password}' LIMIT 1`;
  var check = await models.exec_query($query);
  if (check.error || check.data.length == 0) {
    check.error = true;
    check.message = "Wrong Phone Or Password !";
    return response.response(check, res);
  }
  return response.response(check, res);
};
