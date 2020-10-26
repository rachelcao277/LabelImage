<template>
  <div class="about">
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
      <div >
        <a-icon type="dashboard" />测试AI模型
      </div>
      <a-card style="margin-top:15px;margin-bottom:15px;" title="第一步 上传待识别图片">

            <!-- :data="UploadDatas"
            :before-upload="beforeUpload"
            -->
            <a-upload
            name="imagefile"
            accept=".jpg,.jpeg,.bmp,.png"
            action="/api/Train/UploadToDetectImage"
            list-type="picture-card"
            :show-upload-list="true"
            :file-list="ToDetectImagesList"
            :remove="DeleteImage"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="ToDetectImagesList.length < 100">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传照片
              </div>
            </div>
          </a-upload>

          <!-- <a-card v-for="(image,imageindex) in ToDetectImagesList" hoverable class="ant-col ant-col-3 imagecard" v-bind:key="imageindex"  style="padding:0px" >
            <img v-bind:src="image" style="width:100%; height:10vw;" @click="previewImage=image;previewVisible=true;" />
            <template slot="actions" class="ant-card-actions">
                  <a-icon key="delete" type="delete" @click="DeleteImage(image,imageindex)" />
            </template>
          </a-card> -->


     </a-card>
      <a-card style="margin-top:15px;margin-bottom:15px;" title="第二步 选择模型和参数 进行识别">

        <a-form  :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }"  >
          <!-- <a-tabs default-active-key="1" >
            <a-tab-pane key="1" tab="训练参数"> -->
                <a-form-item label="选择模型" help="选择模型">
                  <a-select
                    v-model="DetectParamter.weights"
                    :default-active-first-option="true"
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
                <a-form-item label="待识别图片的路径" help="待识别图片的路径,不可更改.">
                    <a-input v-model="DetectParamter.source" :min="0" :max="1" :step="0.1" default-value="0.4" disabled  />
                </a-form-item>
                <a-form-item label="存放识别结果的图片路径" help="存放识别结果的图片路径,不可更改.">
                    <a-input v-model="DetectParamter.output" :min="0" :max="1" :step="0.1" default-value="0.4" disabled />
                </a-form-item>

                <a-form-item label="图形尺寸" help="待识别图片归一化后尺寸,要跟模型训练时填的大小一致">
                  <a-input-group compact>
                    <a-input style="width: 20%"  v-model="DetectParamter.img_size[0]" default-value="640" />
                    <a-input style="width: 20%"  v-model="DetectParamter.img_size[1]" default-value="640" />
                  </a-input-group>
                </a-form-item>

                <a-form-item label="计算用设备" help="选择计算用设备,cpu或者GPU">
                  <a-select  v-model="DetectParamter.device" default-value="0">
                    <a-select-option value="cpu">cpu</a-select-option>
                    <a-select-option value="0">GPU 0</a-select-option>
                    <a-select-option value="1">GPU 1</a-select-option>
                    <a-select-option value="2">GPU 2</a-select-option>
                    <a-select-option value="3">GPU 3</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="可信度阈值" help="识别概率小于此阈值的将视为没有被识别.">
                    <a-input v-model="DetectParamter.conf_thres" :min="0" :max="1" :step="0.1" default-value="0.4"   />
                </a-form-item>

                <a-form-item label="IOU可信度阈值"  help="识别概率小于此阈值的将视为没有被识别">
                  <a-input-number  v-model="DetectParamter.iou_thres"  :min="0" :max="1" :step="0.1"  default-value="0.5" />
                </a-form-item>

            <!-- </a-tab-pane>
          </a-tabs> -->
        </a-form>

        <a-button type="primary" :loading="loading" @click="DoDetect()">开始识别</a-button>
        <a-button :loading="loading" @click="GetDetectedImagesList()">刷新识别结果</a-button>
      </a-card>

      <a-card style="margin-top:15px;" title="第三步 查看识别结果(每次识别自动清空上次的识别结果)">
        <template v-for="(image,imageindex) in DetectedImagesList">
            <a-card hoverable class="ant-col ant-col-2 imagecard" v-bind:key="imageindex"  style="padding:0px" >
              <img v-bind:alt="image.name" v-bind:src="image.url"  @click="previewImage=image.url;previewVisible=true;" />
            </a-card>
        </template>
      </a-card>

  </div>
