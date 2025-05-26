import http from '../http'
const API_ORIGIN = 'https://service.tezign.com'
let flag = false
let unitCodeMap = {} // 存放没有自定义的的map结构 {code: name}
let unitOption = [] // 存放单位列表list [{code:'', name:''}]
let customUnit = {} // 存放自定义单位枚举 {code:12, name:'自定义'}
// 获取单位接口，向外暴露接口
export function getStdUnitList() {
  return http.get(`${API_ORIGIN}/std/stdUnitList`, {
    headers: {
      'service-name': 'top2',
    },
  })
}

// 获取单位并赋值
export async function fetchUnitList() {
  if (flag) return
  flag = true
  const res = await  getStdUnitList()
  flag = false
  
  if(res.length) {
    customUnit = res.find((item) => item.name === '自定义')
    res.forEach((item) => {
      if (item.code !== customUnit.code) {
        unitCodeMap[item.code] = item.name
      }
    })
    unitOption = res
  }
}

// 判断是否已经有单位list,没有重新发起请求
function unitOptionRepeatRequest() {
  if (!(Array.isArray(unitOption) && unitOption.length) && !flag) {
    fetchUnitList()
  }
}

// 获取单位list
export function getUnitOption() {
  unitOptionRepeatRequest()
  return unitOption
}

// 获取单位映射不包含自定义
export function getUnitCodeMap() {
  unitOptionRepeatRequest()
  return unitCodeMap
}
 
// 获取自定义单位对象
export function getCustomUnit() {
  unitOptionRepeatRequest()
  return customUnit
}

// 通过单位code查找单位名称
export function getUnitName(unitCode, customUnitInfo) {
  unitOptionRepeatRequest()
  const unitName = getUnitCodeMap()[unitCode]
  if (unitName) {
    return unitName
  }
  if (unitCode === getCustomUnit().code) {
    return customUnitInfo || getCustomUnit().name
  }
  return ''
}