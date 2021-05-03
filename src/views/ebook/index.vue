<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
  import EbookReader from "../../components/ebook/EbookReader";
  import EbookTitle from "../../components/ebook/EbookTitle";
  import EbookMenu from "../../components/ebook/EbookMenu";
  import {ebookMixin} from "../../utils/mixin";
  import {getReadTime, saveReadTime} from "../../utils/localStorage";

  export default {
    name: "index",
    mixins: [ebookMixin],
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu
    },
    methods: {
      // 计时方法
      startLoopReadTime() {
        let readTime = getReadTime(this.getFileName);
        // 如果本地存储没有阅读时间，就将阅读时间设置为 0，否则就在 readTime 基础之上计时，使用循环计时器计时
        if (!readTime) {
          readTime = 0;
        }
        // 获取定时器 ID 为 this.task
        this.task = setInterval(() => {
          readTime++;
          // 每半分钟存储一次
          if (readTime % 30 === 0) {
            saveReadTime(this.getFileName, readTime);
          }
        }, 1000);
      }
    },
    // 在挂载的时候就开始计时
    mounted() {
      this.startLoopReadTime();
    },
    // 在生命周期摧毁之前关闭定时器
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task);
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/styles/global.scss";
</style>
