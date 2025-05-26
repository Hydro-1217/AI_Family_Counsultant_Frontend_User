/** @module convertArrayToTree */

function convertArrayToTree(array, rule = { id: 'id', parentId: 'parentId' }) {
  const tree = [];
  const { id, parentId } = rule;

  let obj = array.reduce((prev, current) => { prev[current[id]] = current; return prev }, {});

  for(let item of array){
    let parent = obj[item[parentId]];

    if (!parent) {
      tree.push(item);
      continue;
    }

    if (!parent.children) parent.children = [];

    parent.children.push(item);
  }

  return tree;
}

/**
 * 将对象数组转换成树状结构，场景：国家地区等
 * @param array 数组
 * @param rule 单个对象的标识，和父对象的标识 id: 'code', parent: 'parentCode'
 * @return {Array} 一级节点组成的数组，子节点通过children属性添加
 */
export default convertArrayToTree;