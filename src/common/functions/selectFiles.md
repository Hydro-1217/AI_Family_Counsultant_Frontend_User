模拟浏览器打开文件选择器的行为

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 参数配置 | [Options](#Options) | - |

返回结果 `Promise` 类型 

| 参数 | 说明 | 类型  |
| --- | --- | --- | 
| files | 文件列表 | File[] |
| error | 错误 [ERRORS](#ERRORS) 中的一种 | String |

#### Options
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| accept | 文件类型 | String 或 regex 或 function | - |
| maxsize | 文件大小限制，单位 bit | Number | - |
| maximum | 文件数量限制 | Number | - |
| multiple | 是否多选 | Boolean | true |

accept [配置参考](https://git.tezign.com/tezign-core-frontend/commons.js/blob/master/src/functions/checkFileAccept.md)

### validFiles
验证文件列表是否合法

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| files | 文件列表 | File[] | - |
| options | 参数配置 | [Options](#options) | - |

返回错误信息 `String`：[ERRORS](#errors) 中的一种，当结果为空时表示验证通过

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
import selectFiles, { validFiles, ERRORS } from 'commons.js/functions/selectFiles'
selectFiles({
  maxsize: 10 * 1024 * 1024,
  maximum: 5,
  accept: 'image/*'
}).then(files => {
  console.log(files);
}, err => {
  console.log('something error: ', err);
})
```