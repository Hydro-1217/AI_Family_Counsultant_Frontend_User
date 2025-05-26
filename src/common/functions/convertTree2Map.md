将 tree 类型的数据转换成 map

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tree | 元数据 | [Tree](#tree) | - |
| rule | 转换规则 | [Rule](#rule) | - |

返回 TreeMap  

### getTreeBranch

通过节点获取枝干信息（从根节点到当前节点的完整的树形数据）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| node | 树节点 | [TreeNode](#treenode) | - |
| map | tree 通过 `convertTree2Map` 方法转化后的 map | [TreeMap](#treemap) | - |
| rule | 转换规则，这里只能设置 `parentMapKey` 和 `childrenKey` | [Rule](#rule) | - |

返回 TreeBranch

### mergeTreeBranches

合并枝干数据

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| branches | 枝干数据 | TreeBranch[] | - |
| rule | 转换规则，这里只能设置 `mapKey` 和 `childrenKey` | [Rule](#rule) | - |

返回 Tree

#### Rule

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mapKey | 取树节点的中的一个属性作为 map 的 key | String | 'key' |
| parentMapKey | 设置生成的 map 数据中会有一个 属性 去关联父节点在 map 中的 key | String | 'parentMapKey' |
| childrenKey | 树节点的子节点属性 | String | 'children' |
| pickedKeys | 选取 node 的属性，默认全量保存 | []string | - |
| omittedKeys | 过滤 node 的属性 | []string | - |
| original | 转换到 map 中的数据是否需要保留原始对象引用，当设置了 `pickedKeys` 或 `omittedKeys` 时无效 | Boolean | false |

#### Tree

树形数据

#### TreeMap

平铺树形数据为 map 结构

#### TreeBranch

从根节点到一个树节点的数据结构

#### TreeNode

树节点

```js
import convertTree2Map, { getTreeBranch, mergeTreeBranches } from 'commons.js/functions/convertTree2Map'

```
