<template>
     <a-row>
       <img id="yishanchuimg" src="./yishanchu.jpg" style="display:none;"/>

      <a-modal v-model="visibleLogModal" title="查看日志" width="90%"   >
        <textarea v-model="LogMessage" style="width:100%; height:400px;"></textarea>
      </a-modal>

      <a-modal v-model="VisibleChangeCurrentLabelModal" title="修改名称" width="300px" @ok="ChangeLabelSetName"  >
        <a-input v-model="editingLabelSetName" />
      </a-modal>

      <a-modal v-model="visibleCreateLabelModal" title="新增标签" @ok="handlerCreateLabel">
        请输入标签名:<a-input v-model="NewLabelSetName" />
        数据获取方式.  默认为自动爬取图像.  手工上传,由于数据太多请使用ftp方式上传.
      </a-modal>

      <a-modal v-model="visibleUpdateImageModal" title="手工上传图片集" >
       <div class="clearfix">
        <a-upload
          name="imagefile"
          accept=".jpg,.jpeg,.bmp,.png"
          :data="UploadDatas"
          action="/api/DatasetManage/ManualUploadImage"
          list-type="picture-card"
          :multiple="true"
          :file-list="UploadFileList"
          :headers="uploadFileHeaders"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="UploadFileList.length < 1000">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
      </a-modal>

      <a-col :span="4">
       <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-button style="width:100%" v-on:click="visibleCreateLabelModal=true " >
              <a-icon key="plus" type="plus" /> 新增关键词
            </a-button>
            <a-input-search placeholder="请输入关键词" style="width:100%" @search="GetLabels" />

            <a-list item-layout="horizontal" bordered  :data-source="labelSets">
              <a-list-item slot="renderItem" slot-scope="item" v-on:click="GetImagesByLabel(item)" style="cursor: pointer;">
                {{item.LabelSetName}} <span style="font-size:8px;">({{item.FileCount}})</span>
              </a-list-item>
            </a-list>
        </a-form>
      </div>
      </a-col>
      <a-col :span="20" style="padding-left:10px; ">

        <a-page-header
            style="border: 1px solid rgb(235, 237, 240); margin-bottom:20px;  padding:5px 10px;"
            v-bind:title="this.DatasetName + ' > ' + this.currentLabel.LabelSetName "
            sub-title=""
            :ghost="false"
            @back="() => null"
          />
        <a-button-group style="margin-bottom:10px;">
          <a-button type="primary" title="修改当前关键词" @click="editingLabelSetName = currentLabel.LabelSetName;VisibleChangeCurrentLabelModal=true;"  :disabled="currentLabel.LabelSetName =='' "><a-icon type="edit" /></a-button>
          <a-button type="danger"  title="删除当前关键词" @click="DeleteCurrentLabel()"  :disabled="currentLabel.LabelSetName =='' "><a-icon type="delete" /></a-button>
        </a-button-group>

        <a-button-group style="margin-bottom:10px;margin-left:10px;" >
          <a-button  title="开始自动抓取"   type="primary" @click="StartAutoGrab()" :disabled="currentLabel.LabelSetName =='' "><a-icon type="caret-right" /></a-button>
          <a-button  title="停止自动抓取"  type="primary" @click="StopAutoGrab()" :disabled="currentLabel.LabelSetName =='' "><a-icon type="pause" /></a-button>
          <a-button  title="查看日志"  type="primary" @click="GetProcessLog()" :disabled="currentLabel.LabelSetName =='' "><a-icon type="code" /></a-button>
          <a-button  title="刷新任务状态"  @click="RefreshState()" :disabled="currentLabel.LabelSetName =='' "><a-icon type="sync" />{{currentLabel.progress}}%</a-button>
        </a-button-group>

        <a-button-group style="margin-bottom:10px;margin-left:10px;" >

            <a-button  title="手工上传图片集"   type="primary" @click="showUpload()" :disabled="currentLabel.LabelSetName =='' "><a-icon type="cloud-upload" /></a-button>

        </a-button-group>


        <a-pagination
          show-quick-jumper
          :default-current="1"
          v-model="this.currentPageIndex"
          :pageSize="30"
          :total="this.currentLabel.FileCount"
          @change="onPageIndexChange"
          style="margin-bottom:15px;  "
        />

          <!-- <a-pagination simple :default-current="1" :pageSize="30" :total="this.currentLabel.FileCount" @change="onPageIndexChange" /> -->
        <a-row>

          <template v-for="(image,imageindex) in imageSets">
            <a-card hoverable class="ant-col ant-col-5 imagecard" v-bind:key="imageindex"  style="padding:0px" >
              <img v-bind:alt="image.imagefile" v-bind:src="image.httpurl" style="width:100%; height:10vw; margin-bottom:10px;" />
              <template slot="actions" class="ant-card-actions">
                  <a-icon key="delete" type="delete" @click="deleteImage(image,imageindex)" />
              </template>
            </a-card>
          </template>

       </a-row>

       <a-pagination
            show-quick-jumper
            :default-current="1"
            v-model="this.currentPageIndex"
            :pageSize="30"
            :total="this.currentLabel.FileCount"
            @change="onPageIndexChange"
            style="margin-bottom:15px;  "
          />
      </a-col>
    </a-row>

