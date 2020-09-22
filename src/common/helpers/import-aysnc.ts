const loadComponent = (route: string, page: string) => () =>
  import(
    `@/views/${route}/pages/${page}/entry.vue`
  );

const toUpperCaseFisrt = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function routeClearUp(route: string, pageName: string, config?: any) {
  let res = {
    // 所有的一级目录下的 index 页面，皆直接使用当前路由
    path: pageName === 'index' ? `/${route}` : `/${route}/${pageName}`,
    name: `${toUpperCaseFisrt(route)}${toUpperCaseFisrt(pageName)}`,
    component: loadComponent(route, pageName)
  };
  res = Object.assign({}, res, config);
  return res;
}
