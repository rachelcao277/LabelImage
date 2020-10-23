<template>
<div>

  <a-modal v-model="visiblCreatNewTrainTaskModal" title="新建训练任务" @ok="CreatNewTrainTask" width="800px">
    <a-form  :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }"  >
      <a-tabs default-active-key="1" >
        <a-tab-pane key="1" tab="训练参数">
             <a-form-item label="选择预训练模型" help="预训练模型(初始权重文件)可减少初级网络的重复的训练,不指定时请留空">
              <a-select
                v-model="trainParam.weights"
                :default-active-first-option="false"
                :show-arrow="true"
                :filter-option="true"
                :not-found-content="null"
                >
                    <template  v-for="dset in ModelList">
                      <a-select-option :key="dset" :value="dset">
                        {{ dset }}
                      </a-select-option>
                    </template>
              </a-select>
            </a-form-item>

            <a-form-item label="数据集" >
              <!-- <a-select >
                <a-select-option value="male">厨余垃圾</a-select-option>
                <a-select-option value="female">非厨余垃圾</a-select-option>
              </a-select> -->
              <a-select
                v-model="trainParam.data"
                :default-active-first-option="true"
                :show-arrow="true"
                :filter-option="true"
                :not-found-content="null"
                >
                    <template  v-for="dset in DataSets">
                      <a-select-option :key="dset.value" :value="dset.name">
                        {{ dset.name }}
                      </a-select-option>
                    </template>
              </a-select>
            </a-form-item>

            <a-form-item label="图形尺寸" help="训练和测试数据集的图片归一化后的尺寸">
              <a-input-group compact>
                <a-input style="width: 20%"  v-model="trainParam.img_size[0]" default-value="640"  />
                <a-input style="width: 20%"  v-model="trainParam.img_size[1]" default-value="640"  />
              </a-input-group>
            </a-form-item>

            <a-form-item label="使用GPU" help="">
              <a-select  v-model="trainParam.device" default-value="0">
                <a-select-option value="cpu">cpu</a-select-option>
                <a-select-option value="0">GPU 0</a-select-option>
                <a-select-option value="1">GPU 1</a-select-option>
                <a-select-option value="2">GPU 2</a-select-option>
                <a-select-option value="3">GPU 3</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="训练轮数(Epoch)"  help="一般300轮左右">
              <a-input-number v-model="trainParam.epochs" :min="1" :max="50" :step="1" v-decorator="['Epoch', { rules: [{ required: true, message: '迭代轮数(Epoch)!' }] }]" default-value="50" />
            </a-form-item>

            <a-form-item label="模型保存间隔" help="训练多少轮进行一次保存模型的操作,建议为1 每轮都保存." >
              <a-input-number  v-model="trainParam.AutoSaveEpochs" v-decorator="['SaveEpoch', { rules: [{ required: true, message: '模型保存间隔' }] }]"  default-value="1"/>
            </a-form-item>

            <a-form-item label="批大小(Batch Size)" help="一次喂多少数据, 批越大学习的越快,但是太大往往会导致内存溢出,所以一般是16上下" >
              <a-input-number v-model="trainParam.batch_size"  :min="5" :max="50" :step="1" v-decorator="['BatchSize', { rules: [{ required: true, message: '批大小(Batch Size)' }] }]"  default-value="10"/>
            </a-form-item>

        </a-tab-pane>
        <a-tab-pane key="2" tab="超参数">
          <a-form-item label="学习率" help="学习率(Learning Rate), 0-1之间,越大学习的越快, 但是有可能会导致超出范围">
            <a-input-number v-model="hyp.lr0" :min="0" :max="1" :step="0.01" default-value="0.01"/>
          </a-form-item>
          <a-form-item label="最终一个周期学习率" help="训练到最后一个周期时学习率 乘以 本数字,可提高网络精度. 一般为0.2 ">
            <a-input-number  v-model="hyp.lrf" :min="0" :max="1" :step="0.01"  default-value="0.2"/>
          </a-form-item>

          <a-form-item label="WarmUp步数" help="训练在到达Warm up步数前逐步增大学习率">
            <a-input-number v-model="hyp.warmup_epochs"  default-value="3"/>
          </a-form-item>

          <a-form-item label="动量" help="梯度下降法/ Adam 动量下降法 ">
            <a-input-number v-model="hyp.momentum"  default-value="0.937"/>
          </a-form-item>

  <!-- <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            开始训练
          </a-button>
        </a-form-item> -->
        </a-tab-pane>
      </a-tabs>
    </a-form>

  </a-modal>


 <a-card>
    <a-row type="flex" justify="end" style="width:98%;text-align:left;backgroud-color:#282a31; margin-left:1%; margin-right:1%; margin-top:15px;">
      <a-col :span="14">
        <a-icon type="dashboard" />训练AI模型
      </a-col>
      <a-col :span="10">
        <a-button-group >
          <!-- <a-button type="success" > <a-icon type="plus-circle" />新建训练</a-button> -->
          <a-button :disabled="this.StartButtonEnable == false" @click="visiblCreatNewTrainTaskModal=true" type="primary" > <a-icon type="play-circle" />开始训练</a-button>
          <a-button :disabled="this.StartButtonEnable == true"  @click="StopTrain()" type="primary"> <a-icon type="pause-circle" />停止训练</a-button>
          <!-- <a-button> <a-icon type="file-text" />训练日志</a-button> -->
          <!-- <a-button> <a-icon type="area-chart" />TensorBoard</a-button> -->
          <!-- <a-button> <a-icon type="radar-chart" />查看模型</a-button> -->
        </a-button-group>
        </a-col>
    </a-row>
   <a-card-grid style="width:20%;text-align:left; margin-left:1%;margin-right:1%; margin-top:15px;">
      <div style="height:300px;">
        <div><b><a-icon type="setting" /> 训练信息</b></div>
        <div title="初始权重(weights)"> 初始模型: <span class="param">{{trainParam.weights}}</span></div>
        <div title="数据集(dataset)"> 数据集: <span class="param">{{trainParam.data}}</span></div>
        <div title="批大小(BATCH SIZE)"> 批大小: <span class="param">{{trainParam.batch_size}}</span></div>
        <div title="图像大小(IMAGE SIZE)"> 图像大小: <span class="param">{{trainParam.img_size[0]}} * {{trainParam.img_size[1]}} </span></div>
        <div title="计算设备(device)"> 计算设备: <span class="param">{{trainParam.device}} </span></div>

        <div style="margin-top:15px;"><b><a-icon type="setting" /> 超参数</b></div>
        <div title="初始学习率(lr0)"> 初始学习率: <span class="param">{{hyp.lr0}}</span> </div>
        <div title="lrf最后周期学习率 (lr0*lrf) 有助于提高网络精度"> 最后周期学习率: <span class="param">{{hyp.lrf}}</span></div>
        <div title="动量(momentum)"> 动量: <span class="param">{{hyp.momentum}}</span> </div>
        <div title="重量衰减(weight_decay)"> 重量衰减: <span class="param">{{hyp.weight_decay}}</span> </div>
        <div> iou培训阈值: <span class="param">{{hyp.iou_t}}</span> </div>
      </div>
    </a-card-grid>
    <a-card-grid  id="jindu" style="width:46%;text-align:center;backgroud-color:#282a31; margin-left:1%; margin-right:1%; margin-top:15px;">
    </a-card-grid>
    <a-card-grid id="LossViewEL" style="width:29%;text-align:center;backgroud-color:#282a31; margin-top:15px;">
    </a-card-grid>

    <a-card-grid style="width:98%;text-align:left;margin-left:1%; margin-right:1%; margin-top:15px;">
        <pre style="height:250px;margin-bottom:15px; overflower:auto;" >{{this.LogInfo}}</pre>
    </a-card-grid>

  </a-card>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Chart } from '@antv/g2';

