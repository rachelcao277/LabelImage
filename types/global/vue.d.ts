//  // 1. 确保在声明补充的类型之前导入 'vue'
// import { AxiosPromise } from 'axios';
import { Config } from '../interface/config';

declare module 'vue/types/vue' {
  interface Vue {
    // $loadModule: (name: string) => void;
    // $loadModuleByPath: (name: string) => void;
    // $registerModule: (config: ModuleConfig) => void;
    $config: Config;
    // $api: (
    //   service_name: string,
    //   param?: object,
    //   extraConfig?:object|boolean,
    // ) => AxiosPromise;
    [p: string]: any;
  }
}
