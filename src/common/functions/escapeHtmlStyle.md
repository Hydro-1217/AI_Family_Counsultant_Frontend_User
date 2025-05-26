清除HTML字符串的style属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| str | HTML字符串 | String | - |

返回结果 `String` 类型，清除style之后的字符串

```js
import escapeHtmlStyle from 'commons.js/functions/escapeHtmlStyle'

const html = '<div style="font-size: 15px;">123</div>'
escapeHtmlStyle(html) // <div >123</div>
```