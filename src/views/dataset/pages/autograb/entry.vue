<template v-for="(dset,indexx) in DataSets">
  <a-card v-bind:key="indexx" hoverable class="ant-col ant-col-6" style="margin-left: 10px;">
    <img style="width:100%; height:10vw; margin-bottom:10px;" :alt="dset.name" :src="dset.imageurl" />
    <h1>{{ dset.name }}</h1>
    数据集已抓取百分比:
    <a-progress :percent="30" :width="80" />

    当前状态: 运行中, 已停止
    <template slot="actions" class="ant-card-actions">
        <!-- <a-button  @click="StartAutoGrab(dset)"><a-icon type="right-circle"/>运行</a-button>
        <a-button  @click="StartAutoGrab(dset)"><a-icon type="pause"/>停止</a-button> -->
        <a-icon type="caret-right" @click="StartAutoGrab(dset)" title="运行"/>
        <a-icon type="pause" @click="StartAutoGrab(dset)" title="停止" />
        <a-icon type="code" @click="StartAutoGrab(dset)" title="查看日志"/>
    </template>
  </a-card>
</template>

<script>
// import Vue from 'vue';
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
    alert(11111);
    this.LoadDatasets();
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
    StartAutoGrab(dataset) {
      console.log(dataset);
      const DatasetName = dataset.name;

      console.log(DatasetName);
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
    },

    // 创建数据集
    CreateDataset() {
      this.$post({
        url: '/DatasetManage/CreateDataset',
        method: 'post',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        params: this.newDataset
      })
        .then(res => {
          if (res.success) {
            this.LoadDatasets();
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 删除数据集
    handlerDeleteDataset() {
      const dset = this.WillDeleteDataSet;
      const _Index = this.WillDeleteDataSetIndex;
      if (this.ConfirmDeleteKey === this.ConfirmText) {
        this.ConfirmDeleteKey = '';
        // alert("正在删除")
        this.$post({
          url: '/DatasetManage/DeleteDataset',
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          params: { DatasetName: dset.name }
        })
          .then(res => {
            if (res.success) {
              this.DataSets.splice(_Index, 1);
            } else {
              this.$message.info(res.message);
            }
          });
      } else {
        // alert("输入不正确,删除中止.")
        this.$message.info('输入不正确,删除中止.');
      }
    },
    onloadinit() {
      // window.webSocket = new WebSocket("ws://localhost:10240");
      // window.webSocket.onmessage = function(e) {
      //     console.log("Got echo: " + e.data);
      //     $("#output").append(e.data);
      // }
    }
  }
};
</script>
<style>

</style>
