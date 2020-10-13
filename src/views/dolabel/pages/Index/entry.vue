<template>

<a-row style="height:100%;">
<!-- <meta charset="UTF-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge"> -->


<!-- <div id='preloader'>
    <div class='loader' hidden>
        <img src='./images/loader.gif' alt>
    </div>
</div> -->

 <a-modal v-model="visibleSelectDatasetModal" title="请选择数据集" @ok="StartDoLabel">
      <div><b>第一步:请选择数据集</b></div>
      <a-select @change="GetLabels" style="width:90%;">
        <a-select-option v-for="dset in DataSets" :key="dset.name">
          {{ dset.name }}
        </a-select-option>
      </a-select>

      <div><b>第二步:选择要标注的子分类文件夹</b></div>
      <a-select
          show-search
          placeholder="请选择一个要标注的子分类文件夹"
          option-filter-prop="children"
          style="width: 90%;"
          :filter-option="filterLabelsOption"
          @focus="handleLabelsSelectFocus"
          @blur="handleLabelsSelectBlur"
          @change="handleLabelsSelectChange"
        >
        <a-select-option v-for="labelitem in LabelSets" :key="labelitem.LabelSetName">
          {{ labelitem.LabelSetName }}
        </a-select-option>
      </a-select>
 </a-modal>

<div class="LabelImage">


    <div class="canvasMain">
        <!--标注功能工具集-->
        <div class="toolFeatures">
            <div class="assistFeatures">
              <p class="openFolder" title="打开文件夹" @click="openFolder_click"></p>
              <input class="openFolderInput" type="file" multiple onchange="changeFolder(this)" hidden>
                <!-- <p class="saveJson" title="生成Json并保存到本地" @click="btnsaveJson_click"></p> -->
            </div>
            <!-- <div class="separator"></div> -->
            <div id="tools" >
                <div class="toolSet toolDrag focus" @click="tools_toolDrag" title="图片拖拽"></div>
                <div class="toolSet toolTagsManager" @click="tools_toolTagsManager" ><span class="icon-tags"></span></div>
                <div class="toolSet toolRect" @click="tools_toolRect" title="矩形工具"></div>
                <div class="toolSet toolPolygon" @click="tools_toolPolygon" title="多边形工具"></div>
            </div>
            <div class="version">v1.0.0</div>
