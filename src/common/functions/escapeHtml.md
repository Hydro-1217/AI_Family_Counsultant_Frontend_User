过滤掉字符串中HTML元素

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| str | 指定字符串 | String | - |

返回结果 `String` 类型，过滤之后的字符串

```js
import escapeHtml from 'commons.js/functions/escapeHtml'

const html = '<div>123</div><p>i am</p>'
escapeHtml(html) // 123i am
```