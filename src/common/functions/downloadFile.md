浏览器下载文件

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| arg | 资源路径、File、Blob  | File 或 Blob 或 Url | - |
| filename | 下载的文件名，注意需要带文件类型 `xxx.xxx` | String | - |

[更多信息参考](https://github.com/eligrey/FileSaver.js/)


```js
import downloadFile from 'commons.js/functions/downloadFile'
downloadFile('https://static-test.tezign.com/tezign-web-enterprise/images/1-410e590a4aa35e07f636b6fa0a012a1e.png', 'xxx.png')
```
