// const mysql = require("mysql");
const Pool = require("pg").Pool;
const moment = require("moment");

var db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

// var pool = mysql.createPool(db_config);

const pool = new Pool(db_config);

async function exec_query(query_sql) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        return resolve(data_set);
      }
      data_set.data = rows.rows;
      data_set.total = rows.length;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}

async function get_query(query_sql) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };

  var _where = query_sql.split("FROM") || query_sql.split("from");
  _where = _where[1].split("LIMIT") || _where[1].split("limit");
  var count = `SELECT COUNT(*) AS total FROM ${_where[0]}`;
  count = await exec_query(count);
  if (count.error) {
    data_set.error = true;
    data_set.message = count.message;
    return data_set;
  }
  data_set.total = count.data[0].total;
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        return resolve(data_set);
      }
      data_set.data = rows.rows;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}

async function insert_query({ data, key, table }) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };
  var column = `SELECT column_name,data_type  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`;
  column = await exec_query(column);
  if (column.error) {
    data_set.error = true;
    data_set.message = column.message || "Oops, something wrong";
    return data_set;
  }
  column = column.data;
  var _data = [];
  var key = [];
  var val = [];
  for (const k in data) {
    var it = data[k];
    var isColumAvalaible = false;
    var is_text = false;
    var is_time = false;
    var is_int = false;
    for (const col_name of column) {
      if (k == col_name.column_name) {
        isColumAvalaible = true;
        if (col_name.data_type.includes("time")) {
          is_time = true;
        } else if (
          col_name.data_type.includes("int") ||
          col_name.data_type.includes("numeric")
        ) {
          is_int = true;
        } else {
          is_text = true;
        }
      }
    }
    if (isColumAvalaible) {
      if (is_text) {
        if (it) {
          key.push(k);
          val.push(it);
        }
      } else if (is_int && isInt(it)) {
        key.push(k);
        val.push(it);
      } else if (
        is_time &&
        it != "created_at" &&
        moment(it, moment.ISO_8601, true).isValid()
      ) {
        key.push(k);
        val.push(it);
      }
    }
  }

  key = key.toString();
  val = "'" + val.join("','") + "'";
  _data = _data.join(",");
  var query_sql = `INSERT INTO ${table} (${key}) VALUES (${val})`;
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        return resolve(data_set);
      }
      data_set.data = rows;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}

async function update_query({ data, key, table }) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };
  var column = `SELECT column_name,data_type  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`;
  column = await exec_query(column);
  if (column.error) {
    data_set.error = true;
    data_set.message = column.message || "Oops, something wrong";
    return data_set;
  }
  column = column.data;
  var _data = [];
  for (const k in data) {
    var it = data[k];
    var isColumAvalaible = false;
    var is_text = false;
    var is_time = false;
    var is_int = false;
    for (const col_name of column) {
      if (k == col_name.column_name) {
        isColumAvalaible = true;
        if (col_name.data_type.includes("time")) {
          is_time = true;
        } else if (col_name.data_type.includes("int")) {
          is_int = true;
        } else {
          is_text = true;
        }
      }
    }
    if (isColumAvalaible) {
      if (is_text) {
        _data.push(` ${k} = '${it}'`);
      } else if (is_int && isInt(it)) {
        _data.push(` ${k} = '${it}'`);
      } else if (
        is_time &&
        it != "created_at" &&
        moment(it, moment.ISO_8601, true).isValid()
      ) {
        it = moment(it).format("YYYY-MM-DD HH:mm:ss");
        _data.push(` ${k} = '${it}'`);
      }
    }
  }
  _data = _data.join(",");
  var query_sql = `UPDATE ${table} SET ${_data} WHERE ${key}='${data[key]}'`;
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        return resolve(data_set);
      }
      data_set.data = rows;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}

