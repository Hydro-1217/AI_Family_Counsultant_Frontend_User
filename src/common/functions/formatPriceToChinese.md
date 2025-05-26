格式化金额为中文

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| num | 金额 | Number | - |

返回结果 `String` 类型

```js
import formatPriceToChinese from 'commons.js/functions/formatPriceToChinese'

formatPriceToChinese(1.345) // 壹圆叁角肆分伍厘
formatPriceToChinese(533211) // 伍拾叁万叁仟贰佰壹拾壹圆整

```