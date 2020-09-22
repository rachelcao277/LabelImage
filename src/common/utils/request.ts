import axios from 'axios';
import { catchNoErr } from './catch-error';
// import { delUserInfo } from './login';
// import store, { SET_LOGIN_STATUS } from '@/store';
// import { toast } from './toast';
class ApiError extends Error {
  code: string;
  constructor(err: any) {
    const msg: string = err.message || err.errmsg || '';
    super(msg);
    Object.assign(this, err);
    this.code = err.code || err.errcode;
  }
}
const instance = axios.create({
  timeout: 30000, // 设置30s为超时
});

function fail(err: any, config: any) {
  // 需要踢出
  if (err.code === -99) {
    console.log('-99');
  } else {
    if (config.needHint) {
      // toast.err(err.message);
    }
  }
  throw new ApiError(err);
}

function success(res: any, config: any) {
  console.log('dddddd', res);
  const data = res.data;
  if (data && data.code === 1) {
    return config.originalData ? data : data.data;
  } else {
    fail({
      code: data.code || data.errcode,
      message: data.message || data.errmsg
    }, config);
  }
}

function mergeConfig(extraConfig: any) {
  const config = {
    originalData: false, // 是否需要原始返回数据。
    needHint: false // 接口默认不做err toast的
  };
  // 为了方便 第三个参数为boolean 值时可控制needHint值
  if (typeof extraConfig === 'boolean') {
    config.needHint = extraConfig;
  } else {
    Object.assign(config, extraConfig);
  }
  return config;
}
/**
 * 针对网关接口统一封装一个api
 * @param {string} service_name 网关接口名称
 * @param {object} param 接口参数
 * @returns {promise} 返回promise
 */
const url = 'api';
function axiosGet(service_name: string, param = {}, extraConfig = {}) {
  const config = mergeConfig(extraConfig);
  return instance
    .get(`${url}/${service_name}`, {
      params: param
    })
    .then((res: any) => {
      success(res, config);
    })
    .catch((err: any) => {
      fail(err, config);
    });
}
function axiosPost(service_name: string, param = {}, extraConfig = {}) {
  const config = mergeConfig(extraConfig);
  return instance
    .post(`${url}/${service_name}`, param)
    .then((res: any) => {
      success(res, config);
    })
    .catch((err: any) => {
      fail(err, config);
    });
}
/* eslint-disable */
export function _get() {
  // @ts-ignore
  return catchNoErr(axiosGet(...arguments));
}
export function _post() {
  // @ts-ignore
  return catchNoErr(axiosPost(...arguments));
}
/* eslint-disable */
export default instance;
