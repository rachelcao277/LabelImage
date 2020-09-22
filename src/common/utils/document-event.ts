/**
 * 事件机制
 *     on:绑定事件
 *        单个事件绑定示例
 *          $_EventLib.on('myEvent',callback)
 *        多个事件绑定示例
 *          $_EventLib.on([{
 *              eventType:'myEvent',
 *              callback:cb
 *          },{
 *              eventType:'myEvent2',
 *              callback:cb2
 *          }])
 *     dispatch:触发事件
 *        示例
 *          $_EventLib.dispatch('myEvent',{msg:'hello'})
 *     remove:删除事件
 *        单个事件删除示例
 *          $_EventLib.remove('myEvent')
 *
 */
declare let document: any;
if (!document.eventListeners) {
  document.eventListeners = {};
}
/**
 * [ 绑定监听 ]
 * @param  {string | array} eventType [ 事件类型 ]
 * @param  {function | null | undefined} callback [ 事件回调 ]
 */
document.onEvent = function(eventType: string | Array<any>, callback: object) {
  if (typeof eventType === 'string') {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  } else if (Object.prototype.toString.call(eventType) === '[object Array]') {
    for (let i = 0; i < eventType.length; i++) {
      if (Object.prototype.toString.call(eventType[i]) === '[object Object]') {
        if (!eventType[i].eventType) {
          console.log('onEvent:入参{array(<object>)=>缺少eventType参数}');
        } else if (!eventType[i].callback) {
          console.log('onEvent:入参{array(<object>)=>缺少callback回调函数}');
        } else {
          if (!this.eventListeners[eventType[i].eventType]) {
            this.eventListeners[eventType[i].eventType] = [];
          }
          this.eventListeners[eventType[i].eventType].push(
            eventType[i].callback
          );
        }
      } else {
        console.error('onEvent:入参{array(<object>)=>数据格式错误}');
        break;
      }
    }
  }
};
/**
 * [ 监听触发 ]
 * @param  {string | array} eventType [ 事件类型 ]
 * @param  {any} eventData [ 传参 ]
 */
document.dispatchEvent = function(eventType: string, eventData?: any) {
  for (const i in this.eventListeners[eventType]) {
    this.eventListeners[eventType][i].call(document, eventData);
  }
};
/**
 * [ 监听移除 ]
 * @param  {string | array} eventType [ 事件类型 ]
 */
document.removeEvent = function(eventType: string, fn: Function) {
  const eventArray: Array<Function> = [];
  if (typeof eventType === 'string' && fn) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach((item: any) => {
        if (item !== fn) {
          eventArray.push(item);
        }
      });
    }
    this.eventListeners[eventType] = eventArray.length ? eventArray : null;
  } else {
    console.log('removeEvent:请输入正确的参数类型');
  }
};
export default {
  on(eventType: string | Array<any>, callback: object) {
    document.onEvent(eventType, callback);
  },
  dispatch(eventType: string, eventData?: any) {
    document.dispatchEvent(eventType, eventData);
  },
  remove(eventType: string, fn: Function) {
    document.removeEvent(eventType, fn);
  },
};
