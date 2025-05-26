距离现在的时间差

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| time | 时间戳 ms | Number | - |

返回结果 `String` 类型

- 刚刚 (时间在5分钟以内)
- `${interval}分钟之前` (时间在1小时以内)
- 1小时之前
- 2小时之前
- 今天凌晨 (时间在当天时间0-6)
- 今天上午 (时间在当天时间06-12)
- 今天下午 (时间在当天时间012-18)
- 今天晚上 (时间在当天时间018-24)
- 昨天
- `MM.DD HH:mm` (时间在昨天以前)
- `YYYY.MM.DD HH:mm` (时间在一年前)

```js
import fromNow from 'commons.js/functions/fromNow'

fromNow() // 

```