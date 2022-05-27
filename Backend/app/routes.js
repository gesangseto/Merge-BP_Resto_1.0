"use strict";

module.exports = function (app) {
  // AUTHENTICATION
  var login = require("./controller/login");
  app.route("/api/authentication/login-sales").post(login.login_sales);

  // MASTER
  var employee = require("./controller/employee");
  app.route("/api/master/employee").get(employee.get);
  var host = require("./controller/host");
  app.route("/api/master/host").get(host.get);
  var menu = require("./controller/menu");
  app.route("/api/master/menu").get(menu.get);
  var group_menu = require("./controller/group-menu");
  app.route("/api/master/group-menu").get(group_menu.get);

  // PICTURE
  var picture = require("./controller/picture");
  app.route("/api/master/picture").get(picture.get);

  // TRANSACTION
  var bill = require("./controller/bill");
  app.route("/api/transaction/bill").get(bill.get);
  app.route("/api/transaction/bill").put(bill.insert);
  app.route("/api/transaction/bill").delete(bill.delete);

  var so = require("./controller/so");
  app.route("/api/transaction/so").get(so.get);
  app.route("/api/transaction/so").put(so.insert);
  app.route("/api/transaction/so").delete(so.delete);
};
