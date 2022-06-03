const moment = require("moment");
const models = require("./models");
const fs = require("fs");
var path = require("path");

async function nestedData({ data = [], unique = null }) {
  var reformat_obj = {};
  for (const element of data) {
    if (!reformat_obj[element[unique]]) {
      reformat_obj[element[unique]] = [element];
    } else {
      reformat_obj[element[unique]] =
        reformat_obj[element[unique]].concat(element);
    }
  }
  return reformat_obj;
}

function treeify(list, idAttr, parentAttr, childrenAttr) {
  if (!idAttr) idAttr = "id";
  if (!parentAttr) parentAttr = "parent";
  if (!childrenAttr) childrenAttr = "children";

  var treeList = [];
  var lookup = {};
  list.forEach(function (obj) {
    lookup[obj[idAttr]] = obj;
    obj[childrenAttr] = [];
  });
  list.forEach(function (obj) {
    if (obj[parentAttr] != null) {
      if (lookup[obj[parentAttr]] !== undefined) {
        lookup[obj[parentAttr]][childrenAttr].push(obj);
      } else {
        //console.log('Missing Parent Data: ' + obj[parentAttr]);
        treeList.push(obj);
      }
    } else {
      treeList.push(obj);
    }
  });
  return treeList;
}
async function encrypt({ string = null }) {
  try {
    const crypto = require("crypto");
    const secret = "Initial-G";
    const encryptedData = crypto
      .createHash("sha256", secret)
      .update(string)
      .digest("hex");
    return encryptedData;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function super_menu() {
  let super_menu = [
    // {
    //   _tag: "CSidebarNavTitle",
    //   _children: ["SYSTEM AREA"],
    // },
    {
      // _tag: "CSidebarNavDropdown",
      name: "System",
      route: "/system",
      icon: "",
      _children: [
        {
          // _tag: "CSidebarNavItem",
          name: "Configuration",
          to: "/system/configuration",
          flag_create: 1,
          flag_read: 1,
          flag_update: 1,
          flag_print: 1,
          flag_download: 1,
        },
        {
          // _tag: "CSidebarNavItem",
          name: "Audit Log",
          to: "/system/audit_log",
          flag_create: 1,
          flag_read: 1,
          flag_update: 1,
          flag_print: 1,
          flag_download: 1,
        },
        {
          // _tag: "CSidebarNavItem",
          name: "Menu Parent",
          to: "/system/menu_parent",
          flag_create: 1,
          flag_read: 1,
          flag_update: 1,
          flag_print: 1,
          flag_download: 1,
        },
        {
          // _tag: "CSidebarNavItem",
          name: "Menu Child",
          to: "/system/menu_child",
          flag_create: 1,
          flag_read: 1,
          flag_update: 1,
          flag_print: 1,
          flag_download: 1,
        },
      ],
    },
  ];
  return super_menu;
}

function lpad(value, padding) {
  var zeroes = new Array(padding + 1).join("0");
  return (zeroes + value).slice(-padding);
}
function removeEmptyObj(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
async function generate_number(type = "BILL") {
  try {
    let query = `SELECT * FROM ncount WHERE noid = '${type}'`;
    let ncount = await models.exec_query(query);
    if (ncount.error || ncount.data.length == 0) {
      return false;
    }
    ncount = ncount.data[0];
    let pid = {
      pid1: ncount.transcode,
      pid2: ncount.sitecode,
      pid3: moment(new Date()).format(ncount.periodecode),
      pid4: lpad(ncount.curno + 1, ncount.nolen),
    };

    query = `SELECT * FROM ncountp WHERE noid = '${type}' AND periodecode = '${pid.pid3}'`;
    let ncountp = await models.exec_query(query);
    if (ncountp.error) {
      return false;
    } else if (ncountp.data.length > 0) {
      ncountp = ncountp.data[0];
      pid.pid4 = lpad(ncountp.curno + 1, ncount.nolen);
    }

    let noid = "";
    for (const it in pid) {
      if (pid[it]) {
        noid += `${pid[it]}`;
      }
    }
    let res = {
      noid: noid,
      pid: pid,
    };
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getFileContent(file_location) {
  return await new Promise((resolve) =>
    fs.readFile(path.resolve(file_location), "utf8", function (e, hasil) {
      if (e) {
        return resolve(false);
      }
      return resolve(hasil);
    })
  );
}

async function generate_query_update_curno(type = "BILL") {
  try {
    let noid = await generate_number(type);
    let curno = parseInt(noid.pid.pid4);
    let periodecode = noid.pid.pid3;
    let query = `\nUPDATE ncount SET curno = '${curno}' WHERE noid = '${type}';`;
    query += `\nUPDATE ncountp SET curno = '${curno}' WHERE noid = '${type}' AND periodecode = '${periodecode}'; 
    INSERT INTO ncountp (noid, periodecode, curno) SELECT '${type}', '${periodecode}', '${curno}' WHERE NOT EXISTS (SELECT * FROM ncountp WHERE noid = '${type}' AND periodecode = '${periodecode}');`; // Update Ncount-Ncountp
    return query;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  nestedData,
  treeify,
  encrypt,
  super_menu,
  generate_number,
  generate_query_update_curno,
  getFileContent,
};
