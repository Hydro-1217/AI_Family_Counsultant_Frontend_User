通过对象来获得className字符串的拼接

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| obj | 键值对类型的一组 class | Object | - |

最终的className `String` 类型 

```js
import createClassName from 'commons.js/functions/createClassName'
createClassName({'float-left': true, active: true}) // 'float-left active'

```
