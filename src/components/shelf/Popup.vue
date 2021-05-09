<template>
  <div class="popup" v-show="visible">
    <!--显示出一层蒙层-->
    <transition name="fade">
      <div class="popup-bg" v-show="popupVisible" @click.stop.prevent="hide" @touchmove.prevent></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="popupVisible">
        <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
        <div class="popup-confirm-btn" @click="third" v-if="thirdText && thirdText.length > 0">{{thirdText}}</div>
        <div class="popup-confirm-btn" :class="{'is-remove': isRemoveText}" @click="confirm">{{confirmText}}</div>
        <div class="popup-cancel-btn" @click="hide">{{cancelText}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Popup",
    props: {
      title: String,
      confirmText: String,
      isRemoveText: Boolean,
      cancelText: String,
      thirdText: String
    },
    data() {
      return {
        popupVisible: false,
        visible: false
      }
    },
    methods: {
      third() {
        console.log("third");
        this.hide()
        setTimeout(() => {
          this.$emit('third')
        }, 200);
      },
      confirm() {
        // 确认删除
        // 隐藏下拉框和蒙层
        // 因为这里放置在标题栏，所以跳转到ShelfTitle => onPopupDelete
        this.hide();
        this.$emit('confirm');
      },
      // 显示上拉框
      show() {
        // 这里当用户点击底部四大按钮时就会设置蒙层和上拉框为 true
        this.popupVisible = true
        this.visible = true
      },
      // 隐藏上拉框
      hide() {
        // 先隐藏下拉框
        this.popupVisible = false;
        // 经过2s再隐藏蒙层
        setTimeout(() => {
          this.visible = false
        }, 200);
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);

    .popup-bg {
      width: 100%;
      height: 100%;
    }

    .popup-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 2000;
      width: 100%;
      background: white;

      .popup-title {
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: px2rem(15);
        box-sizing: border-box;
        text-align: center;
        color: #999;
        @include center;
      }

      .popup-confirm-btn {
        width: 100%;
        height: px2rem(60);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;

        &.is-remove {
          color: $color-pink;
        }
      }

      .popup-cancel-btn {
        width: 100%;
        height: px2rem(60);
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;
      }
    }
  }
</style>
