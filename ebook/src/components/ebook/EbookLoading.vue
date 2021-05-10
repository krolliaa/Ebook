<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
  import {px2rem} from '../../utils/utils'

  export default {
    name: "EbookLoading",
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          {value: 0},
          {value: 0},
          {value: 0},
          {value: 0},
          {value: 0},
          {value: 0}
        ],
        lineWidth: [
          {value: 16},
          {value: 16},
          {value: 16},
          {value: 16},
          {value: 16},
          {value: 16}
        ],
        add: true,
        end: false
      }
    },
    mounted() {
      this.task = window.setInterval(() => {
        this.$refs.mask.forEach((item, index) => {
          const line = this.$refs.line[index];
          const mask = this.$refs.mask[index];
          let lineWidth = this.lineWidth[index];
          let maskWidth = this.maskWidth[index];

          // 上面线条移动到一半时下面才移动
          // 当this.add为true时,且mask长度小于16，lineWidth减少
          // 当this.add为false时，且line长度小于16，lineWidth增加
          // 后面的线条只不过在上面两条基础之上加了一个条件：
          // 上面的线条超过一半下面的线条才开始移动
          if (index === 0) {
            if (this.add && maskWidth.value < 16) {
              maskWidth.value++;
              lineWidth.value--;
            } else if (!this.add && lineWidth.value < 16) {
              console.log(this.add);
              maskWidth.value--;
              lineWidth.value++;
            }
          } else {
            // 只有当上一个移动到一半才移动
            // 当 maskWidth 在增大时，此时 maskWidth.value < 16
            if (this.add && maskWidth.value < 16) {
              let preMaskWidth = this.maskWidth[index - 1];
              if (preMaskWidth.value > 8) {
                maskWidth.value++;
                lineWidth.value--;
              }
            } else if (!this.add && lineWidth.value < 16) {
              // 第二种情况：lineWidth 在增大，此时 lineWidth < 16
              let preLineWidth = this.lineWidth[index - 1];
              if (preLineWidth.value > 8) {
                lineWidth.value++;
                maskWidth.value--;
              }
            }
          }

          // 添加到 DOM
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`

          // 判断是否到头，到头就重新，形成循环
          // 当是最后一条线条的时候即第六条线条时，
          // 当maskWidth在增加的时候，此时add为true，当增加到16的时候，end转为true
          // 或者当maskWidth为0时，此时add为false，增加的是lineWidth，此时lineWidth为16，end也要转为true
          if (index === this.maskWidth.length - 1) {
            if (this.add) {
              if (maskWidth.value === 16) {
                this.end = true;
              }
            } else {
              if (maskWidth.value === 0) {
                this.end = true;
              }
            }
          }

          // 当end为true时，转换add目标，互换lineWidth和maskWidth加加减减的身份
          // 并将end转为false
          if (this.end) {
            this.add = !this.add;
            this.end = false;
          }
        });
        // 可以根据需要调节速度
      }, 10);
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);

    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;

      .ebook-loading-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: px2rem(7) 0;
        box-sizing: border-box;

        .ebook-loading-line-wrapper {
          flex: 1;
          padding: 0 px2rem(7);
          box-sizing: border-box;
          @include left;

          .ebook-loading-line {
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }

          .ebook-loading-mask {
            flex: 0 0 0;
            width: 0;
            height: px2rem(2);
          }
        }
      }

      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }
</style>
