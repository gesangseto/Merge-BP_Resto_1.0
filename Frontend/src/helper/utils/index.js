// RootNavigation.js

export function groupingArray(array, key) {
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export const Toaster = ({message = ' ', type = 'error'}) => {
  let typ = type;
  let msg = message;
  Promise.resolve()
    .then(() => toast.hideAll())
    .then(() => toast.show(msg, {type: typ}))
    .then(() => toast.hideAll());
  return;
};

export const curencyFormating = num => {
  num = parseFloat(num);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const textTrim = (string, length) => {
  string = string.replace(/\n/g, ', ');
  if (string.length > length) return string.substring(0, length) + '...';
  else return string;
};

export const filterItemGroup = (_filter, menu) => {
  let _menu = [];
  if (_filter.hasOwnProperty('children') && _filter.children.length > 0) {
    for (const it of _filter.children) {
      _menu = [..._menu, ...filterItemGroup(it, menu)];
    }
  } else if (_filter.hasOwnProperty('itgrpid')) {
    for (const it of menu) {
      if (it.itgrpid === _filter.itgrpid) {
        _menu.push(it);
      }
    }
  }
  return _menu;
};

export const textTrimPerLine = (string, length) => {
  if (!string) {
    return;
  }
  var lines = string.split(/(\r\n|\n|\r)/gm);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length > length) {
      lines[i] = `${lines[i].substring(0, length)}...`;
    }
  }
  return lines.join('');
};

export const mergeArray = (a1, a2, key_name) => {
  key_name = key_name ?? 'itemid';
  return a1.map(t1 => ({
    ...t1,
    ...a2.find(t2 => t2[key_name] === t1[key_name]),
  }));
};

export const isInt = value => {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 20))
  );
};
export const listToTree = list => {
  var map = {};
  var node;
  var roots = [];
  var i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== '0') {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const isColorBrigthness = color => {
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 100;
};
