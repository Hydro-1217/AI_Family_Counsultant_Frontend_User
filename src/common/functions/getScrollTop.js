/** @module getScrollTop */

/**
 * 获取网页的滚动距离，注意滚动区域是网页时才有效。
 * @return {number}
 */
export default function getScrollTop () {

  if (window.pageYOffset) {
    return window.pageYOffset;
  } else {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }
}