</template>
<script>
// import Vue from 'vue';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      SelectedModel: '',
      loading: false,
      ModelList: ['2020123456'],
      DetectParamter: {
        weights: '', // help='model.pt path(s)') 训练的权重模型
        source: './static/ToDetectImages/images', // help='source')  //# file/folder, 0 for webcam 测试数据，可以是图片/视频路径，也可以是'0'(电脑自带摄像头),也可以是rtsp等视频流
        output: './static/ToDetectImages/output', // help='output folder')  //# output folder 网络预测之后的图片/视频的保存路径
        img_size: 640, // help='inference size (pixels)')网络输入图片大小
        conf_thres: 0.4, // help='object confidence threshold')置信度阈值
        iou_thres: 0.5, // help='IOU threshold for NMS')做nms的iou阈值
        device: '0', // help='cuda device, i.e. 0 or 0,1,2,3 or cpu') 设置设备
        view_img: false, // help='display results')是否展示预测之后的图片/视频，默认False
        save_txt: false, // help='save results to *.txt')是否将预测的框坐标以txt文件形式保存，默认False
        classes: 0, // help='filter by class: __class 0, or __class 0 2 3')设置只保留某一部分类别，形如0或者0 2 3
        agnostic_nms: false, // help='class_agnostic NMS')进行nms是否也去除不同类别之间的框，默认False
        augment: true, // help='augmented inference')推理的时候进行多尺度，翻转等操作(TTA)推理
        update: false// help='update all models')如果为True，则对所有模型进行strip_optimizer操作，去除pt文件中的优化器等信息，默认为False
      },
      // 已上传的图片
      ToDetectImagesList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          httpurl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
      ],
      // 识别后的图片
      DetectedImagesList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          httpurl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          httpurl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
      ],
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //   uid: '-5',
        //   name: 'image.png',
        //   status: 'error',
        // },
      ],
    };
  },
  mounted() {
    this.GetToDetectImagesList();
    this.GetDetectedImagesList();
    this.GetWeightsModelList();
  },
  methods: {
    // 获取已识别的图片
    GetDetectedImagesList() {
      this.$post({
        url: '/Train/GetDetectedImagesList',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((res) => {
          if (res.success) {
            this.DetectedImagesList = res.data;
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
        .then((res) => {
          if (res.success) {
            this.ModelList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }).catch((err) => {
          console.log(err);
          this.$message.error('加载模型文件列表失败');
        });
    },
    // 获取待识别的图片
    GetToDetectImagesList() {
      this.$post({
        url: '/Train/GetToDetectImagesList',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then((res) => {
          if (res.success) {
            this.ToDetectImagesList = res.data;
          } else {
            this.$message.info(res.message);
          }
        });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // handleRemove(file) {
    //   console.log(file);
    // },
    // beforeUpload(file) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     this.$message.error('You can only upload JPG file!');
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     this.$message.error('Image must smaller than 2MB!');
    //   }
    //   return isJpgOrPng && isLt2M;
    // },
    DeleteImage(imagefile) {
      // alert(url);
      console.log(imagefile);
      // console.log(imageindex);
      // const yishanchuimgurl = document.getElementById('yishanchuimg').src;
      this.$post({
        url: '/Train/DeleteToDetectImage',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'ImageFileName': imagefile.url }
      })
        .then((res) => {
          if (res.success) {
            this.$message.info(res.message);
            for (let i = 0; i < this.ToDetectImagesList.length; i++) {
              if (this.ToDetectImagesList[i].uid === imagefile.uid) {
                this.ToDetectImagesList.splice(i, 1);
                break;
              }
            }
          } else {
            this.$message.info(res.message);
          }
        });
    },
    DoDetect() {
      if (this.DetectParamter.weights === '') {
        this.$message.error('必须选择一个模型');
        return;
      }

      // if (this.DetectParamter.lr0 === 0) {
      //   this.$message.error('初始学习率不能为0');
      // }

      this.loading = true;
      this.$message.info('正在识别中,大概1-2分钟请耐心等待.');
      this.$post({
        url: '/Train/DoDetect',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: {
          'DetectParamter': JSON.stringify(this.DetectParamter)
        },
        timeout: 300000
      },
      { timeout: 200000 })
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.$message.info(res.message);
          } else {
            this.$message.info(res.message);
          }
          this.GetDetectedImagesList();
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
          this.GetDetectedImagesList();
        });
    },
    handleChange(parfile) {
      // debugger;
      // console.log(parfile);
      // console.log(parfile.file.response);
      this.ToDetectImagesList = parfile.fileList; // 这个必须得要, 还需要回传的时候调用.
      // console.log(parfile.file.status);
      // debugger;
      // this.fileList =
      // if (parfile.fileList.length > 0 && parfile.fileList[0].response) {
      //   const url = parfile.fileList[0].response.url;
      //   this.ToDetectImagesList.push(url);
      // }
    },
  }
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}


.imagecard{

    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 4px;
    display: inline-block;
    margin-left: 2%;
    margin-bottom: 2%;
    vertical-align: top;
    padding:0px;
    /* background-image: url(/your/image/path.jpg);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat; */
}
.imagecard .ant-card-body{
   padding:0px;
}
.imagecard img {
  width:100%;
  height:6vw;
  object-fit: cover;
  overflow: hidden;
}
</style>
