
/**
 * 从区间范围取值
 * @param {number} value 权重值 0 到 1
 * @param {number} min 区间最小值
 * @param {number} max 区间最大值
 * @return {number} 结果
 */
export default function (value, min, max) {
  let range = max - min;
  return min + range * value;
};