</template>

<script>
import Vue from 'vue';
// import Antd from 'ant-design-vue';

// import { AutoComplete } from 'ant-design-vue';

// import axiosPost from '@/common/utils/request';

// import moment from 'moment'
// import { STable, Ellipsis,AutoComplete } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CreateForm'


// Vue.use(AutoComplete);
// Vue.use(Antd);

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: 'ImageMangeIndex',
  components: {
    // STable,
    // Ellipsis
    // CreateForm,
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    // debugger
    const dsname = this.$route.params.DatasetName;
    // alert( dsname+ "332323");
    return {

      // 手工上传相关 start
      UploadFileList: [],
      previewImage: '',
      previewVisible: false,

      visibleLogModal: false,
      VisibleChangeCurrentLabelModal: false,
      visibleUpdateImageModal: false,
      uploadFileHeaders: {},
      UploadDatas: {},

      // 手工上传相关 end

      editingLabelSetName: '',
      LogMessage: '',
      visibleCreateLabelModal: false,
      NewLabelSetName: '',
      labelSets: [],
      imageSets: [],
      currentLabel: { 'LabelSetName': '', 'FileCount': 0, 'progress': '' },
      DatasetName: dsname,
      dataSource: [],
      currentPageIndex: 1,
      pagesize: 30
    };
  },
  filters: {},
  created() {
    this.GetLabels();
  },
  computed: {},
  methods: {
    // 上传相关 start 上传相关上传相关上传相关
    showUpload() {
      this.visibleUpdateImageModal = true;
      this.UploadDatas = { DatasetName: this.DatasetName, LabelSetName: this.currentLabel.LabelSetName };
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

    handleChange({ fileList }) {
      this.UploadFileList = fileList;
    },
    // 上传相关 end 上传相关上传相关上传相关上传相关


    // ManualUpload() {
    //   this.$post({
    //     url: '/DatasetManage/ManualUpload',
    //     method: 'post',
    //     headers: {
    //       'Content-Type': 'application/json;charset=UTF-8'
    //     },
    //     params: {
    //       'DatasetName': this.DatasetName,
    //       'LabelSetName': this.currentLabel.LabelSetName
    //     }
    //   })
    //     .then(res => {
    //       if (res.success) {
    //         this.$message.info(res.message);
    //         this.GetLabels();
    //       } else {
    //         this.$message.info(res.message);
    //       }
    //     });
    // },
    // 删除当前关键词
    DeleteCurrentLabel() {
      if (confirm('确认要删除这个关键词' + this.currentLabel.LabelSetName + '么? 下面的图片将会被删掉.不可恢复.')) {
        this.$post({
          url: '/DatasetManage/DeleteCurrentLabel',
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          params: {
            'DatasetName': this.DatasetName,
            'LabelSetName': this.currentLabel.LabelSetName
          }
        })
          .then(res => {
            if (res.success) {
              this.$message.info(res.message);
              this.GetLabels();
            } else {
              this.$message.info(res.message);
            }
          });
      }
    },
    // 修改当前关键词
    ChangeLabelSetName() {
      this.$post({
        url: '/DatasetManage/ChangeLabelSetName',
        method: 'post',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        params: {
          'DatasetName': this.DatasetName,
          'LabelSetName': this.currentLabel.LabelSetName,
          'NewLabelSetName': this.editingLabelSetName }
      })
        .then(res => {
          if (res.success) {
            this.$message.info(res.message);
            this.GetLabels();
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 创建关键词
    handlerCreateLabel() {
      // const _this = this;
      this.$post({
        url: '/DatasetManage/CreateLabel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.NewLabelSetName }
      })
        .then(res => {
          if (res.success) {
            this.$message.info(res.message);
            this.GetLabels();
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // onSelect(value) {
    //   console.log('onSelect');
    // },
    onPageIndexChange(pageindex) {
      console.log(pageindex);
      this.currentPageIndex = pageindex;
      this.GetImagesByLabel(this.currentLabel);
    },
    getRandomInt(max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 取得关键词下的所有图片
    GetImagesByLabel(item) {
      this.currentLabel = item;
      this.$post({
        url: '/DatasetManage/GetImagesByLabel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.DatasetName, 'pageindex': this.currentPageIndex, 'pagesize': this.pagesize, 'LabelSetName': item.LabelSetName }
      })
        .then(res => {
          if (res.success) {
            this.imageSets = res.data;
          } else {
            this.$message.info(res.message);
          }
        });

    },

    // 删除图片
    deleteImage(image, imageindex) {
      // const _imageSets = this.imageSets;
      // const _index = index;
      const yishanchuimgurl = document.getElementById('yishanchuimg').src;
      image.imageindex = imageindex;
      this.$post({
        url: '/DatasetManage/RemoveImage',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.currentLabel.LabelSetName, 'ImageFileName': image.imagefile }
      })
        .then(res => {
          if (res.success) {

            image.httpurl = yishanchuimgurl;
            // _imageSets.splice(_index, 1);
          } else {
            this.$message.info(res.message);
          }
        });
    },

    // 执行查询
    GetLabels(value) {
      this.$post({
        url: '/DatasetManage/GetLabels',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.DatasetName, 'seachkey': value }
      })
        .then(res => {
          console.log(res);
          if (res.success) {
            this.labelSets = res.data;
          } else {
            this.$message.info(res.message);
          }
        });

    },


    /* *************************************************** 自动抓取相关 start */
    StopAutoGrab() {
      // console.log(dataset);
      // const DatasetName = dataset.name;

      this.$post({
        url: '/AutoGrab/StopGrab',
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.currentLabel.LabelSetName },
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          if (res.success) {
            // this.DataSets = res.data;
            this.$message.info(res.message);
            this.RefreshState();
          } else {
            this.$message.info(res.message);
          }
        });

      // console.log(DatasetName);
    },
    StartAutoGrab() {
      // console.log(dataset);
      // const DatasetName = dataset.name;

      this.$post({
        url: '/AutoGrab/StartGrab',
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.currentLabel.LabelSetName },
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          if (res.success) {
            // this.DataSets = res.data;
            this.$message.info(res.message);
            this.RefreshState();
          } else {
            this.$message.info(res.message);
          }
        });

      // console.log(DatasetName);
    },
    // 取得进程的日志
    GetProcessLog() {
      // console.log(dataset);
      // const DatasetName = dataset.name;
      this.$post({
        url: '/AutoGrab/GetProcessLog',
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.currentLabel.LabelSetName },
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          if (res.success) {
            // this.DataSets = res.data;
            this.visibleLogModal = true;
            this.LogMessage = res.message;
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 取得进度比例
    GetSpeedOfProgress() {
      // for (let i = 0; i < this.DataSets.length; i++) {
      // const dset = this.DataSets[i];
      // console.log(dset);
      // const DatasetName = dset.name;

      this.$post({
        url: '/AutoGrab/GetSpeedOfProgress',
        params: { 'DatasetName': this.DatasetName, 'LabelSetName': this.currentLabel.LabelSetName },
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          if (res.success) {
            // this.DataSets = res.data;
            // dataset.progress = res.message;
            Vue.set(this.currentLabel, 'progress', res.data.progress);
            Vue.set(this.currentLabel, 'FileCount', res.data.FileCount);
            // this.currentLabel.progress = res.message;
            this.$message.info('进度已更新');
          } else {
            // dataset.progress = 0;
            Vue.set(this.currentLabel, 'progress', 0);
            Vue.set(this.currentLabel, 'FileCount', 0);
            // this.currentLabel.progress = 0;
            // this.$message.info(res.message);
          }
        });

      // console.log(DatasetName);
      // }
    },
    // 刷新状态
    RefreshState() {
      // this.GetProcessState();
      this.GetImagesByLabel(this.currentLabel);
      this.GetSpeedOfProgress();
    },

    GetProcessState() {
      // for (let i = 0; i < this.DataSets.length; i++) {
      //   const dataa = this.DataSets[i];
      this.$post({
        url: '/AutoGrab/GetProcessState',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: {
          'DatasetName': this.DatasetName,
          'LabelSetName': this.currentLabel.LabelSetName
        }
      })
        .then(res => {
          console.log(res);
          if (res.success) {
            // 返回的是一个心跳标志,会一直在增长
            Vue.set(this.currentLabel, 'runstate', res.message);
            // this.currentLabel.runstate = res.message;
          } else {
            Vue.set(this.currentLabel, 'runstate', '通信中断');
            // this.currentLabel.runstate = '通信中断';
          }
        });
      // }

      // console.log(this.DataSets);
    },
    /* *************************************************** 自动抓取相关end */
  }
};
</script>
<style>

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
  height:20vw
}

</style>
