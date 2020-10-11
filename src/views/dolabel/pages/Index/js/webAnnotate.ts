/*
    Canvas handle 主函数
 */

import ColorpickerCreate from './colorPicker';
import box from './openbox';

class Point {

  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}


class RectMask {
  xMin= 0;
  yMin= 0;
  width= 0;
  height= 0;
}


class LabelItem {
  labelName = '未命名';//  '未命名',
  labelColor='red';
  labelColorRGB = '255,0,0';
  labelColorR = '255';
  labelColorG = '0';
  labelColorB = '0';
  visibility = false;
}

class Annotate {
  content: Array<Point> = [];
  labels = new LabelItem();
  labelLocation = new Point(0, 0);// this.ComputerLabelLocation(rectMask),
  rectMask = new RectMask();
  contentType = '';
}

class Nodes {
  // 图片节点
  image: any = null;
  // 画布节点
  canvas: any = null;
  // 缩略图节点
  scaleCanvas: any = null;
  // 缩放比例面板
  scalePanel: any = null;
  // 画布上下文
  ctx: any = null;
  // 缩略图画板上下文
  sCtx: any = null;
  // 缩略图方框
  scaleRect: any = null;
  // 存储图像数据的画布
  bCanvas: any = null;
  // 存储图像数据的上下文
  bCtx: any = null;
  // 绘图部分主外层函数
  canvasMain: any = null;
  // 标记结果数据集
  resultGroup: any = null;
  // 十字线开关按钮
  crossLine: any = null;
  // 标注结果开关按钮
  labelShower: any = null;
  // 屏幕快照按钮
  screenShot: any = null;
  // 全屏按钮
  screenFull: any = null;
  // 颜色选取器节点数据
  colorHex: any = null;
  // 清空标注内容
  // clearScreen: options.clearScreen;
  // 撤销，返回上一步
  // returnUp: options.returnUp;
  // 标签管理
  toolTagsManager: any = null;
  // 历史记录列表
  historyGroup: any = null;
}

class OpHistory {
  type='';
  desc='';
  index= 0;
  content = '';
}

class LabelArrayItem {

  // 标定历史保存标签记录
  history: Array<OpHistory> = [];

  // 图片标注展示数据集
  imageAnnotateShower: Array<Annotate> = [];

  // 图片标注存储数据集
  imageAnnotateMemory: Array<Annotate> = [];

  // 标注集操作 result list index
  resultIndex= 0;

}



export default class LabelImage {
  // 画布宽度
  cWidth = 0;
  // 画布高度
  cHeight = 0;
  // 缩略图宽度
  sWidth = 0;
  // 缩略图高度
  sHeight = 0;
  // 图片宽度
  iWidth = 0;
  // 图片高度
  iHeight = 0;
  // 图片拖拽至边缘最小显示
  appearSize = 180;
  // 缩放布进
  scaleStep = 0.02;
  // 最小缩放比例
  minScale = 0.2;
  // 最大缩放比例
  maxScale = 8;
  // 图片在画板中的横坐标
  x = 0;
  // 图片在画板中的纵坐标
  y = 0;
  // 鼠标当前画板中的横坐标
  mouseX = 0;
  // 鼠标当前画板中的纵坐标
  mouseY = 0;
  // 拖动过程中，鼠标前一次移动的横坐标
  prevX = 0;
  // 拖动过程中，鼠标前一次移动的纵坐标
  prevY = 0;
  // 缩放比例
  scale = 0;
  // 鼠标在图片中的横坐标
  ix = 0;
  // 鼠标在图片中的纵坐标
  iy = 0;
  // 矩形框起点横坐标
  rectX = 0;
  // 矩形框起点纵坐标
  rectY = 0;
  // 绘制多边形的圆点半径
  radius = 6;

  // 绘制线段宽度
  lineWidth = 1;

  // 绘制区域模块透明度
  opacity = 0.45;

  // 定时器
  timer = null;

  // 结果是否被修改
  isModify = false;

  // 是否全屏
  isFullScreen = false;

  // 是否移动图像标注圆点
  isDrogCircle = false;

  // 当前点击圆点index
  snapCircleIndex = 0;

  // 用于在拖拽或者缩放时，让绘制至存储面板的数据，只绘制一次
  drawFlag = true;

  // 监听滚动条缩放是否结束的定时器
  mousewheelTimer: any = null;

  // 历史记录下标
  historyIndex = 0;

  Arrays: LabelArrayItem = new LabelArrayItem();
  // {

  //   // 标定历史保存标签记录
  //   history: [],

  //   // 图片标注展示数据集
  //   imageAnnotateShower: [],

  //   // 图片标注存储数据集
  //   imageAnnotateMemory: [],

  //   // 标注集操作 result list index
  //   resultIndex: 0,

  // };

  Nodes: Nodes = new Nodes();

  // 字典
  Features: { [key: string]: boolean } = {
    // 拖动开关
    'dragOn': true,
    // 矩形标注开关
    'rectOn': false,
    // 多边形标注开关
    'polygonOn': false,
    // 标签管理工具
    'tagsOn': false,
    // 十字线开关
    'crossOn': false,
    // 标注结果显示
    'labelOn': true,
  };

  // __self:LabelImage = this;
  constructor(options: any) {
    // 画布宽度
    this.cWidth = options.canvas.clientWidth;
    // 画布高度
    this.cHeight = options.canvas.clientHeight;

    // 画布节点
    this.Nodes.canvas = options.canvas;
    // 缩略图节点
    this.Nodes.scaleCanvas = options.scaleCanvas;
    // 缩放比例面板
    this.Nodes.scalePanel = options.scalePanel;
    // 画布上下文
    this.Nodes.ctx = options.canvas.getContext('2d');

    // 绘图部分主外层函数
    this.Nodes.canvasMain = options.canvasMain;
    // 标记结果数据集
    this.Nodes.resultGroup = options.resultGroup;
    // 十字线开关按钮
    this.Nodes.crossLine = options.crossLine;
    // 标注结果开关按钮
    this.Nodes.labelShower = options.labelShower;
    // 屏幕快照按钮
    this.Nodes.screenShot = options.screenShot;
    // 全屏按钮
    this.Nodes.screenFull = options.screenFull;
    // 颜色选取器节点数据
    this.Nodes.colorHex = options.colorHex;
    // 清空标注内容
    // clearScreen: options.clearScreen,
    // 撤销，返回上一步
    // returnUp: options.returnUp,
    // 标签管理
    this.Nodes.toolTagsManager = options.toolTagsManager;
    // 历史记录列表
    this.Nodes.historyGroup = options.historyGroup;

    this.Initial();
  }

  // ----初始化节点参数，绑定各自事件
  Initial() {
    const _nodes = this.Nodes;
    // let _this: any = null;
    // _this = this;
    _nodes.scaleRect = document.createElement('div') as HTMLDivElement;
    _nodes.scaleRect.className = 'scaleWindow';
    Object.assign(_nodes.scaleRect.style, { position: 'absolute', border: '1px solid red', boxSizing: 'border-box' });
    _nodes.scaleCanvas.appendChild(_nodes.scaleRect);
    _nodes.canvas.addEventListener('mousedown', this.CanvasMouseDown.bind(this));
    _nodes.canvas.addEventListener('mousewheel', this.MouseWheel.bind(this));
    _nodes.canvas.addEventListener('DOMMouseScroll', this.MouseWheel.bind(this)); // 兼容Firefox 滚动条事件
    _nodes.canvas.addEventListener('contextmenu', LabelImage.NoRightMenu.bind(this));
    _nodes.scaleCanvas.addEventListener('click', this.ScaleCanvasClick.bind(this));
    _nodes.crossLine.addEventListener('click', this.CrossHairSwitch.bind(this));
    _nodes.labelShower.addEventListener('click', this.IsShowLabels.bind(this));
    _nodes.screenShot.addEventListener('click', this.ScreenShot.bind(this));
    _nodes.screenFull.addEventListener('click', this.IsScreenFull.bind(this));
    _nodes.historyGroup.addEventListener('click', this.HistoryClick.bind(this));
    document.addEventListener('fullscreenchange', this.ScreenViewChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.ScreenViewChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.ScreenViewChange.bind(this));
    document.addEventListener('msfullscreenchange', this.ScreenViewChange.bind(this));
    // _nodes.canvas.addEventListener('mousemove', (e: MouseEvent) => { this.CanvasMouseMove(e); });
    _nodes.resultGroup.addEventListener('mouseover', this.ResultListOperation.bind(this));
    _nodes.toolTagsManager.addEventListener('click', this.ManageLabels.bind(this));


    // 初始化事件绑定函数, 为了能移除掉所以保存起来
    _nodes.canvas.onDragRectCircleRepaintRectFn = this.DragRectCircleRepaintRect.bind(this);
    _nodes.canvas.onRemoveDragRectCircleFn = this.RemoveDragRectCircle.bind(this);
    _nodes.canvas.onCircleDragFn = this.CircleDrag.bind(this);
    _nodes.canvas.onRemoveCircleDragFn = this.RemoveCircleDrag.bind(this);
    _nodes.canvas.onImageDragFn = this.ImageDrag.bind(this);
    _nodes.canvas.onRemoveImageDragFn = this.RemoveImageDrag.bind(this);
    _nodes.canvas.onMouseMoveDrawRectFn = this.MouseMoveDrawRect.bind(this);
    _nodes.canvas.onMouseUpRemoveDrawRectFn = this.MouseUpRemoveDrawRect.bind(this);
    _nodes.canvas.onMouseMoveCrossHairLocationFn = this.MouseMoveCrossHairLocation.bind(this);

    _nodes.canvas.onCanvasMouseMoveFN = this.CanvasMouseMove.bind(this);
    _nodes.canvas.addEventListener('mousemove', _nodes.canvas.onCanvasMouseMoveFN);
  }

