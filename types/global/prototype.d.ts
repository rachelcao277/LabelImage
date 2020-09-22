declare global {
  // 测试
  interface String {
      test(opts: string): string;
  }
}


/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export { };