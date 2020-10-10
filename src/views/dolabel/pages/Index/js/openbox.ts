
/* eslint-disable */
function openBox(e:string, isOpen:boolean) {
  const el = <HTMLImageElement>document.querySelector(e);
  const maskBox = <HTMLImageElement>document.querySelector('.mask_box');
  if (isOpen) {
    maskBox.style.display = 'block';
    el.style.display = 'block';
  } else {
    maskBox.style.display = 'none';
    el.style.display = 'none';
  }
}
/* eslint-enable */
export default {
  Hello: 'hello world',
  openBox
};
