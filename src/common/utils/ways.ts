/**
 * [数据劫持]
 * @param  {any} vm [组件]
 * @param  {string|Array<string>} key [参数]
 * @param  {Boolean} oneWay? [单向数据] [默认双向绑定]
 */
export function def(
  vm: any,
  key: string | Array<string>,
  oneWay?: boolean
): object {
  const obj: object = {};
  let keys: Array<string> = [];
  if (typeof key === 'string') {
    keys.push(key);
  } else {
    keys = key;
  }
  for (let i = 0; i < keys.length; i++) {
    Object.defineProperty(obj, keys[i], {
      get: () => vm[keys[i]],
      set: newValue => {
        if (!oneWay) {
          vm[keys[i]] = newValue;
        }
      },
      enumerable: true,
    });
  }
  return obj;
  // 示例
  // let dataTest = def(this,['testing','testing2']);
  // return { dataTest };
}

/**
 * [遍历]
 * @param  {Object | Array<any>} targe [组件]
 * @param  {Function} cb [回调函数]
 */
export function each(targe: Record<string, any> | Array<any>, cb: Function) {
  if (Object.prototype.toString.call(targe) === '[object Array]') {
    (targe as Array<any>).forEach((item, index) => {
      cb(item, index);
    });
  } else {
    Object.keys(targe).forEach((key: string, index: number) => {
      // @ts-ignore
      cb(targe[key], key, index);
    });
  }
}

/**
 * [首字母大写]
 * @param  {Object | Array<any>} targe [组件]
 * @param  {Function} cb [回调函数]
 */
export function to(targe: Record<string, any> | Array<any>, cb: Function) {
  if (Object.prototype.toString.call(targe) === '[object Array]') {
    (targe as Array<any>).forEach((item, index) => {
      cb(item, index);
    });
  } else {
    Object.keys(targe).forEach((key: string, index: number) => {
      // @ts-ignore
      cb(targe[key], key, index);
    });
  }
}
