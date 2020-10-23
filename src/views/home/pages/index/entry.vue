<template>
  <div class="home">
     <div class="preview__inner-2 markdown_views prism-atom-one-dark" style="padding: 10px 16px 305px;"><div class="cl-preview-section"><p>本系统实现了将AI模型训练的各个环节集中管理功能,将分散的节点统一到一个平台上来.  降低了运维的成本和难度.</p>
      </div><div class="cl-preview-section"><p>本系统支持的 AI模型训练工作流程如下:</p>
      </div><div class="cl-preview-section"><ol>
      <li>创建数据集,</li>
      <li>手工上传图片或自动抓取(自动抓取的图片需要人工再筛选一遍.)</li>
      <li>开始标注</li>
      <li>开始训练</li>
      <li>模型评估(不达标则重复第4步)</li>
      <li>模型发布</li>
      </ol>
      </div><div class="cl-preview-section"><p>为支持此工作流程本系统由一下三大模块组成</p>
      </div><div class="cl-preview-section"><ol>
      <li>图片数据的管理和采集</li>
      <li>图片标注</li>
      <li>视觉相关AI框架的训练和测试</li>
      </ol>
      </div><div class="cl-preview-section"><h2><a id="_15"></a>图片数据采集和管理</h2>
      </div><div class="cl-preview-section"><p>类似计算机中的资源管理器, 主要包含以下4个主要功能.</p>
      </div><div class="cl-preview-section"><ol>
      <li>图片的归类</li>
      <li>图片删除功能</li>
      <li>图片的自动采集</li>
      <li>手工上传.</li>
      </ol>
      </div><div class="cl-preview-section"><h2><a id="_23"></a>图片标注</h2>
      </div><div class="cl-preview-section"><p>主要作用是对图片数据进行标注, 主要包含了以下几个主要功能</p>
      </div><div class="cl-preview-section"><ol start="5">
      <li>在线标注功能</li>
      <li>标签管理</li>
      <li>矩形框标注功能,  (for 目标检测)</li>
      <li>多边形标注功能,  (for 语义分割,实例分割)</li>
      <li>保存时自动生成Yolo格式的标注数据.</li>
      </ol>
      </div><div class="cl-preview-section"><h2><a id="AI_34"></a>视觉相关AI框架的训练和测试</h2>
      </div><div class="cl-preview-section"><p>主要作用是使得普通用户也能对AI模型进行训练,无需程序员参与,简化了训练的难度, 主要包含了以下几个主要功能</p>
      </div><div class="cl-preview-section"><ol>
      <li>数据集选择和预处理</li>
      <li>AI模型选择</li>
      <li>AI模型超参数设置</li>
      <li>训练可视化</li>
      <li>模型评估</li>
      <li>模型发布</li>
      </ol>
      </div><div class="cl-preview-section"><p>本系统的<strong>数据集</strong> 例如(动物数据集) 下面有很多<strong>关键词</strong> 例如:(猫,狗,狮子), 每个关键词下面有很多与此关键词相关的图片.  关键词在新增的时候要尽量让关键词具体到位,例如: <strong>苹果手机</strong>,比<strong>苹果</strong> 更加具体到位.在自动采集的时候会用到此关键词.</p>
      </div><div class="cl-preview-section"><p>每个关键词下的图片可以<strong>手工上传</strong>也可以 <strong>自动采集</strong>(自动从百度抓取)<br>
      因为自动采集的图片无法保证100% 与关键词一致,  也无法保证图片是有效的. <strong>自动采集的图片需要先人工筛选 一遍,把不需要的图片删掉即可</strong>.</p>
      </div></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import HelloWorld from '@/common/components/HelloWord/index.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    // HelloWorld
  }
});
</script>

<style lang="less" scoped>
.logo {
  width: 50%;
}
</style>

