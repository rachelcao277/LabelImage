import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { routeClearUp } from '@/common/helpers/import-aysnc.ts';
function setRoute(routeName: string, pageName: string, config?: any) {
  return routeClearUp(routeName, pageName, config);
}

const pageList: any = process.env.PAGE_LIST;
const routes: Array<RouteConfig> = [];
if (pageList && pageList.length) {
  pageList.forEach((page: any) => {
    const currentPageConfig = require(`../views/${page.relativePath}/page.config.ts`).default;
    const relativePath = page.relativePath.split('/pages/');
    const routeName = relativePath[0];
    const pageName = relativePath[1];
    routes.push(setRoute(routeName, pageName, currentPageConfig));
  });
}

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

export default router;
