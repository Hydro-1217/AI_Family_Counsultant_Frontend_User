import getFilePostfix from './getFilePostfix'

const FILE_THUMBS = {};
FILE_THUMBS.default = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file.png';
FILE_THUMBS.ai   = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-ai.png';
FILE_THUMBS.doc  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-doc.png';
FILE_THUMBS.gif  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-gif.png';
FILE_THUMBS.jpeg = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-jpeg.png';
FILE_THUMBS.jpg  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-jpg.png';
FILE_THUMBS.page = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-page.png';
FILE_THUMBS.pdf  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-pdf.png';
FILE_THUMBS.png  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-png.png';
FILE_THUMBS.ps   = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-ps.png';
FILE_THUMBS.xls  = 'https://static.tezign.com/tezign-web-vendors/images/thumb/file-xls.png';

/** @module getFileThumb */

/**
 * 
 * @param file { File|string } 文件或者文件名
 * @return {string} 返回值
 */
export default function getFileThumb(file) {
  return FILE_THUMBS[getFilePostfix(file)] || FILE_THUMBS.default;
}



获取文件类型的缩略图

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| file | 文件或者文件名 | File 或  String | - |

返回结果 `Sring` 类型，文件类型的缩略图地址；支持以下格式

| 类型 | 缩略图 |
| --- | --- |
| default |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file.png) |
| ai |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-ai.png) |
| doc |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-doc.png) |
| gif |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-gif.png) |
| jpeg |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-jpeg.png) |
| jpg |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-jpg.png) |
| page |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-page.png) |
| pdf |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-pdf.png) |
| png |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-png.png) |
| ps |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-ps.png) |
| xls |  ![](https://static.tezign.com/tezign-web-vendors/images/thumb/file-xls.png) |

```js
import getFileThumb from 'commons.js/functions/getFileThumb'

getFileThumb('我的123.png') // https://static.tezign.com/tezign-web-vendors/images/thumb/file-png.png 
getFileThumb('我的123.JPG') // https://static.tezign.com/tezign-web-vendors/images/thumb/file-jpg.png 

```