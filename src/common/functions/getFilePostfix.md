获取文件类型后缀

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| file | 文件或者文件名 | File 或  String | - |

返回结果 `Sring` 类型

```js
import getFilePostfix from 'commons.js/functions/getFilePostfix'

getFilePostfix('我的123.png') // png 
getFilePostfix('我的123.JPG') // jpg 

```