async function delete_query({
  data,
  key,
  table,
  deleted = true,
  force_delete = false,
}) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };

  if (!force_delete) {
    var current_data = `SELECT * FROM ${table} WHERE ${key}='${data[key]}' LIMIT 1`;
    current_data = await exec_query(current_data);
    if (current_data.error || current_data.total == 0) {
      data_set.error = true;
      data_set.message = current_data.message || "Oops, something wrong";
      return data_set;
    }
    if (current_data.data[0].status == 1) {
      data_set.error = true;
      data_set.message = "Cannot delete data, must set data to Inactive";
      return data_set;
    }
  }
  let query_sql = ``;
  if (deleted) {
    query_sql = `DELETE FROM ${table} WHERE ${key}='${data[key]}'`;
  } else {
    query_sql = `UPDATE ${table} SET flag_delete='1' WHERE ${key}='${data[key]}'`;
  }
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        if (err.errno === 1451) {
          data_set.message =
            "Cannot delete data, this data have connection on other transaction";
        }
        return resolve(data_set);
      }
      data_set.data = rows;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}

async function exec_store_procedure(proc_name) {
  var data_set = {
    error: false,
    data: [],
    total: 0,
    total_row: 0,
    message: "Success",
  };
  let query_sql = `SELECT ${proc_name}`;
  return await new Promise((resolve) =>
    pool.query(query_sql, function (err, rows) {
      if (err) {
        data_set.error = true;
        data_set.message = err.message || "Oops, something wrong";
        return resolve(data_set);
      }
      data_set.data = rows.rows;
      data_set.total_row = rows.length;
      return resolve(data_set);
    })
  );
}
function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 20))
  );
}

async function rollback() {
  pool.query("ROLLBACK", function () {
    pool.end();
  });
}

async function commit() {
  pool.query("COMMIT", pool.end.bind(pool));
}

async function get_configuration({ regid = String }) {
  let query = `SELECT * FROM reg WHERE 1+1=2`;
  if (regid) {
    query += ` AND regid = '${regid}' LIMIT 1`;
  }

  return await new Promise((resolve) =>
    pool.query(query, function (err, rows) {
      if (err) {
        return false;
      }
      return resolve(rows);
    })
  );
}

async function generate_query_insert({ table, structure, values }) {
  let get_structure = `select column_name, data_type, character_maximum_length, column_default, is_nullable
  from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}';`;
  get_structure = await exec_query(get_structure);
  let column = "";
  let datas = "";
  let query = `INSERT INTO ${table} `;
  if (typeof values === "object" && values !== null) {
    for (const key_v in values) {
      for (const it of get_structure.data) {
        let key = it.column_name;
        if (key_v === key) {
          if (values[key_v]) {
            column += ` ${key_v},`;
            datas += ` '${values[key_v]}',`;
          }
        }
      }
    }
    column = ` (${column.substring(0, column.length - 1)}) `;
    datas = ` (${datas.substring(0, datas.length - 1)}) `;
    query += ` ${column} VALUES ${datas} ;`;
  }
  return query;
}

async function addColumnItem() {
  let querty = `SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name='item' and column_name='isavailable';`;
  querty = await exec_query(querty);
  if (!querty.error && querty.data.length === 0) {
    let add_column = ` ALTER TABLE public.item ADD isavailable int2 NOT NULL DEFAULT 1;`;
    await exec_query(add_column);
    return true;
  } else {
    return true;
  }
}

async function generate_query_update({ table, values, key }) {
  let get_structure = `select column_name, data_type, character_maximum_length, column_default, is_nullable
  from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}';`;
  get_structure = await exec_query(get_structure);
  let column = "";
  let query = `UPDATE ${table} SET`;
  if (typeof values === "object" && values !== null) {
    for (const key_v in values) {
      for (const itm of get_structure.data) {
        if (key_v === itm.column_name) {
          if (values[key_v]) {
            column += ` ${key_v}= '${values[key_v]}',`;
          }
        }
      }
    }
    column = ` ${column.substring(0, column.length - 1)}`;
    query += ` ${column} WHERE ${key} = '${values[key]}'; `;
  }
  return query;
}

module.exports = {
  get_configuration,
  exec_query,
  get_query,
  insert_query,
  update_query,
  delete_query,
  exec_store_procedure,
  generate_query_insert,
  generate_query_update,
  rollback,
  commit,
  addColumnItem,
};
