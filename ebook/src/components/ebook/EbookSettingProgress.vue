<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="getMenuVisible && getSettingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range" min="0" max="100" step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)" :value="getProgress"
                 :disabled="!getBookAvailable" ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{getBookAvailable ? getProgress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from "../../utils/mixin";

  export default {
    name: "EbookSettingProgress",
    mixins: [ebookMixin],
    updated() {
      this.updateProgressBg();
    },
    methods: {
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.displayProgress();
          this.updateProgressBg();
        })
      },
      // 跳转到进度页面
      displayProgress() {
        const cfi = this.getCurrentBook.locations.cfiFromPercentage(this.getProgress / 100);
        this.display(cfi);
      },
      // 拖动进度条小球改变进度百分比
      onProgressInput(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg();
        });
      },
      // 更新进度条
      updateProgressBg() {
        this.$refs.progress.style.backgroundSize = `${this.getProgress}% 100%`;
      },
      // 上一章
      prevSection() {
        if (this.getSection > 0 && this.getBookAvailable) {
          this.setSection(this.getSection - 1).then(() => {
            // 显示内容
            this.displaySection();
          })
        }
      },
      // 下一章
      nextSection() {
        if (this.getSection < this.getCurrentBook.spine.length - 1 && this.getBookAvailable) {
          this.setSection(this.getSection + 1).then(() => {
            // 显示内容
            this.displaySection();
          })
        }
      },
      displaySection() {
        const sectionInfo = this.getCurrentBook.section(this.getSection);
        if (sectionInfo && sectionInfo.href) {
          this.display(sectionInfo.href);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 160;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;

      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }

      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .progress-icon-wrapper {
          font-size: px2rem(20);
        }

        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);

          &:focus {
            outline: none;
          }

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }

      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;

        .progress-section-text {
          @include ellipsis;
        }
      }
    }
  }
</style>
