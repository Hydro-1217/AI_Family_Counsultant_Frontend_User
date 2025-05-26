
校验表单数据，校验通过时 resolve [FormData](#FormData) ；校验失败时 reject message

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 表单单元 | [Field](#http://ui.tezign.com/components/wrap-form-field-cn/#Field) | - |

返回结果 `Promise` 类型 

```js
import validFormFields from 'commons.js/functions/validFormFields'

const fields = [{
  key: 'email',
  label: '邮 箱',
  component: <Input prefix={<Icon type="letter" />} />,
  value: 'tezign.com',
  placeholder: 'please input your email',
  rules: [{
    required: true, message: 'Please input your E-mail!'
  }, {
    type: 'email', message: 'The input is not valid E-mail!'
  }, {
    min: 3, max: 20, message: '3 - 20 word'  
  }]      
}, {
  key: 'gender',
  label: '性 别',
  component: (
    <Radio.Group>
      <Radio.Button value={1}>男</Radio.Button>
      <Radio.Button value={2}>女</Radio.Button>
    </Radio.Group>    
  ),
  value: 1,
  placeholder: 'please select your gender',
  rules: [{
    required: true, message: 'Please input your gender!'
  }] 
}, {
  key: 'location',
  label: '地 址',
  component: <Input.TextArea />,
  value: 'china'
  rules: {
    required: true, message: '请填写地址'
  }  
}]

validFormFields(fields).then(data => {
  // 
  console.log(data); // { email: 'tezign.com', gender: 1, location: 'china' }
}, err => {
  console.log('something error: ', err);
})
```