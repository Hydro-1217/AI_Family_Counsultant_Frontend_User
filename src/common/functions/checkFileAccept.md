检查文件类型

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| file | 文件或者文件名 | File 或  string | - |
| accept | 文件类型，支持 html input 中的 accept 类型指定，也可以这样指定 '*.png' '.png' 'png' ；可以用 `,` 分隔多个规则（包含关系）。另外支持 function 或 regex 来自定义校验规则 | string 或 regex 或 function | - |

返回检车结果 `boolean` 类型
```js
import checkFileAccept from 'commons.js/functions/checkFileAccept'
checkFileAccept('xxx.png', 'image/*') // true
checkFileAccept('xxx.gif', 'image/*') // true
checkFileAccept('xxx.png', 'image/png') // true
checkFileAccept('xxx.png', 'image/gif') // false
checkFileAccept('xxx.png', 'image/gif,image/png') // true
checkFileAccept('xxx.png', 'png') // true
checkFileAccept('xxx.png', '.png') // true
checkFileAccept('xxx.png', '*.jpg,*.png') // true

checkFileAccept('xxx.png', /\.png$/) // true

checkFileAccept('xxx.png', (filename) => filename.indexOf('.png') > -1) // true

const file // 系统文件 { ..., name: 'xxx.png'}
checkFileAccept(file, 'image/png') // true
// 当第一个参数为 file 类型时，正则匹配的是 file.name
checkFileAccept(file, /\.png$/) // true
// 当第一个参数为 file 类型时，自定义校验函数的参数为 file
checkFileAccept(file, (file) => file.name.indexOf('.png') > -1) // true


```
