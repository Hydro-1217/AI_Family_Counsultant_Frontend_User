import forEach from 'lodash/forEach';

export default function (obj) {
  let str = '';
  forEach(obj, function (value, key) {
    if (value === undefined || value === null) return;
    str += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value)
  });
  return str.substring(1);
}