export default Vue.extend({
  data() {
    return {
      current_epoch: 100,
      epochsbili: 0.5, // 进度比例 50%
      visiblCreatNewTrainTaskModal: false,
      DataSets: [], // 数据集
      LossArray: [], // 损失函数指标数据.
      ModelList: [],
      OutAIModelName: '',
      LogInfo: '',
      ImageFileCount: 0, //  需要训练的样本图片个数
      TaskState: '已停止',
      DisabledStartButton: false,
      CurrentEpoch: 0,
      // currentEpochLossData: {}, // 当前的损失函数指标数据
      epoch: 0,
      epochs: 0,
      // 训练参数
      trainParam: {
        weights: '', // default='./runs/exp11/weights/best.pt', help='initial weights path')
        cfg: './yolov5/models/yolov5m.yaml', // help='model.yaml path')
        data: '', // help='data.yaml path')#
        hyp: './yolov5/data/hyp.scratch.yaml', // help='hyperparameters path')
        epochs: 300,
        AutoSaveEpochs: 1, // 模型保存间隔 自动保存轮数
        batch_size: 10, // help='total batch size for all GPUs')#
        img_size: [640, 640], // help='[train, test] image sizes')
        rect: '', // help='rectangular training')
        resume: false, // help='resume most recent training') resume 应该是恢复训练，加上的话是用最近一次的权重开始训练
        nosave: false, // help='only save final checkpoint')
        notest: true, // help='only test final epoch')
        noautoanchor: true, // help='disable autoanchor check')
        evolve: false, // help='evolve hyperparameters') 进化超参数（hyp），可以试试
        bucket: '', // help='gsutil bucket')
        cache_images: true, // help='cache images for faster training')
        image_weights: true, // help='use weighted image selection for training')
        name: '', // help='renames results.txt to results_name.txt if supplied')
        device: 'cpu', // help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
        multi_scale: true, // help='vary img_size +/- 50%%')
        single_cls: true, // help='train as single_class dataset')
        adam: true, // help='use torch.optim.Adam() optimizer')
        sync_bn: true, // help='use SyncBatchNorm, only available in DDP mode')
        local_rank: -1, // help='DDP parameter, do not modify')
        logdir: './yolov5/runs/', // help='logging directory')
        workers: 8 // help='maximum number of dataloader workers')
      },
      hyp: {
        lr0: 0.01, // initial learning rate (SGD=1E-2, Adam=1E-3)    ######lr0:0.01#初始学习率（SGD=1E-2，Adam=1E-3）
        lrf: 0.2, // final OneCycleLR learning rate (lr0 * lrf)      ######lrf:0.2#最终一个周期ELR学习率（lr0*lrf）
        momentum: 0.937, // SGD momentum/Adam beta1                  ######动量：0.937 SGD/Adam beta1
        weight_decay: 0.0005, // optimizer weight decay 5e-4         ######重量衰减：0.0005优化器重量衰减5e-4
        warmup_epochs: 3.0, // warmup epochs (fractions ok)
        warmup_momentum: 0.8, // warmup initial momentum
        warmup_bias_lr: 0.1, // warmup initial bias lr
        giou: 0.05, // box loss gain                                 ######giou:0.05#盒损增益
        cls: 0.5, // cls loss gain                                   ######cls:0.5#cls损益
        cls_pw: 1.0, // cls BCELoss positive_weight                  ######cls_pw:1.0#cls B无正重量
        obj: 1.0, // obj loss gain (scale with pixels)               ######obj:1.0#obj损失增益（按像素缩放）
        obj_pw: 1.0, // obj BCELoss positive_weight                  ######目标权重：1.0
        iou_t: 0.20, // IoU training threshold                       ######iou t:0.20#iou培训阈值
        anchor_t: 4.0, // anchor-multiple threshold                  ######锚定值：4.0#锚定多重阈值
        anchors: 0, // anchors per output grid (0 to ignore)         #######定位点：每个输出网格0个定位点（0忽略）
        fl_gamma: 0.0, // focal loss gamma (efficientDet default gamma=1.5)    ######flťgamma:0.0#焦点损失gamma（efficientDet default gamma=1.5）
        hsv_h: 0.015, // image HSV-Hue augmentation (fraction)       ######hsv_h:0.015#图像hsv色彩空间 色调H增强（分数）
        hsv_s: 0.7, // image HSV-Saturation augmentation (fraction)  ######hsv s:0.7#图像hsv色彩空间 饱和S增强（分数）
        hsv_v: 0.4, // image HSV-Value augmentation (fraction)       ######hsv#v:0.4#图像hsv色彩空间 亮度V增大（分数）
        degrees: 0.0, // image rotation (+/- deg)                    ######度数：0.0#图像旋转（+/-度）
        translate: 0.1, // image translation (+/- fraction)          ######翻译：0.1#图像翻译（+/-分数）
        scale: 0.5, // image scale (+/- gain)                        ######比例：0.5#图像比例（+/-增益）
        shear: 0.0, // image shear (+/- deg)                         ######剪切：0.0#图像剪切（+/-度）
        perspective: 0.0, // image perspective (+/- fraction), range 0-0.001   ######透视：0.0#图像透视（+/-分数），范围0-0.001
        flipud: 0.0, // image flip up-down (probability)             ######flipud:0.0#图像上下翻转（概率）
        fliplr: 0.5, // image flip left-right (probability)          ######fliplr:0.5#图像左右翻转（概率）
        mosaic: 1.0, // image mosaic (probability)
        mixup: 0.0 // image mixup (probability)			                 ######混音：0.0#图像混音（概率）
      },
      result: {
        GIoU: 0, // GIoU：推测为GIoU损失函数均值，越小方框越准；
        Objectness: 0, // Objectness：推测为目标检测loss均值，越小目标检测越准；
        Classification: 0, // Classification：推测为分类loss均值，越小分类越准；
        Precision: 0, // Precision：准确率（找对的/找到的）；
        Recall: 0, // Recall：召回率（找对的/该找对的）；
        mAP: 0, // mAP@0.5 & mAP@0.5:0.95：这里说的挺好，总之就是AP是用Precision和Recall作为两轴作图后围成的面积，m表示平均，@后面的数表示判定iou为正负样本的阈值，@0.5:0.95表示阈值取0.5:0.05:0.95后取均值。

      }
    };
  },
  mounted() {
    // console.log(45252);
    // 数量÷总数×100= 百分比
    this.epochsbili = 0; // Math.round(this.current_epoch / this.trainParam.epochs * 100);
    this.JinDuViewChart = this.JinDuView();
    this.LossViewChart = this.LossView();
    this.LoadDatasets();

    this.GetLossArray();
    this.GetWeightsModelList();
  },
  methods: {
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
    // 取得权重模型文件
    GetWeightsModelList() {
      this.$post({
        url: '/Train/GetWeightsModelList',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((res: any) => {
          if (res.success) {
            this.ModelList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }).catch((err: any) => {
          console.log(err);
          this.$message.error('加载模型文件列表失败');
        });
    },
    GetLossArray() {
      console.log('正在加载训练指标数据..');
      this.$post({
        url: '/Train/GetLossArray',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((res: any) => {
          if (res.success) {
            this.ImageFileCount = res.data.ImageFileCount;
            this.LossArray = res.data.LossLogArray;
            this.TaskState = res.data.TaskState;
            this.OutAIModelName = res.data.OutAIModelName;
            this.LogInfo = res.data.LogInfo;
            this.CurrentEpoch = res.data.CurrentEpoch;

            if (this.TaskState === '启动失败' ||
                this.TaskState === '训练完毕' ||
                this.TaskState === '停止失败' ||
                this.TaskState === '已停止') {
              this.StartButtonEnable = true;
            } else if (
              this.TaskState === '训练中' ||
              this.TaskState === '停止中' ||
              this.TaskState === '启动中') {
              this.StartButtonEnable = false;
            }
            this.RefreshLossView();
            // 5秒后再次执行
            setTimeout(this.GetLossArray.bind(this), 5000);
          } else {
            this.$message.info(res.message);
          }
        }).catch((err: any) => {
          // console.log(err);
          this.TaskState = '已断开链接';
          this.DisabledStartButton = false;
          this.JinDuViewChart.paint(true);
          this.LogInfo = err;
          // 5秒后再次执行
          setTimeout(this.GetLossArray.bind(this), 5000);
          // this.RefreshLossView();
        });
    },
    // 刷新界面
    RefreshLossView() {
      console.log('正在刷新训练指标数据..');

      // 刷新进度界面
      this.epochsbili = Math.round(this.CurrentEpoch / this.trainParam.epochs * 100);
      const data2 = [];
      for (let i = 0; i < 100; i++) {
        const item: any = {};
        item.type = i + '';
        item.value = 4;
        if (i === this.epochsbili) {
          item.value = 8;
        }
        if (i > this.epochsbili) {
          item.value = 0;
        }
        data2.push(item);
      }

      this.JinDuViewChart.views[2].changeData(data2);
      this.JinDuViewChart.paint(true);

      // 刷新误差界面
      if (this.LossArray.length === 0) {
        return;
      }
      // else {
      //   // const lastindex = this.LossArray.length - 1;
      //   // const lastloss = this.LossArray[lastindex] as any;
      //   // this.currentEpochLossData = lastloss;
      // }
      // this.LossArray.forEach((loss)=>{
      //   loss.epoch;
      //   loss.epochs;
      //   loss.gpu_memory;
      //   loss.GIoU;
      //   loss.obj;
      //   loss.cls;
      //   loss.total;
      //   loss.targets;
      //   loss.img_size;
      // })
      this.LossViewChart.changeData(this.LossArray);
    },

    StopTrain() {
      const par = {
        option: JSON.stringify(this.trainParam)
      };
      this.$post.post('/Train/StopTrain', this.ToFormData(par))
        .then((res: any) => {
          if (res.success) {
            this.$message.info(res.message);
            // this.GetLabels();
          } else {
            this.$message.info(res.message);
          }
        });
    },

    CreatNewTrainTask() {
      if (this.trainParam.data === '') {
        this.$message.error('必须选择一个数据集');
        return;
      }

      if (this.hyp.lr0 === 0) {
        this.$message.error('初始学习率不能为0');
      }


      const par = {
        option: JSON.stringify(this.trainParam),
        hyp: JSON.stringify(this.hyp),
      };

      this.$post.post('/Train/CreatNewTrainTask', this.ToFormData(par))
        .then((res: any) => {
          if (res.success) {
            this.$message.info(res.message);
            // this.GetLabels();
          } else {
            this.$message.info(res.message);
          }
        });
    },
    LossView() {
      const data = [
        { epoch: '1', GIoU: 0 },
        { epoch: '2', GIoU: 0 },
        { epoch: '3', GIoU: 0 },
        { epoch: '4', GIoU: 0 },
        { epoch: '5', GIoU: 0 }
      ];
      const chart = new Chart({
        container: 'LossViewEL',
        autoFit: true,
        height: 300,
      });

      chart.data(data);
      // chart.scale({
      //   epoch: {
      //     range: [0, 1],
      //   },
      //   GIoU: {
      //     min: 0,
      //     nice: true,
      //   },
      // });

      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
        // itemTpl: '<div class="g2-tooltip">' +
        //           '<div class="g2-tooltip-title">Language</div>' +
        //           '<ul class="g2-tooltip-list">' +
        //             '<li class="g2-tooltip-list-item">' +
        //               '<span class="g2-tooltip-marker"></span>' +
        //               '<span class="g2-tooltip-name">a</span>:<span class="g2-tooltip-value">70</span>' +
        //             '</li>' +
        //             '<li class="g2-tooltip-list-item">' +
        //               '<span class="g2-tooltip-marker"></span>' +
        //               '<span class="g2-tooltip-name">b</span>:<span class="g2-tooltip-value">50</span>' +
        //             '</li>' +
        //           '</ul>' +
        //         '</div>'
      });

      chart.line()
        .position('epoch*GIoU')
        .label('GIoU', (xValue) => {
          return {
            content: xValue,
          };
        });
      chart.point().position('epoch*GIoU');


      const titleView3 = chart.createView();
      titleView3.annotation().text({
        position: ['50%', '5%'],
        content: '误差(loss)',
        style: {
          fill: '#CBCBCB',
          fontSize: 25,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });

      chart.render();
      return chart;
    },
    JinDuView() {
      // 极坐标下的柱状图
      // 构造数据
      // 灰色线, 总进度


      // 蓝色线线, 进度线
      const data2 = [];
      for (let i = 0; i < 100; i++) {
        const item: any = {};
        item.type = i + '';
        item.value = 4;
        if (i === this.epochsbili) {
          item.value = 8;
        }
        if (i > this.epochsbili) {
          item.value = 0;
        }
        data2.push(item);
      }

      const chart = new Chart({
        container: 'jindu',
        autoFit: true,
        height: 300,
        padding: 0,
      });
      chart.scale({
        type: {
          range: [0, 1],
        },
        value: {
          sync: true,
        },
      });
      chart.legend(false);
      chart.tooltip(false);

      const view1 = chart.createView();
      const data1 = [];
      for (let i = 0; i < 100; i++) {
        data1.push({
          type: i + '',
          value: 4, // 线的长短
        });
      }
      view1.data(data1);
      view1.axis(false);
      view1.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        innerRadius: 0.75,
        radius: 0.8,
      });
      view1
        .interval()
        .position('type*value')
        .color('#CBCBCB')
        .size(1);

      const view2 = chart.createView();
      view2.data(data1);
      view2.axis('value', false);
      view2.axis('type', {
        grid: null,
        line: null,
        tickLine: null,
        label: {
          offset: -25,
          style: {
            textAlign: 'center',
            fill: '#CBCBCB',
            fontSize: 18,
          },
          formatter: (val) => {
            if (+val % 7 !== 0) {
              return '';
            }

            return val;
          },
        },
      });
      // 内圈小虚线
      view2.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        innerRadius: 0.95,
        radius: 0.55,
      });
      view2
        .interval()
        .position('type*value')
        .color('#A987FB')
        .size(2);

      // chart.point()
      //   .position('x*y')
      //   .label('value', (xValue) => {
      //     return {
      //       content: xValue + '%',
      //     };
      //   });
      const view3 = chart.createView();

      view3.data(data2);
      view3.axis(false);
      view3.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        innerRadius: 0.75,
        radius: 0.8,
      });
      view3
        .interval()
        .position('type*value')
        .color('value', '#3023AE-#188cfa')
        .size(1);

      view3.annotation().text({
        position: ['50%', '60%'],
        content: '轮次',
        style: {
          fill: '#CBCBCB',
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });



      view3.annotation().text({
        position: ['50%', '75%'],
        content: '样本数',
        style: {
          fill: '#CBCBCB',
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });


      view3.annotation().text({
        position: ['50%', '95%'],
        content: () => {
          return this.TaskState;
        },
        style: {
          fill: '#1f65a4',
          fontSize: 20,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });

      view3.annotation().text({
        position: ['50%', '5%'],
        content: '进度(progress)%',
        style: {
          fill: '#CBCBCB',
          fontSize: 25,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });

      // 动态文字层
      // const view4 = chart.createView();

      // view4.annotation().text({
      //   position: ['50%', '55%'],
      //   content: '0/0',
      //   style: {
      //     fill: '#CBCBCB',
      //     fontSize: 24,
      //     textAlign: 'center',
      //     textBaseline: 'middle',
      //   },
      // });
      // window.iiii = 0;
      view3.annotation().text({
        position: ['50%', '55%'],
        content: () => {
          return this.CurrentEpoch + '/' + this.trainParam.epochs;
        },
        top: true,
        style: {
          fill: '#CBCBCB',
          fontSize: 24,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });

      view3.annotation().text({
        position: ['50%', '70%'],
        content: () => {
          return this.ImageFileCount;
        },
        style: {
          fill: '#CBCBCB',
          fontSize: 24,
          textAlign: 'center',
          textBaseline: 'middle',
        },
      });
      chart.render();
      return chart;
    }
  }
});

</script>
<style scoped>
.param{
  color:blue;
}
</style>
