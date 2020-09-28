<template>
     <a-row>
      <a-modal v-model="visibleCreateLabelModal" title="新增标签" @ok="handlerCreateLabel">
        请输入标签名:<a-input v-model="NewLabelSetName" />
        数据获取方式.  默认为自动爬取图像.  手工上传,由于数据太多请使用ftp方式上传.
      </a-modal>

      <a-col :span="4">
       <div class="table-page-search-wrapper">
        <a-form layout="inline">
            <a-button style="width:100%" v-on:click="visibleCreateLabelModal=true " >
              <a-icon key="plus" type="plus" /> 新增
            </a-button>
            <a-input-search placeholder="请输入关键词" style="width:100%" @search="GetLabels" />

            <a-list item-layout="horizontal" bordered  :data-source="labelSets">
              <a-list-item slot="renderItem" slot-scope="item" v-on:click="handleGetImagesByLabel(item)" style="cursor: pointer;">
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
        <!-- <a-pagination v-model="this.currentPageIndex" :default-current="6" :total="this.currentLabel.FileCount" show-less-items /> -->

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
              <img v-bind:alt="image.imagefile" v-bind:src="image.httpurl" style="width:100%;height:10vw;" />
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
// import Vue from 'vue';
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
      visibleCreateLabelModal: false,
      NewLabelSetName: '',
      labelSets: [],
      imageSets: [],
      currentLabel: { 'LabelSetName': '请选择图片标签', 'FileCount': 0 },
      DatasetName: dsname,
      dataSource: [],
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
    this.GetLabels();
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
      this.handleGetImagesByLabel(this.currentLabel);
    },
    getRandomInt(max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    handleGetImagesByLabel(item) {
      this.currentLabel = item;
      //  alert("handleGetImagesByLabel")
      console.log(item.LabelSetName);
      this.$post({
        url: '/DatasetManage/GetImages',
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
            image.httpurl = '/static/yishanchu.jpg';
            // _imageSets.splice(_index, 1);
          } else {
            alert(res.message);
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

    /* background-image: url(/your/image/path.jpg);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat; */
}

.imagecard img {
  width:100%;
  height:16vw
}

</style>
