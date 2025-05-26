// import { saveAs } from 'file-saver'

let saveAs = function() {};

if (typeof document === 'object') {
  saveAs = require('file-saver').saveAs;
}

export default saveAs;