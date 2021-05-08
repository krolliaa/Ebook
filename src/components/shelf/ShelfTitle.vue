<template>
  <transition name="fade">
    <div class="shelf-title-wrapper" :class="{'hide-shadow': ifHideShadow}">
      <div class="title">
        <span class="title-text">{{title}}</span>
        <span class="sub-title-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="btn-text-wrapper" @click="onEditClick">
        <span class="btn-text">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <div class="btn-clear-wrapper" @click="clearCache">
        <span class="btn-clear">{{$t('shelf.clearCache')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>

  export default {
    data() {
      return {
        ifHideShadow: true
      }
    },
    props: {
      isEditMode: Boolean,
      isShowBack: Boolean,
      ifShowClear: Boolean,
      data: Array,
      title: String
    },
    components: {},
    computed: {
      selectedText() {
        // 如果等于0直接显示选择书籍
        // 不等于0显示选择多少本书籍
        return this.selectedNumber === 0 ? this.$t('shelf.selectBook') : (this.selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', this.selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', this.selectedNumber));
      },
      selectedNumber() {
        return 1;
      }
    },
    methods: {
      clearCache() {
        this.$emit('clearCache');
      },
      onEditClick() {
        // 判断是不是编辑模式，不是就更换为编辑模式
        // 是就显示取消样式
        if (this.isEditMode) {
          this.$emit('onEditClick', false);
        } else {
          this.$emit('onEditClick', true);
        }
      },
      showShadow() {
        this.ifHideShadow = false
      },
      hideShadow() {
        this.ifHideShadow = true
      },
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title-wrapper {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    .title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 110;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }

      .sub-title-text {
        font-size: px2rem(10);
        color: #333;
      }
    }

    .btn-text-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 115;
      padding-right: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;

      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }

    .btn-clear-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;

      .btn-clear {
        font-size: px2rem(14);
        color: #666;
      }
    }

    .btn-back-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      font-size: px2rem(20);
      color: #666;
      @include center;

      &:active {
        color: rgba(102, 102, 102, .5);
      }

      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }
  }
</style>
