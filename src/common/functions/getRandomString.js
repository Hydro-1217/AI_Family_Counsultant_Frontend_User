/**
 * 获取随机数（大写字母、小写字母、数字）
 * @param length 要几位数的随机数
 * @return {string} 返回值
 * */

let dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function getRandomString(length) {
  let text = "";
  if(!length){
    return text
  }
  for(let i = 0; i < length; i++) {
    text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
  }
  return text
}