  // ----设置图片并初始化画板信息
  // tip: Point
  SetImage(src: string, memory = []) {
    const _nodes = this.Nodes;
    _nodes.image = new Image();
    _nodes.image.crossOrigin = 'anonymous';
    _nodes.image.src = src;
    // 监听图片加载
    _nodes.image.addEventListener('load', () => {
      box.openBox('#loading', false);
      this.iWidth = _nodes.image.width;
      this.iHeight = _nodes.image.height;
      // 获取原有节点
      const beforeCanvas = _nodes.scaleCanvas.querySelectorAll('canvas');
      const bodyCanvas = document.querySelector('.bodyCanvas');

      // 删除原有节点
      if (beforeCanvas.length > 0) {
        _nodes.scaleCanvas.removeChild(beforeCanvas[0]);
      }
      if (bodyCanvas) {
        document.body.removeChild(bodyCanvas);
      }

      // 初始化上一张图片标注数据
      for (let i = this.Nodes.resultGroup.children.length - 1; i >= 0; i--) {
        this.Nodes.resultGroup.removeChild(this.Nodes.resultGroup.children[i]);
      }
      for (let i = this.Nodes.historyGroup.children.length - 1; i >= 0; i--) {
        this.Nodes.historyGroup.removeChild(this.Nodes.historyGroup.children[i]);
      }
      const lll = document.querySelector('.resultLength');
      if (lll) {
        lll.innerHTML = '0';
      }
      this.Arrays.imageAnnotateShower.splice(0, this.Arrays.imageAnnotateShower.length);
      this.Arrays.imageAnnotateMemory.splice(0, this.Arrays.imageAnnotateMemory.length);
      this.Arrays.history.splice(0, this.Arrays.history.length);

      // 创建缩略图画板
      const sCanvas = document.createElement('canvas');
      _nodes.sCtx = sCanvas.getContext('2d');
      sCanvas.style.display = 'block';
      this.sWidth = parseInt(_nodes.scaleCanvas.getBoundingClientRect().width);
      this.sHeight = parseInt((this.sWidth * this.iHeight / this.iWidth) + '');
      sCanvas.width = this.sWidth;
      sCanvas.height = this.sHeight;
      _nodes.scaleCanvas.appendChild(sCanvas);

      // 创建数据存储面板
      _nodes.bCanvas = document.createElement('canvas');
      _nodes.bCanvas.width = this.iWidth;
      _nodes.bCanvas.height = this.iHeight;
      _nodes.bCanvas.style.display = 'none';
      _nodes.bCanvas.className = 'bodyCanvas';
      _nodes.bCtx = _nodes.bCanvas.getContext('2d');
      _nodes.bCtx.drawImage(_nodes.image, 0, 0, this.iWidth, this.iHeight);
      _nodes.bCtx.translate(0.5, 0.5);
      document.body.appendChild(_nodes.bCanvas);

      this.scale = 1;

      // 图片初始定位
      // 初始化自适应缩放图片并居中
      if (this.iWidth > this.cWidth || this.iHeight > this.cHeight) {
        this.scale = this.iWidth - this.cWidth > this.iHeight - this.cHeight ? this.cWidth / this.iWidth : this.cHeight / this.iHeight;
      }
      const initImgX = (this.cWidth - this.iWidth * this.scale) / 2;
      const initImgY = (this.cHeight - this.iHeight * this.scale) / 2;
      this.SetXY(initImgX, initImgY);


      this.historyIndex = 0;
      if (memory.length > 0) {
        this.Arrays.imageAnnotateMemory = memory;
        this.ReplaceAnnotateShow();
        this.RepaintResultList();
        this.Arrays.imageAnnotateMemory.forEach((memory, index) => {
          this.RecordOperation('add', '绘制', index, JSON.stringify(memory));
        });
      }
    });
  }

  // ----设置功能参数
  SetFeatures(f: string, value: boolean) {
    if (f === 'crossOn' || f === 'labelOn') {
      this.Features[f] = value;
    } else {
      for (const key in this.Features) {
        if (key !== 'crossOn' && key !== 'labelOn') {
          this.Features[key] = false;
        }
      }
    }
    this.Features[f] = value;


    // 清空标注结果列表中classList
    const resultList = this.Nodes.resultGroup.getElementsByClassName('result_list');
    for (let i = 0; i < resultList.length; i++) {
      resultList[i].classList.remove('active');
    }
    this.Arrays.resultIndex = 0;
    this.DrawSavedAnnotateInfoToShow(this.Arrays.resultIndex);
  }

  // ----更新画板数据, 将存储面板数据绘制到展示面板已经缩略图面板
  UpdateCanvas() {
    const _nodes = this.Nodes;
    _nodes.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    _nodes.sCtx.clearRect(0, 0, this.sWidth, this.sWidth * this.iHeight / this.iHeight);

    _nodes.ctx.drawImage(_nodes.bCanvas, -this.x / this.scale, -this.y / this.scale, this.cWidth / this.scale, this.cHeight / this.scale, 0, 0, this.cWidth, this.cHeight);
    _nodes.sCtx.drawImage(_nodes.bCanvas, 0, 0, this.iWidth, this.iHeight, 0, 0, this.sWidth, this.sHeight);

    // 将缩略图方框区域绘制到画布
    let width = this.sWidth * this.cWidth / this.iWidth / this.scale;
    let height = width * this.cHeight / this.cWidth;
    let left = -this.x * this.sWidth / (this.iWidth * this.scale);
    let top = -this.y * this.sWidth / (this.iWidth * this.scale);
    // 将方框宽度固定在缩略图面板中
    if (width + left >= this.sWidth) {
      width = this.sWidth - left;
      left = this.sWidth - width;
      if (width >= this.sWidth) {
        width = this.sWidth;
        left = 0;
      }
    } else if (left <= 0) {
      width += left;
      left = 0;
    }

    // 将方框高度固定在缩略图面板中
    if (height + top >= this.sHeight) {
      height = this.sHeight - top;
      top = this.sHeight - height;
      if (height >= this.sHeight) {
        height = this.sHeight;
        top = 0;
      }
    } else if (top <= 0) {
      height += top;
      top = 0;
    }

    _nodes.scaleRect.style.left = left + 'px';
    _nodes.scaleRect.style.top = top + 'px';
    if (width !== Number(_nodes.scaleRect.style.width)) {
      _nodes.scaleRect.style.width = width + 'px';
      _nodes.scaleRect.style.height = height + 'px';
    }

    _nodes.scalePanel.innerText = (this.scale * 100).toFixed(2) + '%';
  }

  // ----画板跟随鼠标十字线绘制函数
  MouseMoveCrossHair() {
    const _nodes = this.Nodes;
    _nodes.ctx.setLineDash([6, 3]);
    _nodes.ctx.lineWidth = 1;
    _nodes.ctx.strokeStyle = '#333';
    _nodes.ctx.beginPath();
    // 横线
    _nodes.ctx.moveTo(0, this.mouseY);
    _nodes.ctx.lineTo(this.cWidth, this.mouseY);
    _nodes.ctx.stroke();
    // 纵线
    _nodes.ctx.moveTo(this.mouseX, 0);
    _nodes.ctx.lineTo(this.mouseX, this.cHeight);
    _nodes.ctx.stroke();
    _nodes.ctx.closePath();
  }

  // ----鼠标跟随十字线开关按钮操作函数
  CrossHairSwitch() {
    const _nodes = this.Nodes;
    if (_nodes.crossLine.className.indexOf('focus') > -1) {
      _nodes.crossLine.childNodes[1].checked = false;
      _nodes.crossLine.classList.remove('focus');
      this.SetFeatures('crossOn', false);
      // _nodes.canvas.removeEventListener('mousemove', this.MouseMoveCrossHairLocation.bind(this));
      _nodes.canvas.removeEventListener('mousemove', _nodes.canvas.onMouseMoveCrossHairLocationFn);
    } else {
      _nodes.crossLine.childNodes[1].checked = true;
      _nodes.crossLine.classList.add('focus');
      this.SetFeatures('crossOn', true);

      // _nodes.canvas.onDragRectCircleRepaintRectFN = this.MouseMoveCrossHairLocation.bind(this);
      _nodes.canvas.addEventListener('mousemove', _nodes.canvas.onMouseMoveCrossHairLocationFn);
    }
  }

