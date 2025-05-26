从区间范围取值

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 权重值 0 到 1 | Number | - |
| min | 区间最小值 | Number | - |
| max | 区间最大值 | Number | - |

返回结果 `Number` 类型

```js
import getNumFromRange from 'commons.js/functions/getNumFromRange'

getNumFromRange(0.2, 1, 10) //3
getNumFromRange(0.5, 31, 35) // 33

```