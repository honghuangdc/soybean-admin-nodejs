type TreeNode<T> = T & {
  children?: TreeNode<T>[];
};

/**
 * 生成树形结构
 * @param items 要转换成树形结构的原始列表
 * @param parentIdField 父节点字段名称
 * @param idField 唯一主键
 * @param orderField 排序字段名称（可选）
 * @returns 树形结构数组
 */
export function buildTree<T extends Record<string, any>>(
  items: T[],
  parentIdField: keyof T = 'pid',
  idField: keyof T = 'id',
  orderField?: keyof T,
): TreeNode<T>[] {
  const itemMap: Map<string, TreeNode<T>[]> = new Map();
  const nodeLookup: Map<string, TreeNode<T>> = new Map();

  items.forEach((item) => {
    const node: TreeNode<T> = { ...item, children: [] };
    const parentId = String(item[parentIdField]);
    const nodeId = String(item[idField]);

    nodeLookup.set(nodeId, node);
    if (!itemMap.has(parentId)) {
      itemMap.set(parentId, []);
    }
    itemMap.get(parentId)!.push(node);
  });

  if (orderField) {
    itemMap.forEach((children) => {
      children.sort((a, b) => {
        return Number(a[orderField]) - Number(b[orderField]);
      });
    });
  }

  function buildSubTree(parentId: string): TreeNode<T>[] {
    const children = itemMap.get(parentId) || [];
    children.forEach((child) => {
      child.children = buildSubTree(String(child[idField]));
    });
    return children;
  }

  return buildSubTree('0');
}