  // ----鼠标移动十字线定位函数
  MouseMoveCrossHairLocation() {
    // 更新鼠标当前位置十字线
    if (this.Features.crossOn) {
      this.DrawSavedAnnotateInfoToShow();
      this.MouseMoveCrossHair();
    }
  }

  // ----监听画板鼠标移动
  CanvasMouseMove(this: LabelImage, e: any) {
    const _nodes = this.Nodes;
    const _arrays = this.Arrays;
    // ;
    this.GetMouseInCanvasLocation(e);
    if (_arrays.resultIndex !== 0) {
      const imageIndexShow = _arrays.imageAnnotateShower[_arrays.resultIndex - 1].content;
      if (imageIndexShow.length > 0) {
        for (let i = 0; i < imageIndexShow.length; i++) {
          // 使用勾股定理计算鼠标当前位置是否处于当前点上
          const distanceFromCenter = Math.sqrt(Math.pow(imageIndexShow[i].x - this.mouseX, 2) + Math.pow(imageIndexShow[i].y - this.mouseY, 2));
          // 改变圆点颜色动画
          if (distanceFromCenter <= this.radius) {
            _nodes.canvas.style.cursor = 'grabbing';
            return;
          } else {
            _nodes.canvas.style.cursor = 'crosshair';
          }
        }
      }
    }
  }

  // ----监听画板鼠标点击
  CanvasMouseDown(e: any) {
    const _nodes = this.Nodes;
    const _arrays = this.Arrays;
    this.GetMouseInCanvasLocation(e);
    if (e.button === 0) {
      this.isDrogCircle = false;
      if (_arrays.resultIndex !== 0) {
        const imageIndex = _arrays.imageAnnotateShower[_arrays.resultIndex - 1].content;
        if (imageIndex.length > 0) {
          for (let i = 0; i < imageIndex.length; i++) {
            // 使用勾股定理计算鼠标当前位置是否处于当前点上
            const distanceFromCenter = Math.sqrt(Math.pow(imageIndex[i].x - this.mouseX, 2) + Math.pow(imageIndex[i].y - this.mouseY, 2));
            if (distanceFromCenter <= this.radius) {
              this.isDrogCircle = true;
              this.snapCircleIndex = i;
              if (_arrays.imageAnnotateShower[_arrays.resultIndex - 1].contentType === 'rect') {
                // this.Nodes.canvas.onDragRectCircleRepaintRectFn = this.DragRectCircleRepaintRect.bind(this);// 为了后面能够移除掉,所以存起来.
                this.Nodes.canvas.addEventListener('mousemove', this.Nodes.canvas.onDragRectCircleRepaintRectFn);

                // this.Nodes.canvas.onRemoveDragRectCircleFn = this.RemoveDragRectCircle.bind(this);// 为了后面能够移除掉,所以存起来.
                this.Nodes.canvas.addEventListener('mouseup', this.Nodes.canvas.onRemoveDragRectCircleFn);

              } else if (_arrays.imageAnnotateShower[_arrays.resultIndex - 1].contentType === 'polygon') {

                // this.Nodes.canvas.onCircleDragFn = this.CircleDrag.bind(this);// 为了后面能够移除掉,所以存起来.
                this.Nodes.canvas.addEventListener('mousemove', this.Nodes.canvas.onCircleDragFn);

                // this.Nodes.canvas.onRemoveCircleDragFn = this.RemoveCircleDrag.bind(this);// 为了后面能够移除掉,所以存起来.
                this.Nodes.canvas.addEventListener('mouseup', this.Nodes.canvas.onRemoveCircleDragFn);

              }
              return;
            } else {
              this.isDrogCircle = false;
            }
          }
        }
      }
      if (!this.isDrogCircle) {
        if (this.Features.dragOn) {
          // 是否开启拖拽模式
          const prevP = this.CalculateChange(e, _nodes.canvas);
          this.prevX = prevP.x;
          this.prevY = prevP.y;

          // this.Nodes.canvas.onImageDragFn = this.ImageDrag.bind(this);
          // this.Nodes.canvas.onRemoveImageDragFn = this.RemoveImageDrag.bind(this);

          _nodes.canvas.addEventListener('mousemove', this.Nodes.canvas.onImageDragFn);
          _nodes.canvas.addEventListener('mouseup', this.Nodes.canvas.onRemoveImageDragFn);
        } else if (this.Features.rectOn) {
          // 是否开启绘制矩形功能
          if (this.Arrays.resultIndex === 0) {
            _nodes.ctx.lineWidth = 1;
            _nodes.ctx.strokeStyle = '#ff0000';
            _nodes.ctx.fillStyle = 'rgba(255,0,0,' + this.opacity + ')';
            this.rectX = this.mouseX;
            this.rectY = this.mouseY;

            console.log('MouseMoveDrawRect addEventListener 绑定绘制矩形框的事件');

            // this.Nodes.canvas.onMouseMoveDrawRectFn = this.MouseMoveDrawRect.bind(this);// 为了后面能够移除掉,所以存起来.
            this.Nodes.canvas.addEventListener('mousemove', this.Nodes.canvas.onMouseMoveDrawRectFn);

            // this.Nodes.canvas.onMouseUpRemoveDrawRectFn = this.MouseUpRemoveDrawRect.bind(this);// 为了后面能够移除掉,所以存起来.
            this.Nodes.canvas.addEventListener('mouseup', this.Nodes.canvas.onMouseUpRemoveDrawRectFn);

          }
        } else if (this.Features.polygonOn) {
          // 是否开启绘制多边形功能
          const resultList = _nodes.resultGroup.getElementsByClassName('result_list');
          let isActive = false;
          for (let i = 0; i < resultList.length; i++) {
            // 循环结果列表判断是否点击某一个结果，若是，则改变焦点
            if (resultList[i].className.indexOf('active') > -1) {
              _arrays.resultIndex = resultList[i].id * 1;
              isActive = true;
            }
          }
          if (!isActive) {
            _arrays.resultIndex = 0;
          }
          if (_arrays.resultIndex === 0) {
            // 未选定标签结果，创建新标签
            this.CreateNewResultList(this.mouseX, this.mouseY, 'polygon');
          }
          if (!this.isDrogCircle) {
            const index = _arrays.resultIndex - 1;
            // 保存坐标点
            _arrays.imageAnnotateShower[index].content.push({ x: this.mouseX, y: this.mouseY });
            this.CalcRectMask(_arrays.imageAnnotateShower[index].content);
            this.ReplaceAnnotateMemory();
            this.DrawSavedAnnotateInfoToShow();
            this.RecordOperation('addPoint', '添加坐标点', index, JSON.stringify(_arrays.imageAnnotateMemory[index]));
          }
        }
      }
    } else if (e.button === 2) {
      // 长按右击直接开启拖拽模式
      const prevP = this.CalculateChange(e, _nodes.canvas);
      this.prevX = prevP.x;
      this.prevY = prevP.y;

      // _nodes.canvas.onImageDragFN = this.ImageDrag.bind(this);
      // _nodes.canvas.onRemoveImageDragFN = this.RemoveImageDrag.bind(this);
      _nodes.canvas.addEventListener('mousemove', _nodes.canvas.onImageDragFN);
      _nodes.canvas.addEventListener('mouseup', _nodes.canvas.onRemoveImageDragFN);
    }
  }

