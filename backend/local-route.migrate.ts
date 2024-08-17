import * as fs from 'fs';
import * as path from 'path';

import { PrismaClient, SysMenu } from '@prisma/client';
import ts from 'typescript';

const prisma = new PrismaClient();

/**
 * 递归地从 TypeScript AST 节点中提取值
 * @param {ts.Node} node - 待提取值的 AST 节点
 * @returns {any} - 提取的值
 */
function extractValue(node: ts.Node): any {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  } else if (ts.isObjectLiteralExpression(node)) {
    const obj: Record<string, any> = {};
    node.properties.forEach((prop) => {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        obj[prop.name.text] = extractValue(prop.initializer);
      }
    });
    return obj;
  } else if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(extractValue);
  } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  return null;
}

/**
 * 从 TypeScript 文件读取路由并提取为 JSON 对象
 * @param {string} filePath - TypeScript 文件路径
 * @returns {any[]} - 提取的路由对象数组
 */
function readRoutesFromTsFile(filePath: string): any[] {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    fileContents,
    ts.ScriptTarget.ES2015,
    true,
  );

  const routes: any[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((decl) => {
        if (decl.name.getText() === 'generatedRoutes') {
          const initializer = decl.initializer;
          if (initializer && ts.isArrayLiteralExpression(initializer)) {
            initializer.elements.forEach((element) => {
              if (ts.isObjectLiteralExpression(element)) {
                routes.push(extractValue(element));
              }
            });
          }
        }
      });
    }
  });

  // console.log(JSON.stringify(routes, null, 2));
  return routes;
}

/**
 * 将路由对象转换为 SysMenu 数据库模型对象
 * @param {any} route - 从文件中提取的路由对象
 * @param {number} pid - 父 ID，默认为 0 代表顶级路由
 * @returns {SysMenu} - 转换后的 SysMenu 对象，准备插入数据库
 */
function transformRouteToSysMenu(
  route: any,
  pid: number = 0,
): Omit<SysMenu, 'id'> {
  const menuType =
    route.children && route.children.length > 0 ? 'directory' : 'menu';
  return {
    menuType: menuType,
    menuName: route.name,
    iconType: route.meta?.iconType || 1,
    icon: route.meta?.icon || null,
    routeName: route.name,
    routePath: route.path,
    component: route.component,
    pathParam: route.meta?.pathParam || null,
    status: 'ENABLED',

    activeMenu: route.meta?.activeMenu || null,
    hideInMenu: route.meta?.hideInMenu || false,
    pid: pid,
    order: route.meta?.order || 0,
    i18nKey: route.meta?.i18nKey || null,
    keepAlive: route.meta?.keepAlive || false,
    constant: route.meta?.constant || false,
    href: route.meta?.href || null,
    multiTab: route.meta?.multiTab || false,

    createdAt: new Date(),
    createdBy: 'System',
    updatedAt: new Date(),
    updatedBy: 'System',
  };
}

/**
 * 将路由数组递归转换，并聚合所有转换后的路由
 * @param {any[]} routes - 路由数组
 * @param {number} pid - 父级 ID，默认为 0
 * @param {any[]} allTransformedRoutes - 聚合所有转换后的路由
 * @returns {any[]} - 转换后的完整路由数组
 */
function transformRoutes(
  routes: any[],
  pid: number = 0,
  allTransformedRoutes: any[] = [],
): any[] {
  routes.forEach((route) => {
    const transformedRoute = transformRouteToSysMenu(route, pid);
    allTransformedRoutes.push(transformedRoute);
    if (route.children) {
      transformRoutes(route.children, route.name, allTransformedRoutes);
    }
  });
  return allTransformedRoutes;
}

/**
 * 从数据库中获取现有的路由数据
 * @returns {Promise<any[]>} - 现有路由数据数组
 */
async function fetchExistingRoutes(): Promise<any[]> {
  return prisma.sysMenu.findMany();
}

/**
 * 比较新旧路由数据，确定需要创建、更新或删除的路由
 * @param {any[]} newRoutes - 新路由数据数组
 * @param {any[]} existingRoutes - 现有路由数据数组
 * @returns {{creates: any[], updates: any[], deletes: any[]}} - 需要创建、更新和删除的路由信息
 */
function compareRoutes(
  newRoutes: any[],
  existingRoutes: any[],
): { creates: any[]; updates: any[]; deletes: any[] } {
  const updates: any[] = [];
  const deletes: any[] = [];
  const creates: any[] = [];

  const existingMap = new Map(
    existingRoutes.map((route) => [route.component, route]),
  );

  newRoutes.forEach((route) => {
    const existingRoute = existingMap.get(route.component);
    if (existingRoute) {
      updates.push({ ...route, id: existingRoute.id });
      existingMap.delete(route.component);
    } else {
      creates.push(route);
    }
  });

  existingMap.forEach((deletedRoute) => {
    deletes.push(deletedRoute.id);
  });

  existingMap.forEach((deletedRoute) => {
    deletes.push(deletedRoute);
  });

  return { creates, updates, deletes };
}

async function processAndPrintRoutes() {
  const filePath = path.join(
    __dirname,
    '../frontend/src/router/elegant/routes.ts',
  );
  const routes = readRoutesFromTsFile(filePath);
  const transformedRoutes = transformRoutes(routes);

  const existingRoutes = await fetchExistingRoutes();
  const { creates, updates, deletes } = compareRoutes(
    transformedRoutes,
    existingRoutes,
  );

  console.log('To Create:', JSON.stringify(creates, null, 2));
  if (creates.length > 0) {
    const result = await prisma.sysMenu.createMany({
      data: creates,
      skipDuplicates: true,
    });
    console.log(`Inserted ${result.count} new routes.`);
  }
  //TODO 更新删除还涉及业务 待定
  console.log('To Update:', JSON.stringify(updates, null, 2));
  console.log('To Delete:', JSON.stringify(deletes, null, 2));
}

processAndPrintRoutes();
