export default function (fields = []) {
  let err = ''
  const invalid = fields.some((field) => {
    // 如果有错误或者正在校验中，返回
    if (field.error) {
      err = field.error
    }
    if (field.validating) {
      err = 'validating'
    }
    return !!err
  })    
  if (invalid) return Promise.reject(err)
  //全量校验，都通过校验后提交数据
  const fc = fields.map(field => field.valid())
  return Promise.all(fc)
}