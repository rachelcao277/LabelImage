<template>
  <div class="about">
      <header >
          <a-icon type="dashboard" />AI模型的管理和发布
      </header>
      <a-card style="margin-top:15px;margin-bottom:15px;" title="AI模型的管理和发布">

        <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" >
          <!-- <a-tabs default-active-key="1" >
            <a-tab-pane key="1" tab="训练参数"> -->
                <a-form-item label="选择模型" help="">
                  <a-select
                    v-model="SelectedAIModel"
                    :default-active-first-option="true"
                    :show-arrow="true"
                    :filter-option="true"
                    :not-found-content="null"
                    >
                        <template  v-for="dset in AIModelList">
                          <a-select-option :key="dset" :value="dset">
                            {{ dset }}
                          </a-select-option>
                        </template>
                  </a-select>

                  <a-button-group>
                    <a-button type="primary"   @click="DeployAIModel()"><a-icon type="play-circle" />发布模型</a-button>
                    <a-button  @click="ViewAIModel()"><a-icon type="deployment-unit" />查看模型</a-button>
                    <a-button type="danger" @click="DeleteAIModel()"><a-icon type="delete" />删除模型</a-button>
                  </a-button-group>
                </a-form-item>
            <!-- </a-tab-pane>
          </a-tabs> -->
        </a-form>
      </a-card>
  </div>
</template>
<script lang="ts">
// import Vue from 'vue';

// function getBase64(file: any) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }
export default {
  data() {
    return {
      SelectedAIModel: '',
      loading: false,
      AIModelList: ['请选择一个AI模型']
    };
  },
  mounted() {
    this.GetWeightsModelList();
  },
  methods: {
    DeployAIModel() {
      // alert('DeployAIModel');
      this.$post({
        url: '/Train/DeployAIModel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: {
          'SelectedAIModel': this.SelectedAIModel
        }
      })
        .then((res: any) => {
          if (res.success) {
            this.AIModelList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }).catch((err: any) => {
          console.log(err);
          this.$message.error('加载模型文件列表失败');
        });
    },
    ViewAIModel() {
      this.$message.error('暂未实现');
      return;
      // this.$post({
      //   url: '/Train/ViewAIModel',
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'application/json;charset=UTF-8'
      //   },
      //   params: {
      //     'SelectedAIModel': this.SelectedAIModel
      //   }
      // })
      //   .then((res: any) => {
      //     if (res.success) {
      //       this.AIModelList = res.data;
      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   }).catch((err: any) => {
      //     console.log(err);
      //     this.$message.error('加载模型文件列表失败');
      //   });
    },
    DeleteAIModel() {
      // alert('DeleteAIModel');
      if (confirm('确定要删除这个模型么? 不可恢复哦.')) {
        this.$post({
          url: '/Train/DeleteAIModel',
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          params: {
            'SelectedAIModel': this.SelectedAIModel
          }
        })
          .then((res: any) => {
            if (res.success) {
              for (let i = 0; i < this.AIModelList.length; i++) {
                if (this.AIModelList[i] === this.SelectedAIModel) {
                  this.AIModelList.splice(i, 1);
                  break;
                }
              }
              this.SelectedAIModel = '';
              this.$message.info(res.message);
            } else {
              this.$message.error(res.message);
            }
          }).catch((err: any) => {
            console.log(err);
            this.$message.error('加载模型文件列表失败');
          });
      }
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
            this.AIModelList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }).catch((err: any) => {
          console.log(err);
          this.$message.error('加载模型文件列表失败');
        });
    }
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
