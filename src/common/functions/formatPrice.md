格式化金额，千分位分割

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| num | 金额 | Number | - |
| digits | 保留小数位数 | Number | 2 |
| isRound | 是否四舍五入 | Boolean | false |

返回结果 `String` 类型

```js
import formatPrice from 'commons.js/functions/formatPrice'

formatPrice(1.345) // 1.34
formatPrice(533211) // 533,211.00

```