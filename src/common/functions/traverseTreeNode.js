export default function traverseTreeNode(node, callback) {
  callback && callback(node)
  const { children } = node
  if (!(children && children.length)) return
  children.forEach((item) => traverseTreeNode(item, callback))
}