import { AxiosRequestConfig } from "axios";

declare interface CommonResult <T> {
  code: number;
  msg: string;
  result: T;
}
declare interface LhHttpRequestConfig extends AxiosRequestConfig {
  noErrorMessage?: boolean; // 是否自动输出错误Message
  sync?: boolean; // 该接口是否合并节流（同时触发多次时取最后一次）TODO 暂时不写，方案在优化中
}