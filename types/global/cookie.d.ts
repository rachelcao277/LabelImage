declare namespace Cookie {
  function getItem(key: any): any;
  function setItem(key: string, value: any, end?: any, path?: string, domain?: string, secure?: string): null;
  function removeItem(key: string, path?: string, domain?: string): any;
  function keys(): any;
}
