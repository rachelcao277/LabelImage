<template>
<a-row>

  <a-modal v-model="visibleLogModal" title="查看日志" width="90%"   >
    <textarea v-model="LogMessage" style="width:100%"></textarea>
  </a-modal>


  <template v-for="(dset,indexx) in DataSets">
    <a-card v-bind:key="indexx" hoverable class="ant-col ant-col-6" style="margin-left: 10px;">
      <img style="width:100%; height:10vw; margin-bottom:10px;" :alt="dset.name" :src="dset.imageurl" />
      <h1>{{ dset.name }}</h1>
      数据集已抓取百分比:
      <a-progress :percent="dset.progress" :width="80" />

      当前状态: {{ dset.runstate }} <!-- 运行中, 已停止,未运行 -->
      <template slot="actions" class="ant-card-actions">
          <!-- <a-button  @click="StartAutoGrab(dset)"><a-icon type="right-circle"/>运行</a-button>
          <a-button  @click="StartAutoGrab(dset)"><a-icon type="pause"/>停止</a-button> -->
          <a-icon type="caret-right" @click="StartAutoGrab(dset)" title="运行"/>
          <a-icon type="pause" @click="StopAutoGrab(dset)" title="停止" />
          <a-icon type="code" @click="GetProcessLog(dset)" title="查看日志"/>



      </template>
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
      visibleCreateModal: false,
      visibleDeleteModal: false,
      visibleLogModal: false,
      LogMessage: '',
      newDataset: {
        'name': '图片数据集', 'description': 'yolo5', 'imageurl': '/static/相册封面 (5).jpg'
      },
      WillDeleteDataSet: {},
      WillDeleteDataSetIndex: -1,
      ConfirmDeleteKey: '',
      ConfirmText: '确认删除',
      DataSets: [
        // {"name":"Yolov5 数据集","description":"yolo5 121",  "imageurl":"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"},
      ],
      currentPageIndex: 1,
      pagesize: 30
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
    window.setInterval(this.GetProcessState, 5000);
    this.GetProcessState(); // 立即执行一次
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
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
          .then(res => {
            if (res.success) {
              // this.DataSets = res.data;
              // dataset.progress = res.message;
              Vue.set(dset, 'progress', res.message);
              // this.$message.info(res.message);
            } else {
              // dataset.progress = 0;
              Vue.set(dset, 'progress', 0);
              // this.$message.info(res.message);
            }
          });

        console.log(DatasetName);
      }
    },
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
          } else {
            this.$message.info(res.message);
          }
        });

      console.log(DatasetName);
    },
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
    GetProcessState() {
      // console.log('GetProcessState');
      this.GetSpeedOfProgress();

      for (let i = 0; i < this.DataSets.length; i++) {
        const dataa = this.DataSets[i];
        this.$post({
          url: '/AutoGrab/GetProcessState',
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          params: {
            'DatasetName': dataa.name
          }
        })
          .then(res => {
            console.log(res);
            if (res.success) {
              // dataa.runstate = res.message;
              // 返回的是一个心跳标志,会一直在增长
              // if (dataa.harte !== res.message) {
              //   dataa.harte = res.message;
              //   Vue.set(dataa, 'runstate', '运行中');
              // } else {
              //   dataa.harte = res.message;
              //   Vue.set(dataa, 'runstate', '暂停或等待中');
              // }
              Vue.set(dataa, 'runstate', res.message);
              // this.$message.info(dataa.name + res.message);
            } else {
              Vue.set(dataa, 'runstate', '通信中断');
              // this.$message.info(dataa.name + res.message);
              // this.$message.info(res.message);
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
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          if (res.success) {
            this.DataSets = res.data;
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
