import { libsMap } from '../enums/libs-map';
const loadMap: { [key: string]: any } = {}; // 资源已加载清单
/**
 * 加载cndjs库（不一定await使用，酌情处理）
 * 挂载在Vue上，可通过this.$getCss(libName)
 * @export
 * @param {*} libName libs-map.ts中的css库名
 * @returns
 */
export function getCss(libName: string) {
  if (!libName) {
    return;
  }
  if (!loadMap[libName]) {
    loadMap[libName] = new Promise((resolve, reject) => {
      const libSrc = libsMap[libName];
      if (!libSrc) {
        reject(`lib '${libName}' not defined`);
      }
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = libSrc;
      link.onload = () => {
        resolve();
      };
      link.onerror = () => {
        reject();
      };
      const head: Element | null = document.querySelector('head');
      head && head.appendChild(link);
    });
  }
  return loadMap[libName];
}
