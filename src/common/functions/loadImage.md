加载图片

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | String | - |

返回结果 `Promise` 类型

```js
import loadImage from 'commons.js/functions/loadImage'

loadImage('http://xxx.sfsadfs.com/sdfs.png').then((img) => {
  console.log(img) // img dom 对象
})

```