<!--            <div class="dragIcons">-->
<!--                <p></p>-->
<!--                <p></p>-->
<!--                <p></p>-->
<!--            </div>-->
        </div>
        <div class="canvasContent">
            <canvas id="canvas"></canvas>
            <div class="scaleBox">
                <div class="scaleCanvas"></div>
                <div class="scalePanel"></div>
            </div>
        </div>
        <div class="commentResult">
            <div class="resultArea">
                <p class="title">标注结果 (<span class="resultLength">0</span>)</p>
                <div class="resultList_head">
                    <div class="headChildren">
                        <p class="headName">名称</p>
                        <p class="headEdit">修改</p>
                        <p class="headDelete">删除</p>
                        <p class="headDisplay">显/隐</p>
                    </div>
                </div>
                <div class="resultGroup">
                </div>
                <!--    选择标签操作    -->
                <div class="resultSelectLabel">
                    <p class="selectLabelTip" hidden>请先创建标签</p>
                    <ul class="selectLabel-ul">
                    </ul>
                    <div class="closeLabelManage"><span class="icon-remove-sign"></span></div>
                </div>
            </div>
            <div class="historyContent">
                <p class="title">历史记录</p>
                <div class="historyGroup">
                </div>
            </div>
            <div class="tabBtn focus"><span class="icon-double-angle-right"></span></div>
        </div>

        <!--  标签管理  -->
        <div class="labelManage">
            <div class="labelManage-Info">
                <div class="labelManage-menu">
                    <div class="labelManage-search"><input type="text" class="labelSearch-input" placeholder="按回车搜索"/></div>
                    <div class="labelManage-createLabel"><button class="button btn-primary labelManage-createButton">创建</button></div>
                </div>
                <div class="labelManage-subList">标签列表：</div>
                <div class="labelManage-group">
                    <p class="labelTip" hidden>请先创建标签</p>
                    <ul class="labelManage-ul">
                    </ul>
                </div>
            </div >
            <div class="labelManage-create" hidden>
                <div class="labelManage-Title">创建标签</div>
                <div class="labelCreate labelCreate-name">
                    <label>标签名称：</label>
                    <input type="text" class="labelCreate-nameInput">
                </div>
                <div class="labelCreate labelCreate-color">
                    <label>标签颜色：</label>
                    <span class="colorPicker" id="colorPicker"></span>
                    <input class="colorHex" id="colorHex" value="#ff0000" data-r="255" data-g="0" data-b="0" readonly>
                </div>
                <div class="labelCreate">
                    <button class="button btn-error removeLabel" title="删除标签">删除</button>
                </div>
                <div class="labelCreateButtons">
                    <button class="button btn-success addLabel">确定</button>
                    <button class="button btn-default closeAdd">取消</button>
                </div>
            </div>
            <div class="closeLabelManage"><span class="icon-remove-sign"></span></div>
        </div>
    </div>
    <div class="toolHead">
        <div class="toolMuster">
            <div class="logoGroup">
               <!-- <div class="logoTitle">切换数据集或文件夹</div> -->
                <!-- <div class="logo"></div>-->
                <!-- <div class="logoTitle"></div> -->
            </div>
            <div class="selectOperation">
                <div class="pageControl">
                    <div class="pagePrev pageSwitch inline-block" title="上一张" @click="prevBtn_onclick"></div>
                    <div class="pageInfo inline-block">
                        <p class="pageName" title="图片名称">{{taskName}}</p>
                        <p class="nameProcess" title="图片位置"><span class="processIndex">{{processIndex}}</span> / <span class="processSum">{{processSum}}</span></p>
                    </div>
                    <div class="pageNext pageSwitch inline-block" title="下一张"  @click="nextBtn_onclick"></div>
                </div>
            </div>
            <div class="assistTool">
                <div class="generalFeatures">

                    <p class="featureList crossLine" title="十字线开关">
                        <input class="mui-switch mui-switch-anim" type="checkbox">
                        <span>十字线</span>
                    </p>
                    <p class="featureList labelShower focus" title="标注结果显示开关">
                        <input class="mui-switch mui-switch-anim" type="checkbox">
                        <span>标注结果</span>
                    </p>
                    <p class="featureList screenShot" title="标注内容截图">
                        <i class="bg"></i>
                        <span>快照</span>
                    </p>
                    <p class="featureList screenFull" title="全屏开关">
                        <i class="bg"></i>
                        <span>全屏</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="mask_box" hidden></div>
    <div class="loading_box" hidden id="loading">
        <div class="loaderSpinner">
            <span class="icon-spinner"></span>
        </div>
        <b class="closes"></b>
    </div>

</div>

<!-- <script src="@/js/preloader.js.oldjs"></script>
<script src="@/js/colorPicker.js.oldjs"></script>
<script src="@/js/webAnnotate.js.oldjs"></script>
<script src="@/js/operator.js.oldjs"></script> -->

</a-row>
</template>
<script lang="ts">

import Vue from 'vue';
// import preloader from './js/preloader';
import LabelImage from './js/webAnnotate';
import box from './js/openbox';



// 初始化交互操作节点
// changeFolder()
let annotate: LabelImage;

