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
  const itemMap = new Map<string | number, TreeNode<T>>();
  const rootNodes: TreeNode<T>[] = [];

  items.forEach((item) => {
    const nodeId = item[idField];
    const node: TreeNode<T> = { ...item, children: [] };
    itemMap.set(nodeId, node);
  });

  items.forEach((item) => {
    const nodeId = item[idField];
    const parentId = item[parentIdField];
    const node = itemMap.get(nodeId);

    if (node) {
      if (parentId === 0 || parentId === '0') {
        rootNodes.push(node);
      } else {
        const parent = itemMap.get(parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        } else {
          console.error('Parent node not found for ID:', parentId);
        }
      }
    }
  });

  if (orderField) {
    rootNodes.sort(
      (a, b) => (a[orderField] as number) - (b[orderField] as number),
    );
    itemMap.forEach((node) => {
      node.children?.sort(
        (a, b) => (a[orderField] as number) - (b[orderField] as number),
      );
    });
  }

  return rootNodes.map((rootNode) => {
    buildSubTree(rootNode);
    return rootNode;
  });
}

function buildSubTree<T extends Record<string, any>>(node: TreeNode<T>) {
  if (node.children) {
    node.children.forEach((child) => buildSubTree(child));
  }
}
