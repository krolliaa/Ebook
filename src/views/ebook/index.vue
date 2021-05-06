<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
  import EbookHeader from "../../components/ebook/EbookHeader";
  import EbookReader from "../../components/ebook/EbookReader";
  import EbookTitle from "../../components/ebook/EbookTitle";
  import EbookMenu from "../../components/ebook/EbookMenu";
  import EbookBookmark from "../../components/ebook/EbookBookmark";
  import EbookFooter from "../../components/ebook/EbookFooter";
  import {ebookMixin} from "../../utils/mixin";
  import {getReadTime, saveReadTime} from "../../utils/localStorage";

  export default {
    name: "index",
    mixins: [ebookMixin],
    components: {
      EbookHeader,
      EbookReader,
      EbookTitle,
      EbookMenu,
      EbookBookmark,
      EbookFooter
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
      },
      // 下拉
      move(v) {
        this.$refs.ebook.style.top = v + 'px';
      },
      // 弹回
      restore() {
        this.$refs.ebook.style.top = 0 + 'px';
        // 添加动画效果,每次改变 v 都会产生 0.2s 动画
        this.$refs.ebook.style.transition = 'all .2s linear';
        // 所以这里等待 0.2s ，等待动画执行完毕之后清除动画
        window.setTimeout(() => {
          this.$refs.ebook.style.transition = '';
        }, 200);
      }
    },
    watch: {
      // v 是新传入的 offsetY 的值
      getOffsetY(v) {
        // 只有菜单栏和标题栏隐藏以及图书未解析完毕才不显示
        if (!this.getMenuVisible && this.getBookAvailable)
          // 如果 v > 0 就下拉，等于 0 就弹回
          if (v > 0) {
            this.move(v);
          } else if (v === 0) {
            this.restore();
          }
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

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
