/**
 * [统一处理某方法promise的catch]
 * @param  {any} obj
 */
export function catchNoErr(obj: any) {
  const newObj = obj
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      throw err;
    });
  newObj.oldThen = newObj.then;
  newObj.then = (onFulfilled: Function, onRejected: Function) => {
    return newObj.oldThen(
      onFulfilled,
      onRejected ||
        function() {}
    );
  };
  return newObj;
}