export default Vue.extend({
  data() {
    return {
      visibleSelectDatasetModal: true,
      CurrentDatasetName: '当前标注的数据集名称',
      CurrentDatasetLabelFolder: '当前标注的数据集子文件夹名称',
      DataSets: [],
      LabelSets: [],
      taskName: '标注任务名称',
      processIndex: 0,
      processSum: 0,
      imgIndex: 1, // 标定图片默认下标;
      imgSum: 10, // 选择图片总数;
      imgFiles: [
        'https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9QbjRTbTBSc0F1aEFZNGpOOEtTa1pJV3dpY1pkWUZ6Y0lWdHRLaWJPYUQzdWFSRkdUYllwaWIxTFEzWWtTT0dma2ZLR3IzaWJzc0lYT0N4TWxNYURrS1N1YWcvNjQw?x-oss-process=image/format,png',
        '/static/dataset/厨余垃圾/艾草/艾草_0.jpg',
        '/static/dataset/厨余垃圾/艾草/艾草_1.jpg',
        '/static/dataset/厨余垃圾/艾草/艾草_2.jpg',
      ] // 选择上传的文件数据集
    };
  },

  mounted() {
    this.LoadDatasets();
    this.visibleSelectDatasetModal = true;
  },

  methods: {
    handleLabelsSelectChange(value: string) {
      this.CurrentDatasetLabelFolder = value;
      // console.log(`selected ${value}`);
    },
    handleLabelsSelectBlur() {
      console.log('blur');
    },
    handleLabelsSelectFocus() {
      console.log('focus');
    },
    filterLabelsOption(input: string, option: any) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    // 执行查询
    GetLabels(value: string) {
      this.CurrentDatasetName = value;
      this.$post({
        url: '/DatasetManage/GetLabels',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.CurrentDatasetName }
      })
        .then((res: any) => {
          console.log(res);
          if (res.success) {
            this.LabelSets = res.data;
          } else {
            this.$message.info(res.message);
          }
        });

    },
    // 加载数据集
    LoadDatasets() {
      this.$post({
        url: '/DatasetManage/LoadDatasets',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((res: any) => {
          if (res.success) {
            this.DataSets = res.data;
          } else {
            this.$message.info(res.message);
          }
        });
    },

    StartDoLabel() {
      // 已经初始化完毕这两个.
      // this.CurrentDatasetName
      // this.CurrentDatasetLabelFolder
      // 加载所有的图片, 然后开始标注
      this.$post({
        url: '/DatasetManage/GetImages',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.CurrentDatasetName, 'pageindex': 1, 'pagesize': 30000, 'LabelSetName': this.CurrentDatasetLabelFolder }
      })
        .then((res: any) => {
          if (res.success) {
            this.imgFiles = res.data;
            console.log(this.imgFiles);
            this.initCanvas();
            this.loadTags();
            this.initImage();
          } else {
            this.$message.info(res.message);
          }
        });
      this.visibleSelectDatasetModal = false;
    },

    initCanvas() {
      if (annotate) {
        return; // 如果已经初始化过的不再初始化.
      }
      this.$message.info('快捷键(A)上一张,(D)下一张,(S)保存,(空格)继续绘制');
      // 设置画布初始属性
      // const canvasMain = document.querySelector('.canvasMain') as HTMLDivElement;
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      // const resultGroup = document.querySelector('.resultGroup') as HTMLDivElement;
      document.addEventListener('keyup', this.ShortcutKey); // 绑定快捷键
      // debugger;
      // 设置画布宽高背景色
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      canvas.style.background = '#8c919c';
      annotate = new LabelImage({
        canvas: canvas,
        scaleCanvas: document.querySelector('.scaleCanvas') as HTMLDivElement,
        scalePanel: document.querySelector('.scalePanel') as HTMLDivElement,
        annotateState: document.querySelector('.annotateState') as HTMLDivElement,
        canvasMain: document.querySelector('.canvasMain') as HTMLDivElement,
        resultGroup: document.querySelector('.resultGroup') as HTMLDivElement,
        crossLine: document.querySelector('.crossLine') as HTMLPreElement,
        labelShower: document.querySelector('.labelShower') as HTMLPreElement,
        screenShot: document.querySelector('.screenShot') as HTMLPreElement,
        screenFull: document.querySelector('.screenFull') as HTMLPreElement,
        colorHex: document.querySelector('#colorHex') as HTMLInputElement,
        toolTagsManager: document.querySelector('.toolTagsManager') as HTMLDivElement,
        historyGroup: document.querySelector('.historyGroup') as HTMLDivElement
      });
    },
    loadTags() {
      this.$post({
        url: '/DatasetManage/GetTags',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.CurrentDatasetName, 'pageindex': 1, 'pagesize': 30000, 'LabelSetName': this.CurrentDatasetLabelFolder }
      })
        .then((res: any) => {
          if (res.success) {
            const Tags = res.data.replace('\r\n', '\n').split('\n');
            console.log(Tags);
            annotate.SetTags(Tags);
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 切换数据集或文件夹
    changeFolder(e: any) {
      this.imgFiles = e.files;
      this.imgSum = this.imgFiles.length;
      this.processSum = this.imgSum;
      this.imgIndex = 1;
      this.selectImage(0);
    },

    // 快捷键
    ShortcutKey(e: KeyboardEvent) {
      console.log(e);
      // 空格键 继续执行刚才的标注
      if (e.key === ' ') {
        e.preventDefault();
        // alert('空格');
        annotate.SetFeatures(this.currentFeatures, true);
      }
      // D键 下一张
      if (e.key === 'd') {
        e.preventDefault();
        // alert('D');
        this.nextBtn_onclick();
      }
      // A键 上一张
      if (e.key === 'a') {
        e.preventDefault();
        // alert('A');
        this.prevBtn_onclick();
      }
      // 保存键 保存键
      if (e.key === 's') {
        e.preventDefault();
        // alert('S ');
        this.SaveImageTags(this.taskName, annotate.Arrays.imageAnnotateMemory, function(this: any) { });

      }
    },
    // <div class="toolSet toolDrag focus" @click="tools_toolDrag" title="图片拖拽"></div>
    // <div class="toolSet toolTagsManager" @click="tools_toolTagsManager" ><span class="icon-tags"></span></div>
    // <div class="toolSet toolRect" @click="tools_toolRect" title="矩形工具"></div>
    // <div class="toolSet toolPolygon" @click="tools_toolPolygon" title="多边形工具"></div>
    toggleTools(targetel: HTMLDivElement) {
      const tools = document.getElementsByClassName('toolSet') as HTMLCollectionOf<HTMLDivElement>;
      for (let i = 0; i < tools.length; i++) {
        tools[i].classList.remove('focus');
      }
      targetel.classList.add('focus');
    },
    // 图片拖拽
    tools_toolDrag(e: MouseEvent) {
      this.currentFeatures = 'dragOn';
      this.toggleTools(e.target as HTMLDivElement);
      annotate.SetFeatures('dragOn', true);
    },
    // 标签管理工具
    tools_toolTagsManager(e: any) {
      this.currentFeatures = 'tagsOn';
      this.toggleTools(e.target as HTMLDivElement);
      annotate.SetFeatures('tagsOn', true);
    },
    // 矩形
    tools_toolRect(e: any) {
      this.currentFeatures = 'rectOn';
      this.toggleTools(e.target as HTMLDivElement);
      annotate.SetFeatures('rectOn', true);
    },
    // 多边形
    tools_toolPolygon(e: any) {
      this.currentFeatures = 'polygonOn';
      this.toggleTools(e.target as HTMLDivElement);
      annotate.SetFeatures('polygonOn', true);
    },

    openFolder_click() {
      this.visibleSelectDatasetModal = true;
      // const openFolderInput = document.querySelector('.openFolderInput') as HTMLInputElement;
      // if (openFolderInput) {
      //   openFolderInput.click();
      //   alert('openFolderInput click');
      // }
    },
    // 加载某张图片的标签
    GetImageTags(imageFileName: string, callbak: Function) {
      this.$post({
        url: '/DatasetManage/GetImageTags',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: {
          'DatasetName': this.CurrentDatasetName,
          'LabelSetName': this.CurrentDatasetLabelFolder,
          'ImageFileName': imageFileName
        }
      })
        .then((res: any) => {
          if (res.success) {
            if (res.data === '') {
              res.data = '[]';
            }
            if (callbak) {
              callbak.call(this, JSON.parse(res.data));
            }
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 保存某张图片的标签
    SaveImageTags(imageFileName: string, tags: any, callbak: Function) {

      // {
      //   url: '/DatasetManage/SaveImageTags',
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/json;charset=UTF-8'
      //   },
      //   params: {
      //     'DatasetName': this.CurrentDatasetName,
      //     'LabelSetName': this.CurrentDatasetLabelFolder,
      //     'ImageFileName': imageFileName,
      //     'Tags': JSON.stringify(tags)
      //   }
      // }
      // post 模式就安全稳定的很多.
      const params = new FormData();
      params.append('DatasetName', this.CurrentDatasetName);
      params.append('LabelSetName', this.CurrentDatasetLabelFolder);
      params.append('ImageFileName', imageFileName);
      params.append('Tags', JSON.stringify(tags));
      this.$post.post('/DatasetManage/SaveImageTags', params)
        .then((res: any) => {
          if (res.success) {
            this.$message.info('保存成功');
            // this.imgFiles = res.data;
            if (callbak) {
              callbak.call(this);
            }
          } else {
            this.$message.info(res.message);
          }
        });
    },
    btnsaveJson_click() {
      const filename = this.taskName.split('.')[0] + '.json';
      annotate.Arrays.imageAnnotateMemory.length > 0 ? this.saveJson(annotate.Arrays.imageAnnotateMemory, filename) : alert('当前图片未有有效的标定数据');
    },
    selectImage(index: number) {
      box.openBox('#loading', true);
      // processIndex.innerText = this.imgIndex + '';
      this.processIndex = this.imgIndex;
      // taskName.innerText = imgFiles[index].name || imgFiles[index].split('/')[3];
      const img = this.imgFiles[index] as any;
      this.taskName = img.imagefile;
      const httpurl = img.httpurl;

      // const content = localStorage.getItem(this.taskName);// 加载标签
      // const img = imgFiles[index].name ? window.URL.createObjectURL(imgFiles[index]) : imgFiles[index];
      // content ? annotate.SetImage(httpurl, JSON.parse(content)) : annotate.SetImage(httpurl);
      this.GetImageTags(this.taskName, function(this: any, tags: any) {
        annotate.SetImage(httpurl, tags);
      });
    },
    // 获取下一张图片
    nextBtn_onclick() {
      // annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(this.taskName, JSON.stringify(annotate.Arrays.imageAnnotateMemory)); // 保存已标定的图片信息
      this.SaveImageTags(this.taskName, annotate.Arrays.imageAnnotateMemory, function(this: any) {
        if (this.imgIndex >= this.imgSum) {
          this.imgIndex = 1;
          this.selectImage(0);
        } else {
          this.imgIndex++;
          this.selectImage(this.imgIndex - 1);
        }
      });
    },

    // 获取上一张图片
    prevBtn_onclick() {
      // annotate.Arrays.imageAnnotateMemory.length > 0 && localStorage.setItem(this.taskName, JSON.stringify(annotate.Arrays.imageAnnotateMemory)); // 保存已标定的图片信息
      this.SaveImageTags(this.taskName, annotate.Arrays.imageAnnotateMemory, function(this: any) {
        if (this.imgIndex === 1) {
          this.imgIndex = this.imgSum;
          this.selectImage(this.imgSum - 1);
        } else {
          this.imgIndex--;
          this.selectImage(this.imgIndex - 1);
        }
      });
    },


    // 初始化图片状态
    initImage() {
      this.selectImage(0);
      this.processSum = this.imgSum;
    },
    saveJson(data: any, filename: string) {
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
  }

});
</script>
<style>
@import './css/preloader.css';
@import './css/style.css';
@import './css/font-awesome.min.css';
@import './css/switch.css';

</style>
