export default function (url) {
  const result = {};
  if (typeof url !== 'string') return result
  if (url[0] === '?') url = url.substring(1);
  const arr = url.split('&');
  arr.forEach((item) => {
    const items = item.split('=');
    result[decodeURIComponent(items[0])] = decodeURIComponent(items[1]);
  });
  return result;
}