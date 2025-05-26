
import selectFiles from './selectFiles'
export { ERRORS } from './selectFiles'

export default function(options = {}) {
  options.multiple = false;
  return selectFiles(options).then(files => files[0])
}
