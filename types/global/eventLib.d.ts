declare namespace $_EventLib {
  function on(eventType: string | Array<any>, callback: object): void;
  function dispatch(eventType: string, eventData?: any): void;
  function remove(eventType: string, fn: Function): void;
}
  


