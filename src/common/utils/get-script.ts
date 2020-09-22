import { libsMap } from '../enums/libs-map';
const loadMap: { [key: string]: any } = {}; // 资源已加载清单
/**
 * 加载cndjs库
 * 挂载在Vue上，可通过this.$getScript(libName)
 * @export
 * @param {*} libName libs-map.ts中的js库名
 * @returns
 */
export function getScript(libName: string) {
  if (!libName) {
    return;
  }
  if (!loadMap[libName]) {
    loadMap[libName] = new Promise((resolve, reject) => {
      const libSrc = libsMap[libName];
      if (!libSrc) {
        reject(`lib '${libName}' not defined`);
        return;
      }
      const script = document.createElement('script');
      script.src = libSrc;
      script.onload = () => {
        document.body.removeChild(script);
        resolve();
      };
      script.onerror = () => {
        document.body.removeChild(script);
        reject();
      };
      document.body.appendChild(script);
    });
  }
  return loadMap[libName];
}
