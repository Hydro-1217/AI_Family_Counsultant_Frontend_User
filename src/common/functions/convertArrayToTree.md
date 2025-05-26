将对象数组转换成树状结构，场景：国家地区等

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| arr | 数组 | Array | - |
| rule | 父子关系规则 | Object | { id: 'id', parentId: 'parentId' } |

返回结果 `Array` 类型，一级节点组成的数组，子节点通过 children 属性添加 
```js
import convertArrayToTree from 'commons.js/functions/convertArrayToTree'
const arr = [{
  code: '0',
  name: 'root'
}, {
  code: '0-1',
  parentCode: '0',
  name: 'root-1'
}, {
  code: '0-2',
  parentCode: '0',
  name: 'root-2'
}, {
  code: '0-1-1',
  parentCode: '0-1',
  name: 'root-1-1'
}, {
  code: '0-1-2',
  parentCode: '0-1',
  name: 'root-1-2'
}]
cosnt result = convertArrayToTree(arr) // true

```
result 的结果如下
```js
[{
  code: '0',
  name: 'root',
  children: [{
    code: '0-1',
    parentCode: '0',
    name: 'root-1',
    children: [{
      code: '0-1-1',
      parentCode: '0-1',
      name: 'root-1-1'
    }, {
      code: '0-1-2',
      parentCode: '0-1',
      name: 'root-1-2'
    }]
  }, {
  code: '0-2',
  parentCode: '0',
  name: 'root-2'
  }]
}]
```