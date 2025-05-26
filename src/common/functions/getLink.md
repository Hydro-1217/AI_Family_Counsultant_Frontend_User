格式化链接

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 链接 | String | - |

返回结果 `Sring` 类型，链接中如果不带 `*://` 默认加上 `http://`

```js
import getLink from 'commons.js/functions/getLink'

getLink('https://www.tezign.com') // https://www.tezign.com 
getLink('www.tezign.com') // http://www.tezign.com

```