<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="getFontFamilyPopUpVisible">
      <div class="ebook-popup-title">
        <!-- 分为两部分，左侧向下图标[点击时字体样式栏消失]和中间标题 -->
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) in fontFamilyList" :key="index"
             @click="setFontFamily(item.fontFamily)">
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item.fontFamily)}">{{item.fontFamily}}
          </div>
          <div class="ebook-popup-item-check" v-if="isSelected(item.fontFamily)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin.js';
  import {FONT_FAMILY} from '../../utils/book.js'
  import {setFontFamily} from "../../utils/localStorage";

  export default {
    name: "EbookSettingFontPopUp",
    mixins: [ebookMixin],
    data() {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      hide() {
        this.setFontFamilyPopUpVisible(false);
      },
      isSelected(fontFamily) {
        return this.getDefaultFontFamily === fontFamily;
      },
      setFontFamily(fontFamily) {
        // 将设置好的字体样式存储在 localStorage 中
        this.setDefaultFontFamily(fontFamily);
        setFontFamily(this.getFileName, fontFamily);
        // 如果是默认字体
        if (fontFamily === 'Default') {
          this.getCurrentBook.rendition.themes.font('Times New Roman');
        } else {
          this.getCurrentBook.rendition.themes.font(fontFamily);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);

    .ebook-popup-title {
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;

      .ebook-popup-title-icon {
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        font-size: px2rem(16);
        font-weight: bold;
        @include center;
      }

      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
    }

    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);

        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;

          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }

        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
