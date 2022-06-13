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
  app.route("/api/master/host-status").get(host.get_hoststatus);
  app.route("/api/master/host-status").post(host.update_hoststatus);

  var menu = require("./controller/menu");
  app.route("/api/master/menu").get(menu.get);
  app.route("/api/master/open-menu").get(menu.getOpenMenu);
  app.route("/api/master/menu").post(menu.update);

  var group_menu = require("./controller/group-menu");
  app.route("/api/master/group-menu").get(group_menu.get);
  var note = require("./controller/note");
  app.route("/api/master/note").get(note.get);

  // PICTURE
  var picture = require("./controller/picture");
  app.route("/api/master/picture").get(picture.get);

  // TRANSACTION
  var bill = require("./controller/bill");
  app.route("/api/transaction/bill").put(bill.insertBill);
  app.route("/api/transaction/bill").get(bill.get);
  app.route("/api/transaction/bill").delete(bill.delete);

  var so = require("./controller/so");
  app.route("/api/transaction/so").get(so.get);
  app.route("/api/transaction/so").put(so.insert);
  app.route("/api/transaction/so").delete(so.delete);

  // Utilities
  var utilities = require("./controller/utilities");
  app.route("/api/utilities/print-bill").get(utilities.printBill);
  app.route("/api/utilities/print-field").get(utilities.printField);
  app.route("/api/utilities/kasir-status").get(utilities.getKasirStatus);
  app.route("/api/utilities/kitchen").get(utilities.getKitchen);
};