  // ----通过已保存的坐标点计算矩形蒙层位置与大小，以及标签位置, 添加至数组列表中
  CalcRectMask(arrays: Array<any>) {
    if (arrays.length >= 2) {
      // 保存边缘矩形框坐标点
      let xMin = arrays[0].x;
      let xMax = arrays[0].x;
      let yMin = arrays[0].y;
      let yMax = arrays[0].y
        ;
      arrays.forEach((item) => {
        xMin = xMin < item.x ? xMin : item.x;
        xMax = xMax > item.x ? xMax : item.x;
        yMin = yMin < item.y ? yMin : item.y;
        yMax = yMax > item.y ? yMax : item.y;
      });
      this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].rectMask = {
        'xMin': xMin,
        'yMin': yMin,
        'width': xMax - xMin,
        'height': yMax - yMin
      };
      // 计算已创建的标签居中显示
      const labelX = (xMax - xMin) / 2 + xMin;
      const labelY = (yMax - yMin) / 2 + yMin;
      this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].labelLocation.x = labelX;
      this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].labelLocation.y = labelY;
    }
  }

  // ----绘制矩形的方法
  DrawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, rgb: string) {
    ctx.strokeStyle = color;
    ctx.fillStyle = 'rgba(' + rgb + ',' + this.opacity + ')';
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
  }

  // ----绘制圆点的方法
  DrawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, this.radius / 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  // ----绘制标签的方法
  DrawRectLabel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, name: string) {
    ctx.font = '12px Verdana';
    const txtWidth = ctx.measureText(name).width;
    ctx.fillStyle = 'rgba(255,255,255, 0.7)';
    ctx.fillRect(x - txtWidth / 2 - 8, y - 10, txtWidth + 16, 20);
    ctx.fillStyle = color;
    ctx.fillText(name, x - txtWidth / 2, y + 4);
    // index = index * 1;
  }

  // ----绘制已保存的标定信息（在数据操作更新时渲染）绘至数据展示画板
  DrawSavedAnnotateInfoToShow(resultIndex = 0) {
    const _arrays = this.Arrays;
    const _nodes = this.Nodes;
    _nodes.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    _nodes.ctx.drawImage(_nodes.bCanvas, -this.x / this.scale, -this.y / this.scale, this.cWidth / this.scale, this.cHeight / this.scale, 0, 0, this.cWidth, this.cHeight);
    _nodes.ctx.setLineDash([0, 0]);
    _arrays.imageAnnotateShower.forEach((item, index) => {
      if (item.contentType === 'polygon') {
        // 绘制闭合线条
        _nodes.ctx.beginPath();
        _nodes.ctx.lineWidth = this.lineWidth;
        _nodes.ctx.moveTo(item.content[0].x, item.content[0].y);
        item.content.forEach((line) => {
          _nodes.ctx.lineTo(line.x, line.y);
        });
        _nodes.ctx.fillStyle = 'rgba(' + item.labels.labelColorRGB + ',' + this.opacity + ')';
        _nodes.ctx.fill();
        _nodes.ctx.strokeStyle = 'rgba(' + item.labels.labelColorRGB + ',' + this.opacity + ')';
        _nodes.ctx.stroke();
      } else if (item.contentType === 'rect') {
        this.DrawRect(_nodes.ctx, item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height, item.labels.labelColor, item.labels.labelColorRGB);
      }
      if (_arrays.resultIndex !== 0 && _arrays.resultIndex - 1 === index) {
        item.content.forEach((circle) => {
          // 绘制圆点
          this.DrawCircle(_nodes.ctx, circle.x, circle.y, '#20c3f9');
        });
      }
      if (item.content.length >= 2 && item.labels.visibility) {
        // 绘制标签
        // this.DrawRectLabel(_nodes.ctx, item.labelLocation.x, item.labelLocation.y, item.labels.labelColor, item.labels.labelName, index + 1);
        this.DrawRectLabel(_nodes.ctx, item.labelLocation.x, item.labelLocation.y, item.labels.labelColor, item.labels.labelName);
      }
      // 绘制矩形蒙层
      if (resultIndex && resultIndex - 1 === index) {
        _nodes.ctx.beginPath();
        _nodes.ctx.lineWidth = 2;
        _nodes.ctx.strokeStyle = '#fffd4d';
        _nodes.ctx.fillStyle = 'rgba(255, 253, 77, 0.3)';
        _nodes.ctx.strokeRect(item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height);
        _nodes.ctx.fillRect(item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height);
        _nodes.ctx.closePath();
      }
    });
  }

  // ----绘制已保存的标定信息（只在拖拽和缩放画布时渲染）绘画至数据存储面板
  DrawSavedAnnotateInfoToMemory(isRender: boolean) {
    const _arrays = this.Arrays;
    const _nodes = this.Nodes;
    _nodes.bCtx.clearRect(0, 0, this.iWidth, this.iHeight);
    _nodes.bCtx.drawImage(_nodes.image, 0, 0, this.iWidth, this.iHeight);
    if (isRender) {
      _arrays.imageAnnotateMemory.forEach((item, index) => {
        if (item.contentType === 'polygon') {
          // 绘制闭合线条
          _nodes.bCtx.beginPath();
          _nodes.bCtx.lineWidth = this.lineWidth;
          _nodes.bCtx.moveTo(item.content[0].x, item.content[0].y);
          item.content.forEach((line) => {
            _nodes.bCtx.lineTo(line.x, line.y);
          });
          _nodes.bCtx.fillStyle = 'rgba(' + item.labels.labelColorRGB + ',' + this.opacity + ')';
          _nodes.bCtx.fill();
          _nodes.bCtx.strokeStyle = 'rgba(' + item.labels.labelColorRGB + ',' + this.opacity + ')';
          _nodes.bCtx.stroke();
        } else if (item.contentType === 'rect') {
          this.DrawRect(_nodes.bCtx, item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height, item.labels.labelColor, item.labels.labelColorRGB);
        }
        if (_arrays.resultIndex !== 0 && _arrays.resultIndex - 1 === index) {
          item.content.forEach((circle) => {
            // 绘制圆点
            this.DrawCircle(_nodes.bCtx, circle.x, circle.y, '#20c3f9');
          });
        }
        if (item.content.length >= 2 && item.labels.visibility) {
          // 绘制标签
          this.DrawRectLabel(_nodes.bCtx, item.labelLocation.x, item.labelLocation.y, item.labels.labelColor, item.labels.labelName);
        }
      });
    }
    this.UpdateCanvas();
    !isRender && this.DrawSavedAnnotateInfoToShow();

  }

  // ----圆点拖拽事件，并且重新绘制边缘轨迹点
  CircleDrag(e: any) {
    this.GetMouseInCanvasLocation(e);
    const imageIndex = this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].content;
    imageIndex[this.snapCircleIndex].x = this.mouseX;
    imageIndex[this.snapCircleIndex].y = this.mouseY;
    this.DrawSavedAnnotateInfoToShow();
  }

  // ----移除圆点拖拽事件, 并重新绘制一遍最新状态
  RemoveCircleDrag() {
    const index = this.Arrays.resultIndex - 1;


    // this.Nodes.canvas.removeEventListener('mousemove', this.CircleDrag.bind(this));
    // this.Nodes.canvas.removeEventListener('mouseup', this.RemoveCircleDrag.bind(this));
    this.Nodes.canvas.removeEventListener('mousemove', this.Nodes.canvas.onCircleDragFn);
    this.Nodes.canvas.removeEventListener('mouseup', this.Nodes.canvas.onRemoveCircleDragFn);

    // 移除圆点拖拽事件之后，改变被拖拽圆点在矩形蒙层数据中的坐标
    this.CalcRectMask(this.Arrays.imageAnnotateShower[index].content);
    this.DrawSavedAnnotateInfoToShow();
    this.ReplaceAnnotateMemory();
    this.RecordOperation('modify', '拖拽更新多边形边缘点', index, JSON.stringify(this.Arrays.imageAnnotateMemory[index]));
  }

  // ----图片拖拽事件函数
  ImageDrag(e: any) {
    const _nodes = this.Nodes;
    const p = this.CalculateChange(e, _nodes.canvas);
    const offsetX = (p.x - this.prevX);
    const offsetY = (p.y - this.prevY);
    this.SetXY(this.x + offsetX, this.y + offsetY);
    this.prevX = p.x;
    this.prevY = p.y;
    if (this.drawFlag) {
      this.DrawSavedAnnotateInfoToMemory(true);
      this.drawFlag = false;
    }
  }

  // ----移除鼠标拖拽图片事件函数, 并将最新数据绘制到存储面板中
  RemoveImageDrag() {
    this.ReplaceAnnotateShow();
    this.DrawSavedAnnotateInfoToMemory(false);
    this.drawFlag = true;
    // this.Nodes.canvas.removeEventListener('mousemove', this.ImageDrag.bind(this));
    // this.Nodes.canvas.removeEventListener('mouseup', this.RemoveImageDrag.bind(this));
    this.Nodes.canvas.removeEventListener('mousemove', this.Nodes.canvas.onImageDragFn);
    this.Nodes.canvas.removeEventListener('mouseup', this.Nodes.canvas.onRemoveImageDragFn);
  }

  // ----鼠标移动绘制矩形事件
  MouseMoveDrawRect(e: any) {
    console.log('MouseMoveDrawRect 鼠标移动绘制矩形');
    this.GetMouseInCanvasLocation(e);
    this.DrawSavedAnnotateInfoToShow();
    this.Nodes.ctx.strokeStyle = '#ff0000';
    this.Nodes.ctx.fillStyle = 'rgba(255,0,0,' + this.opacity + ')';
    this.Nodes.ctx.strokeRect(this.rectX, this.rectY, this.mouseX - this.rectX, this.mouseY - this.rectY);
    this.Nodes.ctx.fillRect(this.rectX, this.rectY, this.mouseX - this.rectX, this.mouseY - this.rectY);
  }

  // ----绘制矩形时鼠标抬起后 移除监听函数
  MouseUpRemoveDrawRect() {
    console.log('MouseUpRemoveDrawRect 执行鼠标抬起后任务1');
    if (this.mouseX - this.rectX >= 5 || this.rectX - this.mouseX >= 5) { // 判断矩形绘制距离大于五才认定为有效绘制
      // 保存绘图数据
      this.CreateNewResultList(this.mouseX, this.mouseY, 'rect');
      this.DrawSavedAnnotateInfoToShow();
      this.ReplaceAnnotateMemory();
      const index = this.Arrays.resultIndex - 1;
      this.RecordOperation('add', '绘制矩形框', index, JSON.stringify(this.Arrays.imageAnnotateMemory[index]));
    }

    console.log('MouseUpRemoveDrawRect 执行鼠标抬起后任务2 移除监听函数');
    // this.Nodes.canvas.removeEventListener('mousemove', this.MouseMoveDrawRect.bind(this));
    // this.Nodes.canvas.removeEventListener('mouseup', this.MouseUpRemoveDrawRect.bind(this));

    this.Nodes.canvas.removeEventListener('mousemove', this.Nodes.canvas.onMouseMoveDrawRectFn);
    this.Nodes.canvas.removeEventListener('mouseup', this.Nodes.canvas.onMouseUpRemoveDrawRectFn);
  }

  // ----拖拽矩形圆点时改变矩形十个点坐标
  DragRectCircleChangeLocation(content: Array<Point>, circleIndex: number) {
    switch (circleIndex) {
      case 0:
        content[1].y = this.mouseY;
        content[3].x = this.mouseX;
        break;
      case 1:
        content[0].y = this.mouseY;
        content[2].x = this.mouseX;
        break;
      case 2:
        content[1].x = this.mouseX;
        content[3].y = this.mouseY;
        break;
      case 3:
        content[0].x = this.mouseX;
        content[2].y = this.mouseY;
        break;
      default:
        break;
    }
  }

  // ----拖拽矩形圆点时重新绘制矩形事件
  DragRectCircleRepaintRect(e: any) {
    this.GetMouseInCanvasLocation(e);
    const imageIndex = this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].content;
    this.Nodes.ctx.fillStyle = 'rgba(' + this.Arrays.imageAnnotateShower[this.Arrays.resultIndex - 1].labels.labelColorRGB + ',' + this.opacity + ')';
    imageIndex[this.snapCircleIndex].x = this.mouseX;
    imageIndex[this.snapCircleIndex].y = this.mouseY;
    this.DragRectCircleChangeLocation(imageIndex, this.snapCircleIndex);
    this.CalcRectMask(imageIndex);
    this.DrawSavedAnnotateInfoToShow();
  }

  // ----移除矩形圆点拖拽事件，并将最新数据绘制到存储面板中
  RemoveDragRectCircle() {
    this.ReplaceAnnotateMemory();
    this.DrawSavedAnnotateInfoToMemory(false);
    this.drawFlag = true;
    // this.Nodes.canvas.removeEventListener('mousemove', this.DragRectCircleRepaintRect.bind(this));
    // this.Nodes.canvas.removeEventListener('mouseup', this.RemoveDragRectCircle.bind(this));
    // this.Nodes.canvas.onRemoveDragRectCircleFn = this.RemoveDragRectCircle.bind(this);
    this.Nodes.canvas.removeEventListener('mousemove', this.Nodes.canvas.onDragRectCircleRepaintRectFn);
    this.Nodes.canvas.removeEventListener('mouseup', this.Nodes.canvas.onRemoveDragRectCircleFn);

    const index = this.Arrays.resultIndex - 1;
    this.RecordOperation('modify', '拖拽更新矩形框', index, JSON.stringify(this.Arrays.imageAnnotateMemory[index]));
  }

  // ----重新绘制已保存的图像标注记录与标签（删除修改之后重新渲染整体模块）
  RepaintResultList() {
    // 先清空标签, 之后再重新渲染
    this.Arrays.resultIndex = 0;
    this.DrawSavedAnnotateInfoToShow();
    this.ReplaceAnnotateMemory();
    this.Nodes.resultGroup.innerHTML = '';
    if (this.Arrays.imageAnnotateShower.length > 0) {
      let _index = 0;
      this.Arrays.imageAnnotateShower.forEach((item, index) => {
        // 创建结果标签
        _index = ++index;
        const eyeIconClass = item.labels.visibility ? 'icon-eye-open' : 'icon-eye-close';
        const resultListBody = document.createElement('div');
        resultListBody.className = 'result_list';
        resultListBody.id = _index + '';
        resultListBody.innerHTML = '<span class="result_no">' + _index + '</span>' +
          '<span class="result_color" style="background: ' + item.labels.labelColor + ';"></span>' +
          '<input class="result_Name" value="' + item.labels.labelName + '" disabled>' +
          '<i class="editLabelName icon-pencil"></i>' +
          '<i class="deleteLabel icon-trash"></i>' +
          '<i class="isShowLabel ' + eyeIconClass + '"></i>';
        this.Nodes.resultGroup.appendChild(resultListBody);
      });
      const h = document.querySelector('.resultLength');
      if (h) {
        h.innerHTML = _index + '';
      }
    }
  }

  // ----创建新的标定结果标签
  CreateNewResultList(lx: number, ly: number, contentType: string) {
    const _nodes = this.Nodes;
    const _arrays = this.Arrays;
    const eyeIconClass = _nodes.labelShower.children[0].checked ? 'icon-eye-open' : 'icon-eye-close';
    const resultLength = document.querySelectorAll('.result_list').length + 1;
    const resultListBody = document.createElement('div');
    resultListBody.className = 'result_list active';
    resultListBody.id = resultLength + '';
    resultListBody.innerHTML = '<span class="result_no">' + resultLength + '</span>' +
      '<span class="result_color"></span>' +
      '<input class="result_Name" value="未命名" disabled>' +
      '<i class="editLabelName icon-pencil"></i>' +
      '<i class="deleteLabel icon-trash"></i>' +
      '<i class="isShowLabel ' + eyeIconClass + '"></i>';
    _nodes.resultGroup.appendChild(resultListBody);

    // 轮询获取当前ResultIndex;
    const resultList = _nodes.resultGroup.getElementsByClassName('result_list');
    for (let i = 0; i < resultList.length; i++) {
      if (resultList[i].className.indexOf('active') > -1) {
        _arrays.resultIndex = resultList[i].id * 1;
      }
    }

    if (contentType === 'rect') {
      const mask = new RectMask();

      mask.xMin = this.rectX;
      mask.yMin = this.rectY;
      mask.width = this.mouseX - this.rectX;
      mask.height = this.mouseY - this.rectY;

      const lableitem = new LabelItem();
      lableitem.labelName = '未命名';
      lableitem.labelColor = 'red';
      lableitem.labelColorRGB = '255,0,0';
      lableitem.visibility = _nodes.labelShower.children[0].checked;


      const annostateA = new Annotate();
      annostateA.labels = lableitem;
      annostateA.labelLocation = this.ComputerLabelLocation(mask);
      annostateA.contentType = contentType;
      annostateA.rectMask = mask;
      annostateA.content = [
        new Point(this.rectX, this.rectY),
        new Point(this.mouseX, this.rectY),
        new Point(this.mouseX, this.mouseY),
        new Point(this.rectX, this.mouseY),
      ];
      this.Arrays.imageAnnotateShower.push(annostateA);

      // this.Arrays.imageAnnotateShower.push({
      //   content: [
      //     { x: this.rectX, y: this.rectY },
      //     { x: this.mouseX, y: this.rectY },
      //     { x: this.mouseX, y: this.mouseY },
      //     { x: this.rectX, y: this.mouseY },
      //   ],
      //   labels: {
      //     labelName: '未命名',
      //     labelColor: 'red',
      //     labelColorRGB: '255,0,0',
      //     visibility: _nodes.labelShower.children[0].checked,
      //   },
      //   labelLocation: this.ComputerLabelLocation(rectMask),
      //   rectMask,
      //   contentType: contentType,
      // });
      this.ReplaceAnnotateMemory();
    } else if (contentType === 'polygon') {

      const lableitem = new LabelItem();
      lableitem.labelName = '未命名';
      lableitem.labelColor = 'red';
      lableitem.labelColorRGB = '255,0,0';
      lableitem.visibility = _nodes.labelShower.children[0].checked;

      const pp = new Point(lx, ly);

      const annostateA = new Annotate();
      annostateA.labels = lableitem;
      annostateA.labelLocation = pp;
      annostateA.contentType = contentType;
      annostateA.rectMask = new RectMask();
      annostateA.content = [];
      this.Arrays.imageAnnotateShower.push(annostateA);
    }
    const h = document.querySelector('.resultLength');
    if (h) {
      h.innerHTML = resultLength + '';
    }
  }

  // ----删除某个已标定结果标签
  DeleteSomeResultLabel(index: number) {
    this.ReplaceAnnotateMemory();
    this.RecordOperation('delete', '删除标定标签', index, JSON.stringify(this.Arrays.imageAnnotateMemory[index]));
    this.Arrays.imageAnnotateShower.splice(index, 1);
    this.RepaintResultList();
  }

  // ----已标定结果列表交互操作
  ResultListOperation() {
    let _self: any = null;
    _self = this;
    const resultList = this.Nodes.resultGroup.getElementsByClassName('result_list');
    for (let i = 0; i < resultList.length; i++) {
      resultList[i].index = i;
      resultList[i].onmouseover = function() {
        const hoverIndex = resultList[this.index].id;
        _self.DrawSavedAnnotateInfoToShow(hoverIndex);
      };
      resultList[i].onmouseout = function() {
        _self.DrawSavedAnnotateInfoToShow();
      };
      resultList[i].onclick = function(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const pageY = event.pageY - 35;
        switch (target.classList[0]) {
          case 'deleteLabel':
            _self.DeleteSomeResultLabel(i);
            break;
          case 'editLabelName':
            _self.getCreatedLabels(resultList[i], pageY, i);
            break;
          case 'result_Name':
            for (let j = 0; j < resultList.length; j++) {
              resultList[j].classList.remove('active');
            }
            resultList[this.index].classList.add('active');
            _self.Arrays.resultIndex = this.index + 1;
            _self.DrawSavedAnnotateInfoToShow();
            break;
          case 'isShowLabel':
            if (target.classList.value.indexOf('icon-eye-open') > -1) {
              target.className = 'isShowLabel icon-eye-close';
              _self.Arrays.imageAnnotateShower[this.index].labels.visibility = false;
            } else {
              target.className = 'isShowLabel icon-eye-open';
              _self.Arrays.imageAnnotateShower[this.index].labels.visibility = true;
            }
            _self.DrawSavedAnnotateInfoToShow();
            break;
          default:
            break;
        }
      };
    }
  }

  // ----获取已经创建的标签列表
  getCreatedLabels(node: HTMLElement, pageY: number, resultIndex: number) {
    let _self: any = null;
    _self = this;
    const resultSelectLabel = document.querySelector('.resultSelectLabel') as HTMLElement;
    const selectLabelUL = resultSelectLabel.querySelector('.selectLabel-ul') as HTMLElement; // 标签选择UL
    const closeLabel = resultSelectLabel.querySelector('.closeLabelManage') as HTMLElement;
    const selectLabelTip = resultSelectLabel.querySelector('.selectLabelTip') as HTMLElement;
    // 加载标签数据
    selectLabelUL.innerHTML = '';
    const labels = !localStorage.getItem('labels') ? [] : JSON.parse(localStorage.getItem('labels') + '');
    if (labels.length > 0) {
      selectLabelTip.style.display = 'none';
      const fragment = document.createDocumentFragment();
      labels.forEach((item: any, index: number) => {
        const labelLi = document.createElement('li');
        labelLi.innerText = item.labelName;
        labelLi.value = item.labelColor;
        labelLi.setAttribute('data-index', index + '');
        labelLi.setAttribute('data-r', item.labelColorR);
        labelLi.setAttribute('data-g', item.labelColorG);
        labelLi.setAttribute('data-b', item.labelColorB);
        labelLi.style.color = item.labelColor;
        labelLi.style.borderColor = item.labelColor;
        fragment.appendChild(labelLi);
        labelLi.onmouseover = function() {
          labelLi.style.color = '#fff';
          labelLi.style.background = item.labelColor;
        };
        labelLi.onmouseleave = function() {
          labelLi.style.color = item.labelColor;
          labelLi.style.background = 'transparent';
        };
        labelLi.onclick = function() {
          _self.Arrays.imageAnnotateShower[resultIndex].labels.labelName = item.labelName;
          _self.Arrays.imageAnnotateShower[resultIndex].labels.labelColor = item.labelColor;
          _self.Arrays.imageAnnotateShower[resultIndex].labels.labelColorRGB = item.labelColorR + ',' + item.labelColorG + ',' + item.labelColorB;
          resultSelectLabel.classList.remove('focus');
          resultSelectLabel.classList.add('blur');
          _self.Arrays.resultIndex = 0;
          _self.RepaintResultList();
          _self.RecordOperation('modify', '修改标签', resultIndex, JSON.stringify(_self.Arrays.imageAnnotateMemory[resultIndex]));
        };
      });
      selectLabelUL.appendChild(fragment);
    } else {
      selectLabelTip.style.display = 'block';
    }
    // 判断是否显示标签管理
    if (resultSelectLabel.className.indexOf('focus') === -1) {
      resultSelectLabel.classList.remove('blur');
      resultSelectLabel.classList.add('focus');
      resultSelectLabel.style.top = pageY + 'px';
    } else {
      resultSelectLabel.classList.remove('focus');
      resultSelectLabel.classList.add('blur');
    }

    // 关闭标签管理
    closeLabel.onclick = function() {
      resultSelectLabel.classList.remove('focus');
      resultSelectLabel.classList.add('blur');
    };
  }

  // ----标签管理
  ManageLabels() {
    const labelSearch = document.querySelector('.labelSearch-input') as HTMLInputElement; // 标签搜索
    const labelManage = document.querySelector('.labelManage') as HTMLElement; // 标签管理父节点
    const closeLabel = labelManage.querySelector('.closeLabelManage') as HTMLElement; // 关闭标签管理窗口节点
    const labelManegeUL = labelManage.querySelector('.labelManage-ul') as HTMLElement; // 标签管理列表父节点
    const labelManageInfo = labelManage.querySelector('.labelManage-Info') as HTMLElement; // 标签列表模块
    const labelManageCreateInfo = labelManage.querySelector('.labelManage-create') as HTMLElement; // 标签编辑模块
    const addLabel = labelManage.querySelector('.addLabel') as HTMLElement;
    const addLabelName = labelManage.querySelector('.labelCreate-nameInput') as HTMLInputElement;
    const addLabelColor = labelManage.querySelector('#colorHex') as HTMLInputElement;
    const labelManageCreate = labelManage.querySelector('.labelManage-createButton') as HTMLElement; // 添加标签节点
    const closeAdd = labelManage.querySelector('.closeAdd') as HTMLElement; // 取消添加标签
    const removeLabel = labelManage.querySelector('.removeLabel') as HTMLElement; // 删除标签
    const colorPicker = labelManage.querySelector('#colorPicker') as HTMLElement; // 选取颜色模块
    const labelTip = labelManage.querySelector('.labelTip') as HTMLElement; // 标签提示
    const input = document.getElementById('colorHex') as HTMLInputElement;
    const labelManageTitle = document.querySelector('.labelManage-Title') as HTMLElement;
    let flag = false;
    let flagIndex = 0;
    const labels: Array<LabelItem> = !localStorage.getItem('labels') ? [] : JSON.parse(localStorage.getItem('labels') + '');

    function eachLabels(labelList: Array<LabelItem>) {
      // 加载标签数据
      labelTip.style.display = 'none';
      labelManegeUL.innerHTML = '';
      const fragment = document.createDocumentFragment();
      labelList.forEach((item: any, index: number) => {
        const labelLi = document.createElement('li');
        labelLi.innerText = item.labelName;
        labelLi.value = item.labelColor;
        labelLi.setAttribute('data-index', index + '');
        labelLi.setAttribute('data-r', item.labelColorR);
        labelLi.setAttribute('data-g', item.labelColorG);
        labelLi.setAttribute('data-b', item.labelColorB);
        labelLi.style.color = item.labelColor;
        labelLi.style.borderColor = item.labelColor;
        fragment.appendChild(labelLi);

        labelLi.onmouseover = function() {
          labelLi.style.color = '#fff';
          labelLi.style.background = item.labelColor;
        };
        labelLi.onmouseleave = function() {
          labelLi.style.color = item.labelColor;
          labelLi.style.background = 'transparent';
        };
        labelLi.onclick = function() {
          addLabelName.value = item.labelName;
          colorPicker.style.background = item.labelColor;
          input.value = item.labelColor;
          flag = true;
          flagIndex = index;
          labelManageTitle.innerText = '编辑标签';
          labelManageInfo.style.display = 'none';
          labelManageCreateInfo.style.display = 'block';
          removeLabel.style.display = 'block';
        };
      });
      labelManegeUL.appendChild(fragment);
    }
    if (labels.length > 0) {
      eachLabels(labels);
    } else {
      labelTip.style.display = 'block';
    }
    // 添加标签事件
    labelManageCreate.onclick = function() {
      // console.log('labelManageCreate.onclick');
      flag = false;
      labelManageTitle.innerText = '创建标签';
      addLabelName.value = '';
      labelManageInfo.style.display = 'none';
      labelManageCreateInfo.style.display = 'block';
      removeLabel.style.display = 'none';
    };

    closeAdd.onclick = function() {
      labelManageInfo.style.display = 'block';
      labelManageCreateInfo.style.display = 'none';
      eachLabels(labels);
    };

    removeLabel.onclick = function() {
      if (confirm('确定删除 "' + addLabelName.value + '" 标签吗？')) {
        labelManageInfo.style.display = 'block';
        labelManageCreateInfo.style.display = 'none';
        labels.splice(flagIndex, 1);
        localStorage.setItem('labels', JSON.stringify(labels));
        eachLabels(labels);
      }
    };

    colorPicker.onclick = function() {
      const colorDiv = document.querySelector('.colorDiv');
      if (!colorDiv) {
        ColorpickerCreate({
          bindClass: 'colorPicker',
          change: function(elem: HTMLInputElement, hex: string, rgb: any) {
            elem.style.backgroundColor = hex;
            input.value = hex;
            input.setAttribute('data-r', rgb.r);
            input.setAttribute('data-g', rgb.g);
            input.setAttribute('data-b', rgb.b);
          }
        });
        const colorDivA = document.querySelector('.colorDiv') as HTMLDivElement;
        if (colorDivA) {
          colorDivA.style.display = 'block';
        }
      }
    };


    addLabel.onclick = function() {
      if (addLabelName.value) {
        if (flag) {
          labels[flagIndex].labelName = addLabelName.value;
          labels[flagIndex].labelColor = addLabelColor.value;
          labels[flagIndex].labelColorR = addLabelColor.getAttribute('data-r') + '';
          labels[flagIndex].labelColorG = addLabelColor.getAttribute('data-g') + '';
          labels[flagIndex].labelColorB = addLabelColor.getAttribute('data-b') + '';
          localStorage.setItem('labels', JSON.stringify(labels));
          alert('修改成功');
          labelManageInfo.style.display = 'block';
          labelManageCreateInfo.style.display = 'none';
          eachLabels([]);
        } else {
          // const createData = {
          //   'labelName': addLabelName.value,
          //   'labelColor': addLabelColor.value,
          //   'labelColorR': addLabelColor.getAttribute('data-r'),
          //   'labelColorG': addLabelColor.getAttribute('data-g'),
          //   'labelColorB': addLabelColor.getAttribute('data-b')
          // };
          const createData: LabelItem = new LabelItem();
          createData.labelName = addLabelName.value;
          createData.labelColor = addLabelColor.value;
          createData.labelColorR = addLabelColor.getAttribute('data-r') + '';
          createData.labelColorG = addLabelColor.getAttribute('data-g') + '';
          createData.labelColorB = addLabelColor.getAttribute('data-b') + '';

          labels.push(createData);
          localStorage.setItem('labels', JSON.stringify(labels));
          addLabelName.value = '';
          alert('添加成功');
        }

      } else {
        alert('请填写标签名称');
      }

    };

    // 判断是否显示标签管理
    if (labelManage.className.indexOf('focus') === -1) {
      labelManage.classList.remove('blur');
      labelManage.classList.add('focus');
    } else {
      labelManage.classList.remove('focus');
      labelManage.classList.add('blur');
    }

    labelSearch.onchange = function(e: any) {
      const filterLabel = labels.filter(itemss => {
        return itemss.labelName.indexOf(e.currentTarget.value) > -1;
      });
      eachLabels(filterLabel);
    };

    // 关闭标签管理
    closeLabel.onclick = function() {
      labelManage.classList.remove('focus');
      labelManage.classList.add('blur');
    };
  }

  // ----历史记录点击事件
  HistoryClick(e: any) {
    const index = e.target.dataset.index;
    if (index) {
      this.historyIndex = parseInt(index);
      this.RenderHistoryState(this.historyIndex);
    }
  }

  // ----渲染至指定历史记录状态
  RenderHistoryState(index: number) {
    const history = this.Arrays.history;
    const historyNodes = this.Nodes.historyGroup.children;
    let prevIndex = -1;
    for (let i = 0; i < historyNodes.length; i++) {
      if (historyNodes[i].classList.value.indexOf('active') > -1) {
        prevIndex = i;
        break;
      }
    }
    // 移除上一个历史记录列表焦点
    prevIndex !== -1 && historyNodes[prevIndex].classList.remove('active');
    this.Arrays.imageAnnotateMemory.splice(0, this.Arrays.imageAnnotateMemory.length);
    for (let i = history.length - 1; i > index; i--) {
      historyNodes[i].classList.add('record');
    }
    for (let i = 0; i <= index; i++) {
      historyNodes[i].classList.remove('record');
      this.HistoryTypeOperation(history[i].type, history[i].index, history[i].content);
    }
    historyNodes[index].classList.add('active');
    this.ReplaceAnnotateShow();
    this.RepaintResultList();
  }

  // ----历史记录类型判断处理
  HistoryTypeOperation(type: string, index: number, content: string) {
    switch (type) {
      case 'add':
        this.Arrays.imageAnnotateMemory.splice(index, 0, JSON.parse(content));
        break;
      case 'addPoint':
        this.Arrays.imageAnnotateMemory[index] = JSON.parse(content);
        break;
      case 'delete':
        this.Arrays.imageAnnotateMemory.splice(index, 1);
        break;
      default:
        this.Arrays.imageAnnotateMemory[index] = JSON.parse(content);
        break;
    }
  }

  // ----记录每步操作存储在内存中
  RecordOperation(type: string, desc: string, index: number, content: string) {
    // 渲染到页面上
    if (this.historyIndex < this.Arrays.history.length) {
      this.RenderHistory(type, desc, this.historyIndex + 1);
      this.Arrays.history.splice(this.historyIndex + 1, this.Arrays.history.length);
    } else {
      this.RenderHistory(type, desc, this.historyIndex);
      this.Arrays.history.splice(this.historyIndex, this.Arrays.history.length);
    }
    const historyData: OpHistory = new OpHistory();
    historyData.type = type;
    historyData.desc = desc;
    historyData.index = index;
    historyData.content = content;
    // const historyData = {
    //   type: type,
    //   desc: desc,
    //   index: index,
    //   content: content,
    // };
    this.Arrays.history.push(historyData);
    this.historyIndex++;
  }

  // ----将历史记录渲染到页面上
  RenderHistory(type: string, desc: string, index: number) {
    const children = this.Nodes.historyGroup.children;
    children.length > 0 && children[index - 1].classList.remove('active');
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].classList.value.indexOf('record') > -1 && this.Nodes.historyGroup.removeChild(children[i]);
    }
    const history = document.createElement('p');
    history.setAttribute('data-type', type);
    history.setAttribute('data-index', index + '');
    history.innerText = desc;
    history.classList.add('active');
    this.Nodes.historyGroup.appendChild(history);
  }

  // ----控制是否显示标签
  IsShowLabels() {
    const _nodes = this.Nodes;
    const annotates = this.Arrays.imageAnnotateShower;
    const resultList = document.querySelectorAll('.result_list');
    if (resultList.length > 0) {
      if (_nodes.labelShower.className.indexOf('focus') > -1) {
        // 隐藏标注结果
        _nodes.labelShower.children[0].checked = false;
        _nodes.labelShower.classList.remove('focus');
        resultList.forEach((item: any, index: number) => {
          item.childNodes[5].className = 'isShowLabel icon-eye-close';
          annotates[index].labels.visibility = false;
        });
      } else {
        // 显示标注结果
        _nodes.labelShower.children[0].checked = true;
        _nodes.labelShower.classList.add('focus');
        resultList.forEach((item: any, index: number) => {
          item.childNodes[5].className = 'isShowLabel icon-eye-open';
          annotates[index].labels.visibility = true;
        });
      }
    }
    this.DrawSavedAnnotateInfoToShow();
  }

  // ----屏幕快照事件
  ScreenShot() {
    const imgData = this.Nodes.bCanvas.toDataURL('image/jpeg');
    const windowOpen = window.open('about:blank', 'image from canvas');
    if (windowOpen) {
      windowOpen.document.write("<img alt='' src='" + imgData + "'>");
    }
  }

  // ----全屏显示事件
  IsScreenFull() {
    if (this.isFullScreen) {
      // 取消全屏显示事件
      const el: any = document;
      const cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.msCancelFullScreen;
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el);
      } else if (typeof window.ActiveXObject !== 'undefined') {
        // IE 下模拟按下键盘F11事件 取消退出全屏
        const wScript = new window.ActiveXObject('WScript.Shell');
        if (wScript != null) {
          wScript.SendKeys('{F11}');
        }
      }
      this.Nodes.screenFull.childNodes[3].innerText = '全屏';
      this.Nodes.screenFull.childNodes[1].style.backgroundPosition = '0 -480px';
    } else {
      const el: any = document.documentElement;
      const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el);
      } else if (typeof window.ActiveXObject !== 'undefined') {
        // IE 下模拟按下键盘F11事件
        const wScript = new window.ActiveXObject('WScript.Shell');
        if (wScript != null) {
          wScript.SendKeys('{F11}');
        }
      }
      this.Nodes.screenFull.childNodes[3].innerText = '退出全屏';
      this.Nodes.screenFull.childNodes[1].style.backgroundPosition = '5px -480px';
    }
  }

  // ----监听浏览器是否全屏, 并调整尺寸
  ScreenViewChange() {
    const doc: any = document;
    if (doc.webkitIsFullScreen || doc.fullscreen || doc.mozFullScreen || doc.msFullscreenElement) {
      // 全屏后调整节点尺寸
      const sFullHeight = window.screen.height;
      this.Nodes.canvasMain.style.height = sFullHeight - 60 + 'px';
      this.Nodes.canvas.height = this.Nodes.canvasMain.offsetHeight;
      this.cHeight = this.Nodes.canvasMain.offsetHeight;
      this.UpdateCanvas();
      this.isFullScreen = true;
    } else {
      // 取消全屏后调整节点尺寸
      const sNormalHeight = window.innerHeight;
      this.Nodes.canvasMain.style.height = sNormalHeight - 60 + 'px';
      this.Nodes.canvas.height = this.Nodes.canvasMain.offsetHeight;
      this.cHeight = this.Nodes.canvasMain.offsetHeight;
      this.UpdateCanvas();
      this.isFullScreen = false;
    }
  }

  // ----缩略图画布点击定位函数
  ScaleCanvasClick(e: any) {
    const p = this.CalculateChange(e, this.Nodes.scaleCanvas);
    const tmpX = this.cWidth / 2 - this.iWidth * this.scale * p.x / this.sWidth;
    const tmpY = this.cHeight / 2 - this.iWidth * this.scale * p.x / this.sWidth * p.y / p.x;
    this.SetXY(tmpX, tmpY);
    this.ReplaceAnnotateShow();
  }

  // ----滚动条缩放事件
  MouseWheel(e: any) {
    const wd = e.wheelDelta || e.detail;
    let newScale = this.scale * (1 + (wd > 0 ? this.scaleStep : -this.scaleStep));
    newScale = newScale < this.minScale ? this.minScale : newScale;
    newScale = newScale > this.maxScale ? this.maxScale : newScale;

    if (newScale !== this.scale) {
      const p = this.CalculateChange(e, this.Nodes.canvas);
      const newX = (this.x - p.x) * newScale / this.scale + p.x;
      const newY = (this.y - p.y) * newScale / this.scale + p.y;
      this.scale = newScale;
      this.SetXY(newX, newY);
    }
    window.clearTimeout(this.mousewheelTimer);
    this.mousewheelTimer = setTimeout(() => {
      this.IsMouseWheelEnd();
    }, 500);
    if (this.drawFlag) {
      this.DrawSavedAnnotateInfoToMemory(true);
      this.drawFlag = false;
    }
  }
  // ----监听滚动条缩放是否结束
  IsMouseWheelEnd() {
    this.ReplaceAnnotateShow();
    this.DrawSavedAnnotateInfoToMemory(false);
    this.drawFlag = true;
  }

  // ----设置图片位置，防止图片被拖出画布
  SetXY(vx: number, vy: number) {
    if (vx < this.appearSize - this.iWidth * this.scale) {
      this.x = this.appearSize - this.iWidth * this.scale;
    } else if (vx > this.cWidth - this.appearSize) {
      this.x = this.cWidth - this.appearSize;
    } else {
      this.x = vx;
    }

    if (vy < this.appearSize - this.iHeight * this.scale) {
      this.y = this.appearSize - this.iHeight * this.scale;
    } else if (vy > this.cHeight - this.appearSize) {
      this.y = this.cHeight - this.appearSize;
    } else {
      this.y = vy;
    }
    this.UpdateCanvas();
  }

  // ----Y坐标点装换， 防止绘制到图片外
  YPointReplace(y: number) {
    if (y < this.y) {
      y = this.y;
    } else if (y > this.iHeight * this.scale + this.y) {
      y = this.iHeight * this.scale + this.y;
    }
    return y;
  }
  // ----X坐标点装换， 防止绘制到图片外
  XPointReplace(x: number) {
    if (x < this.x) {
      x = this.x;
    } else if (x > this.iWidth * this.scale + this.x) {
      x = this.iWidth * this.scale + this.x;
    }
    return x;
  }

  // ----获取更新鼠标在当前展示画板中的位置
  GetMouseInCanvasLocation(e: any) {
    this.mouseX = this.XPointReplace(e.layerX || e.offsetX);
    this.mouseY = this.YPointReplace(e.layerY || e.offsetY);
  }

  // ----获取鼠标当前相对所在存储面板图片中的位置
  GetMouseInImageLocation(location: any) {
    const prevP = this.CalculateChange(location, this.Nodes.canvas);
    // 鼠标点击在当前图像的位置
    this.ix = Math.floor((prevP.x - this.x) / this.scale);
    if (this.ix < 0) {
      this.ix = 0;
    } else if (this.ix > this.iWidth) {
      this.ix = this.iWidth;
    }
    this.iy = Math.floor((prevP.y - this.y) / this.scale);
    if (this.iy < 0) {
      this.iy = 0;
    } else if (this.iy > this.iHeight) {
      this.iy = this.iHeight;
    }
  }

  // ----计算更新鼠标相对容器的位置
  CalculateChange(e: any, container: any, skip = false) {
    !skip && e.preventDefault();
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
    let left = x - (container.getBoundingClientRect().left + window.pageXOffset);
    let top = y - (container.getBoundingClientRect().top + window.pageYOffset);

    if (left < 0) {
      left = 0;
    } else if (left > containerWidth) {
      left = containerWidth;
    }

    if (top < 0) {
      top = 0;
    } else if (top > containerHeight) {
      top = containerHeight;
    }

    return {
      x: left,
      y: top
    };
  }

  // ----计算标签相对于当前标定范围的位置
  ComputerLabelLocation(rectMask: any): Point {
    const p: Point = new Point(
      rectMask.width / 2 + rectMask.xMin,
      rectMask.height / 2 + rectMask.yMin
    );
    return p;
  }

  // ----按缩放程度修改数据存储面板数据
  ReplaceAnnotateMemory() {
    this.Arrays.imageAnnotateMemory.splice(0, this.Arrays.imageAnnotateMemory.length);
    this.Arrays.imageAnnotateShower.map((item) => {

      const content: Array<Point> = [];
      item.content.forEach(contents => {
        const p = new Point(
          (contents.x - this.x) / this.scale,
          (contents.y - this.y) / this.scale
        );
        // p.x =  ;
        // p.y =  ;
        content.push(p);
      });

      const mask = new RectMask();

      mask.xMin = (item.rectMask.xMin - this.x) / this.scale;
      mask.yMin = (item.rectMask.yMin - this.y) / this.scale;
      mask.width = item.rectMask.width / this.scale;
      mask.height = item.rectMask.height / this.scale;

      const anno: Annotate = new Annotate();
      anno.content = content;
      anno.rectMask = mask;
      anno.labels = item.labels;
      anno.labelLocation = this.ComputerLabelLocation(mask);
      anno.contentType = item.contentType;

      this.Arrays.imageAnnotateMemory.push(anno);
    });
  }
  // ----按缩放程度修改数据展示面板数据
  ReplaceAnnotateShow() {
    this.Arrays.imageAnnotateShower.splice(0, this.Arrays.imageAnnotateShower.length);
    this.Arrays.imageAnnotateMemory.map((item) => {
      // console.log(index + 12);
      const content: Array<Point> = [];
      item.content.forEach(contents => {
        const p = new Point(
          contents.x * this.scale + this.x,
          contents.y * this.scale + this.y
        );

        content.push(p);
        // content.push({
        //   'x': contents.x * this.scale + this.x,
        //   'y': contents.y * this.scale + this.y,
        // });
      });


      // const rectMask = {
      //   'xMin': item.rectMask.xMin * this.scale + this.x,
      //   'yMin': item.rectMask.yMin * this.scale + this.y,
      //   'width': item.rectMask.width * this.scale,
      //   'height': item.rectMask.height * this.scale,
      // };
      // this.Arrays.imageAnnotateShower.push({
      //   content,
      //   rectMask,
      //   labels: item.labels,
      //   labelLocation: this.ComputerLabelLocation(rectMask),
      //   contentType: item.contentType
      // });

      const mask = new RectMask();

      mask.xMin = item.rectMask.xMin * this.scale + this.x;
      mask.yMin = item.rectMask.yMin * this.scale + this.y;
      mask.width = item.rectMask.width * this.scale;
      mask.height = item.rectMask.height * this.scale;

      const anno: Annotate = new Annotate();
      anno.content = content;
      anno.rectMask = mask;
      anno.labels = item.labels;
      anno.labelLocation = this.ComputerLabelLocation(mask);
      anno.contentType = item.contentType;

      this.Arrays.imageAnnotateShower.push(anno);
    });
  }

  /*
      画板禁止触发右键菜单事件
   */
  static NoRightMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
