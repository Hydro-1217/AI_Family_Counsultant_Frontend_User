将 location.search 转换成 Object

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| params | location.search | string | - |

返回结果 `Object` 类型

```js
import parseUrlParamsToObject from 'commons.js/functions/parseUrlParamsToObject'

parseUrlParamsToObject('?name=moon&age=18') // { name: 'moon', age: 18 }
parseUrlParamsToObject('name=moon&age=18') // { name: 'moon', age: 18 }
```