模拟浏览器打开文件选择器的行为，选取单个文件

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 参数配置 | [Options](#options) | - |

返回结果 `Promise` 类型 

| 参数 | 说明 | 类型  |
| --- | --- | --- | 
| file | 文件 | File |
| error | 错误 [ERRORS](#errors) 中的一种 | String |

#### Options
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| accept | 文件类型 | String 或 regex 或 function | - |
| maxsize | 文件大小限制，单位 bit | Number | - |
| maximum | 文件数量限制 | Number | - |
| multiple | 是否多选，始终是 false | Boolean | false |

accept [配置参考](https://git.tezign.com/tezign-core-frontend/commons.js/blob/master/src/functions/checkFileAccept.md)

### ERRORS
错误信息
- EXCEED_MAXSIZE 文件大小超出限制
- EXCEED_MAXIMUM 文件数量超出限制
- ACCEPT_FAILED 文件类型不对
- CANCELED 用户取消选择

```
ERRORS = {
  EXCEED_MAXSIZE: 'EXCEED_MAXSIZE',
  EXCEED_MAXIMUM: 'EXCEED_MAXIMUM',
  ACCEPT_FAILED: 'ACCEPT_FAILED',
  CANCELED: 'CANCELED'
}
```

```js
import selectFile, { ERRORS } from 'commons.js/functions/selectFile'
selectFile({
  maxsize: 10 * 1024 * 1024,
  accept: 'image/*'
}).then(file => {
  console.log(file);
}, err => {
  console.log('something error: ', err);
})
```