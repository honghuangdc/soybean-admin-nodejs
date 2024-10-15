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
  const itemMap = new Map<string, TreeNode<T>>();
  const rootNodes: TreeNode<T>[] = [];

  items.forEach((item) => {
    const node: TreeNode<T> = { ...item };
    const parentId = item[parentIdField] as string;

    if (parentId === '0') {
      rootNodes.push(node);
    } else {
      let parent = itemMap.get(parentId);
      if (!parent) {
        parent = { [idField]: parentId } as TreeNode<T>;
        itemMap.set(parentId, parent);
      }
      (parent.children || (parent.children = [])).push(node);
    }

    itemMap.set(item[idField] as string, node);
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
