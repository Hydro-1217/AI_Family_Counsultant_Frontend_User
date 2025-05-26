import pick from 'lodash/pick'
import omit from 'lodash/omit'
import find from 'lodash/find'

export default function convertTree2Map(tree, rule = {}, map = {}, parentMapKeyValue) {
  const { mapKey = 'key', parentMapKey = 'parentMapKey', childrenKey = 'children', pickedKeys, omittedKeys, original } = rule
  tree.forEach(node => {
    let result
    if (pickedKeys) {
      result = pick(node, pickedKeys)
    } else if (omittedKeys) {
      result = omit(node, omittedKeys)
    } else {
      result = original ? node : Object.assign({}, node)
    }
    result[parentMapKey] = parentMapKeyValue
    map[node[mapKey]] = result
    if (node[childrenKey]) convertTree2Map(node[childrenKey], rule, map, node[mapKey])
  })
  return map
}

export function getTreeBranch(node, map, rule = {}) {
  const { parentMapKey = 'parentMapKey', childrenKey = 'children' } = rule
  const key = node[parentMapKey]
  if (key) {
    let result = Object.assign({}, map[key])
    result[childrenKey] = [node]
    return getTreeBranch(result, map, rule)
  }
  return node
}

export function mergeTreeBranches(branches, rule = {}, nodes = []) {
  const { mapKey = 'key', childrenKey = 'children' } = rule 
  branches.forEach(branch => {
    let node = find(nodes, item => item[mapKey] === branch[mapKey])
    if (node) {
      if (!node[childrenKey]) node[childrenKey] = []
      mergeTreeBranches(branch[childrenKey], rule, node[childrenKey])
    } else {
      nodes.push(branch)
    }
  })
  return nodes
}