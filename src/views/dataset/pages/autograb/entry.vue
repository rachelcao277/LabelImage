<template>
<a-row>

  <a-modal v-model="visibleLogModal" title="查看日志" width="90%"   >
    <textarea v-model="LogMessage" style="width:100%; height:400px;"></textarea>
  </a-modal>

  <template v-for="(dset,indexx) in DataSets">
      <a-card v-bind:key="indexx" hoverable class="ant-col ant-col-6" style="margin-left:10px;width:100%; margin-top:10px; padding:12px; ">
          <a-col :span="3"><b> {{ dset.name }}</b></a-col>
          <a-col :span="3" title="当前状态:" style="padding-left:10px;"> {{ dset.runstate }} </a-col>
          <a-col :span="3" title="数据集已抓取百分比:"><a-progress :percent="dset.progress" :width="80" /></a-col>
          <a-col :span="6" style="padding-left:10px;">
            <a-button-group style="margin-bottom:10px;margin-left:10px;" >
              <a-button @click="StartAutoGrab(dset)"><a-icon type="caret-right"  title="运行自动抓取图片(对整个数据集下的所有关键词)"/></a-button>
              <a-button @click="StopAutoGrab(dset)"><a-icon type="pause" title="停止自动抓取图片" /></a-button>
              <a-button @click="GetProcessLog(dset)"><a-icon type="code" title="查看自动抓取图片日志"/></a-button>
              <a-button @click="RefreshState(dset)"><a-icon type="sync" title="刷新进度" /></a-button>
            </a-button-group>
          </a-col>
      </a-card>
  </template>


</a-row>
</template>
<script>
import Vue from 'vue';
// import Antd from 'ant-design-vue';
// import { pagination} from 'ant-design-vue';
// import request from '@/utils/request';

export default {
  name: 'AutoGrabManageIndex',
  components: {
    // STable,
    // Ellipsis
    // CreateForm,
    // StepByStepModal
  },
  data() {
    // this.columns = columns
    return {
      // visibleCreateModal: false,
      // visibleDeleteModal: false,
      visibleLogModal: false,
      LogMessage: '',
      // newDataset: {
      //   'name': '图片数据集', 'description': 'yolo5', 'imageurl': '/static/img/封面5.jpg'
      // },
      // WillDeleteDataSet: {},
      // WillDeleteDataSetIndex: -1,
      // ConfirmDeleteKey: '',
      // ConfirmText: '确认删除',
      DataSets: [
        // {"name":"Yolov5 数据集","description":"yolo5 121",  "imageurl":"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"},
      ],
      // currentPageIndex: 1,
      // pagesize: 30
    };
  },
  filters: {
    // statusFilter (type) {
    //   return null//statusMap[type].text
    // },
    // statusTypeFilter (type) {
    //   return null//statusMap[type].status
    // }
  },
  created() {
    // getRoleList({ t: new Date() })
    // this.handleSearch()
    this.LoadDatasets();
    // window.setInterval(this.GetProcessState, 5000);
    // window.setInterval(this.RefreshState, 500); // 立即执行一次
    // window.setInterval(this.GetSpeedOfProgress, 10000);

  },
  computed: {
    // rowSelection () {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.onSelectChange
    //   }
    // }
  },
  methods: {

    StopAutoGrab(dataset) {
      console.log(dataset);
      const DatasetName = dataset.name;

      this.$post({
        url: '/AutoGrab/StopGrab',
        params: { 'DatasetName': DatasetName },
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

      console.log(DatasetName);
    },
    StartAutoGrab(dataset) {
      console.log(dataset);
      const DatasetName = dataset.name;

      this.$post({
        url: '/AutoGrab/StartGrab',
        params: { 'DatasetName': DatasetName },
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

      console.log(DatasetName);
    },
    // 取得进程的日志
    GetProcessLog(dataset) {
      console.log(dataset);
      const DatasetName = dataset.name;
      this.$post({
        url: '/AutoGrab/GetProcessLog',
        params: { 'DatasetName': DatasetName },
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
      for (let i = 0; i < this.DataSets.length; i++) {
        const dset = this.DataSets[i];
        console.log(dset);
        const DatasetName = dset.name;

        this.$post({
          url: '/AutoGrab/GetSpeedOfProgress',
          params: { 'DatasetName': DatasetName },
          method: 'post',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
          .then(res => {
            if (res.success) {
              Vue.set(dset, 'progress', res.data.progress);
              // this.$message.info('进度比例已刷新');
            } else {
              Vue.set(dset, 'progress', 0);
            }
          });

        console.log(DatasetName);
      }
    },
    // 刷新状态
    RefreshState() {
      this.GetProcessState();
      this.GetSpeedOfProgress();
    },

    GetProcessState() {
      // debugger;
      for (let i = 0; i < this.DataSets.length; i++) {
        const dataa = this.DataSets[i];
        this.$post({
          url: '/AutoGrab/GetProcessState',
          method: 'post',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          params: { 'DatasetName': dataa.name }
        })
          .then(res => {
            console.log(res);
            if (res.success) {
              // 返回的是一个心跳标志,会一直在增长
              // console.log('StopAutoGrab');
              Vue.set(dataa, 'runstate', res.message);
              // this.$message.info('进度已刷新');
            } else {
              Vue.set(dataa, 'runstate', '通信中断');
            }
          });
      }

      console.log(this.DataSets);
    },
    // 加载数据集
    LoadDatasets() {
      this.$post({
        url: '/DatasetManage/LoadDatasets',
        method: 'post',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      })
        .then(res => {
          if (res.success) {
            this.DataSets = res.data;
            this.RefreshState();
          } else {
            this.$message.info(res.message);
          }
        });
    }
  }
};
</script>
<style>

</style>
