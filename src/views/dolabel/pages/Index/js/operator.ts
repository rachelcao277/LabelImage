
import LabelImage from './webAnnotate';
import box from './openbox';


export default function main() {
  // debugger;
  // 设置画布初始属性
  const canvasMain = document.querySelector('.canvasMain') as HTMLDivElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const resultGroup = document.querySelector('.resultGroup') as HTMLDivElement;

  // 设置画布宽高背景色
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  canvas.style.background = '#8c919c';

  const annotate = new LabelImage({
    canvas: canvas,
    scaleCanvas: document.querySelector('.scaleCanvas') as HTMLDivElement,
    scalePanel: document.querySelector('.scalePanel') as HTMLDivElement,
    annotateState: document.querySelector('.annotateState') as HTMLDivElement,
    canvasMain: canvasMain,
    resultGroup: resultGroup,
    crossLine: document.querySelector('.crossLine') as HTMLPreElement,
    labelShower: document.querySelector('.labelShower') as HTMLPreElement,
    screenShot: document.querySelector('.screenShot') as HTMLPreElement,
    screenFull: document.querySelector('.screenFull') as HTMLPreElement,
    colorHex: document.querySelector('#colorHex') as HTMLInputElement,
    toolTagsManager: document.querySelector('.toolTagsManager') as HTMLDivElement,
    historyGroup: document.querySelector('.historyGroup') as HTMLDivElement
  });

  // 初始化交互操作节点
  const prevBtn = document.querySelector('.pagePrev') as HTMLDivElement; // 上一张
  const nextBtn = document.querySelector('.pageNext') as HTMLDivElement; // 下一张
  const taskName = document.querySelector('.pageName') as HTMLPreElement; // 标注任务名称
  const processIndex = document.querySelector('.processIndex') as HTMLSpanElement; // 当前标注进度
  const processSum = document.querySelector('.processSum') as HTMLSpanElement; // 当前标注任务总数

  const imgFiles = [
    './images/example/football.jpg',
    './images/example/person.jpg',
    './images/example/band.jpg',
    './images/example/street.jpg',
    './images/example/dog.jpeg',
    './images/example/cat.jpg',
    './images/example/dogs.jpg',
    './images/example/furniture.jpg',
    './images/example/basketball.jpg',
    './images/example/alley.jpg'
  ]; // 选择上传的文件数据集

  let imgIndex = 1; // 标定图片默认下标;
  const imgSum = 10; // 选择图片总数;


  // 切换操作选项卡
  const tool = document.getElementById('tools') as HTMLDivElement;
  tool.addEventListener('click', function(e: any) {
    for (let i = 0; i < tool.children.length; i++) {
      tool.children[i].classList.remove('focus');
    }
    e.target.classList.add('focus');
    switch (true) {
      case e.target.className.indexOf('toolDrag') > -1: // 拖拽
        annotate.SetFeatures('dragOn', true);
        break;
      case e.target.className.indexOf('toolRect') > -1: // 矩形
        annotate.SetFeatures('rectOn', true);
        break;
      case e.target.className.indexOf('toolPolygon') > -1: // 多边形
        annotate.SetFeatures('polygonOn', true);
        break;
      case e.target.className.indexOf('toolTagsManager') > -1: // 标签管理工具
        annotate.SetFeatures('tagsOn', true);
        break;
      default:
        break;
    }
  });

  const openFolder = document.querySelector('.openFolder');
  if (openFolder) {
    openFolder.addEventListener('click', function() {
      const openFolderInput = document.querySelector('.openFolderInput') as HTMLInputElement;
      if (openFolderInput) {
        openFolderInput.click();
      }
    });
  }

  function selectImage(index: number) {
    box.openBox('#loading', true);
    processIndex.innerText = imgIndex + '';
    // taskName.innerText = imgFiles[index].name || imgFiles[index].split('/')[3];
    taskName.innerText = imgFiles[index].split('/')[3];
    const content = localStorage.getItem(taskName.innerText);
    // const img = imgFiles[index].name ? window.URL.createObjectURL(imgFiles[index]) : imgFiles[index];
    const img = imgFiles[index];
    content ? annotate.SetImage(img, JSON.parse(content)) : annotate.SetImage(img);
  }


  // function changeFolder(e: any) {
  //   imgFiles = e.files;
  //   imgSum = imgFiles.length;
  //   processSum.innerText = imgSum + '';
  //   imgIndex = 1;
  //   selectImage(0);
  // }

  // changeFolder()

  // 获取下一张图片
  nextBtn.onclick = function() {
    annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(taskName.innerText, JSON.stringify(annotate.Arrays.imageAnnotateMemory)); // 保存已标定的图片信息
    if (imgIndex >= imgSum) {
      imgIndex = 1;
      selectImage(0);
    } else {
      imgIndex++;
      selectImage(imgIndex - 1);
    }
  };

  // 获取上一张图片
  prevBtn.onclick = function() {
    annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(taskName.innerText, JSON.stringify(annotate.Arrays.imageAnnotateMemory)); // 保存已标定的图片信息
    if (imgIndex === 1) {
      imgIndex = imgSum;
      selectImage(imgSum - 1);
    } else {
      imgIndex--;
      selectImage(imgIndex - 1);
    }
  };



  // 初始化图片状态
  function initImage() {
    selectImage(0);
    processSum.innerText = imgSum + '';
  }

  initImage();

  function saveJson(data: any, filename: string) {
    if (!data) {
      alert('保存的数据为空');
      return false;
    }
    if (!filename) {
      filename = 'json.json';
    }
    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 4);
    }
    const blob = new Blob([data], { type: 'text/json' });
    const e = document.createEvent('MouseEvent');
    const a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  const btnsaveJson = document.querySelector('.saveJson');
  if (btnsaveJson) {
    btnsaveJson.addEventListener('click', function() {
      const filename = taskName.innerText.split('.')[0] + '.json';
      annotate.Arrays.imageAnnotateMemory.length > 0 ? saveJson(annotate.Arrays.imageAnnotateMemory, filename) : alert('当前图片未有有效的标定数据');
    });
  }

}
