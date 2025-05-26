遍历树节点及其所有子孙节点

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| node | 树节点 | TreeNode | - |
| callback | 节点调用函数 | (node) => {} | - |

```js
import traverseTreeNode from 'commons.js/functions/traverseTreeNode'

const treeNode = {
  key: '02',
  title: '产品部',
  children: [{
    key: '021',
    title: '大平台',
    children: [{
      key: '0211',
      title: '康俊',
    }, {
      key: '0212',
      title: '王向阳',
    }]
  }, {
    key: '022',
    title: '数据智能',
    children: [{
      key: '0221',
      title: '汤阳',
    }, {
      key: '0222',
      title: '孙诗洋',
    }, {
      key: '0223',
      title: '向中伟',
    }, {
      key: '020',
      title: '姜明蕾'
    }]
  }]
}

const keys = []

traverseTreeNode(treeNode, item => {
  // 根据业务场景自定义逻辑
  keys.push(item.key)
})

console.log(keys) // ['02', '021', '0211', '0212', '022', '0221', '0222', '0223', '020']

```