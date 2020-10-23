<template>
    <a-row>
        <a-card hoverable class="ant-col ant-col-6" style="margin-left: 10px;">
                <img slot="cover" style="width:100%; height:10vw; margin-bottom:10px; " alt="example" src="./cover/cover8.jpg" />
                <a-card-meta title="新增数据集" style="padding: 5px;" description="请点击下面的加号">
                <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"  /> -->
                </a-card-meta>
                <template slot="actions" class="ant-card-actions">
                  <a-icon key="edit" type="plus" @click="visibleCreateModal=true" />
                </template>
        </a-card>

      <a-modal v-model="visibleTagsManageModal" title="标签管理" @ok="SaveTags">
          <h1>{{EditingTagsDatasetName}}</h1>
          一行一个标签,保存在数据集下面Tags.txt文件中.
          <textarea v-model="TagsData" style="height:400px; width:100%;"></textarea>
      </a-modal>

        <a-modal v-model="visibleCreateModal" title="新建数据集" @ok="CreateDataset">
            <a-input placeholder="请输入数据集名称"  v-model="newDataset.name" max-length="20" style="border:1px solid red; margin-bottom:5px;"/>
            <a-input placeholder="简单的说明"  v-model="newDataset.description"  max-length="50" style=" margin-bottom:5px;"/>
            <!-- <a-input placeholder="请选择图片" v-model="newDataset.imageurl"  style=" margin-bottom:5px;"/> -->
            <!-- <a-row>
              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover1.jpg"  style="width:100%; height:10vw;"  @click="newDataset.imageurl=$event.currentTarget.src;"/>
              </a-card>

               <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover2.jpg"  style="width:100%; height:10vw; " @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>
            </a-row>
            <a-row>
              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover3.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>

              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover4.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>
            </a-row>
             <a-row>
              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover5.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>

              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover6.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>
            </a-row>
             <a-row>
              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover7.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>

              <a-card hoverable class="ant-col ant-col-11" style="margin: 1%;">
                <img  src="./cover/cover8.jpg"  style="width:100%;  height:10vw;" @click="newDataset.imageurl=$event.currentTarget.src;" />
              </a-card>
            </a-row> -->
        </a-modal>

        <a-modal v-model="visibleDeleteModal" title="危险操作警告!" @ok="handlerDeleteDataset">
              <div class="ant-modal-confirm-content" style="color:red;">
              你确定要删除此数据集么? 此操作不可恢复!!数据无价请谨慎操作.
              <br/>
              请先输入[ {{ConfirmText}} ] . 然后点击确认删除.
              </div>
              <a-input v-model="ConfirmDeleteKey" />
        </a-modal>

        <template v-for="(dset,indexx) in DataSets">
          <a-card v-bind:key="indexx" hoverable class="ant-col ant-col-6" style="margin-left: 10px; margin-bottom: 10px;">


                <router-link slot="cover" :to="{ name: 'DatasetImagemanage', params: { DatasetName: dset.name} }" replace >
                  <img style="width:100%; height:10vw; margin-bottom:10px;" :alt="dset.name" src="./cover/cover8.jpg" /> <!-- :src="dset.imageurl"  -->
                </router-link>

                <router-link :to="{ name: 'DatasetImagemanage', params: { DatasetName: dset.name} }" replace >

                   <a-card-meta style="padding: 5px;" :title="dset.name" :description="dset.description">
                  <!-- <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"  /> -->
                  </a-card-meta>
                </router-link>

                <template slot="actions" class="ant-card-actions">
                  <a-icon key="delete" type="delete" title="标签管理"  @click="visibleDeleteModal=true;WillDeleteDataSet=dset;WillDeleteDataSetIndex=indexx"/>
                  <a-icon key="tags" type="tags" title="标签管理" @click="visibleTagsManageModal=true;EditingTagsDatasetName=dset.name; GetTags()"/>
                </template>
                <!-- <template slot="actions" class="ant-card-actions">
                  <a-icon type="caret-right"  click="StartAutoGrab(dset)" title="运行"/>
                  <a-icon type="pause" click="StopAutoGrab(dset)" title="停止" />
                  <a-icon type="code"  click="GetProcessLog(dset)" title="查看日志"/>
                  <a-icon type="sync"  click="RefreshState(dset)" title="刷新" />
               </template> -->
          </a-card>
        </template>
    </a-row>

</template>

<script>
// import Vue from 'vue';
// import Antd from 'ant-design-vue';

// import { pagination } from 'ant-design-vue';

// import axiosPost from '@/common/utils/request';


export default {
  name: 'DatasetMangeIndex',
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
      visibleTagsManageModal: false,
      newDataset: {
        'name': '', 'description': '', 'imageurl': ''
      },
      TagsData: '',
      EditingTagsDatasetName: '',
      WillDeleteDataSet: {},
      WillDeleteDataSetIndex: -1,
      ConfirmDeleteKey: '',
      ConfirmText: '确认删除',
      DataSets: [
        // {"name":"Yolov5 数据集","description":"yolo5 121",  "imageurl":"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"},
      ],
      LabelsData: '',
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
    // 取得标签
    GetTags() {
      this.$post({
        url: '/DatasetManage/GetTags',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.EditingTagsDatasetName }
      })
        .then(res => {
          if (res.success) {
            // this.$message.info(res.message);
            this.TagsData = res.data;
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // 保存标签
    SaveTags() {
      // const _this = this;
      this.$post({
        url: '/DatasetManage/SaveTags',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: { 'DatasetName': this.EditingTagsDatasetName, 'TagsData': this.TagsData }
      })
        .then(res => {
          if (res.success) {
            this.$message.info(res.message);
          } else {
            this.$message.info(res.message);
          }
        });
    },
    // showDeleteConfirm(dset) {

    //   // var _this  = this;
    //   // this.$confirm({
    //   //   title: '危险操作警告!',
    //   //   content: '你确定要删除此数据集么? 此操作不可恢复!!数据无价请谨慎操作.',
    //   //   okText: '确定删除',
    //   //   okType: 'danger',
    //   //   cancelText: '不删除',
    //   //   onOk() {
    //   //     _this.DeleteDataset(dset);
    //   //   },
    //   //   onCancel() {
    //   //     console.log('Cancel');
    //   //   },
    //   // });
    // },

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
    }
  }
};
</script>
<style>

</style>
