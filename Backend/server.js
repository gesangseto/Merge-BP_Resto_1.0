const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const moment = require("moment");

dotenv.config();
var express = require("express"),
  app = express(),
  port = process.env.APP_PORT,
  bodyParser = require("body-parser");
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// LOAD MIDDLEWARE OAUTH
// var middleware = require("./app/middleware/middleware");
app.use(async function (req, res, next) {
  // Create log for request
  let request = {
    currentTime:
      moment().format("Y-MM-D") + " " + moment().format("HH:mm:ss:SSS"),
    client_ip: req.headers["x-forwarded-for"] || req.ip,
    method: req.method,
    path: req.originalUrl,
    body: req.body,
  };
  console.log("======================================================");
  console.log(`req : ${JSON.stringify(request)}`);
  // End Create log for request
  next();
  return;
  //   if (
  //     req.originalUrl == "/api/login/user" ||
  //     (req.originalUrl == "/api/configuration" && req.method == "GET")
  //   ) {
  //     next();
  //     return;
  //   }
  //   let check_token = await middleware.check_token(req, res);
  //   let create_log = true;
  //   if (check_token && req.method != "GET") {
  //     create_log = await middleware.create_log(req, res);
  //   }
  //   if (check_token && create_log) {
  //     next();
  //     return;
  //   }
});
// END MIDDLEWARE OAUTH

var routes = require("./app/routes");
routes(app);
app.listen(port);

// INITIAL FUNCTION BEFORE RUN SERVER
const {
  addColumnToItem,
  addColumnToKitchen,
  exec_query,
} = require("./app/models");
async function initialFunction() {
  let setFormat = await exec_query("SET datestyle = dmy;");
  console.log(setFormat.message, "datestyle = dmy");
  await addColumnToItem();
  await addColumnToKitchen();
}
initialFunction();
// INITIAL FUNCTION BEFORE RUN SERVER

console.log(`${process.env.APP_NAME} started on port: ${port}`);
