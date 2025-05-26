将 Object 对象转换成 url params

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| obj | object 数据 | Object | - |

返回结果 `String` 类型

```js
import parseObjectToUrlParams from 'commons.js/functions/parseObjectToUrlParams'

const data = { name: 'moon', age: 18 }
parseObjectToUrlParams(data) // name=moon&age=18
```