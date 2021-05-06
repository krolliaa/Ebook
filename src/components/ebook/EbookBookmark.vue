<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import {realPx} from '../../utils/utils'
  import Bookmark from "../common/Bookmark";
  import {ebookMixin} from "../../utils/mixin";
  import {saveBookmark, getBookmark, getLocalStorage} from "../../utils/localStorage";

  const BLUE = '#346cbc';
  const WHITE = '#fff';
  const CRIMSON = '#dc123c'
  export default {
    name: "EbookBookmark",
    mixins: [ebookMixin],
    components: {
      Bookmark
    },
    data() {
      return {
        text: '',
        color: CRIMSON,
        isFixed: false
      }
    },
    watch: {
      getOffsetY(v) {
        if (!this.getBookAvailable || this.getMenuVisible || this.getSettingVisible >= 0) {
          return;
        }
        // 如果在 35 以内表示在状态 1
        if (v >= this.height && v < this.threshold) {
          // 如果下拉偏移量大于等于35并且小于满足添加书签的条件即为状态2：未达到零界状态
          this.beforeThreshold(v);
        } else if (v >= this.threshold) {
          // 如果偏移量大于 35 表示添加书签，即为状态3：满足零界状态
          this.afterThreshold(v);
        } else if (v > 0 && v < this.height) {
          this.beforeHeight();
        } else if (v === 0) {
          // v 为 0 复原
          this.restore();
        }
      },
      getIsBookmark(isBookmark) {
        this.isFixed = isBookmark;
        if (isBookmark) {
          this.color = CRIMSON
        } else {
          this.color = WHITE
        }
      }
    },
    computed: {
      // 吸顶阶段
      height() {
        return realPx(35);
      },
      // 满足添加条件阶段
      threshold() {
        return realPx(55);
      },
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    methods: {
      // 状态1：未超过书签的高度
      beforeHeight() {
        if (this.getIsBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = CRIMSON
          this.isFixed = true
        } else {
          this.text = this.text = this.$t('book.pulldownAddMark');
          this.color = WHITE;
          this.isFixed = false;
        }
      },
      // 状态2：未到达零界状态
      beforeThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px`;
        const iconDown = this.$refs.iconDown;
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      // 状态3：超越零界状态 ==> 添加/删除书签
      afterThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px`;
        if (this.getIsBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = CRIMSON
          this.isFixed = true
        }
        // 旋转箭头
        const iconDown = this.$refs.iconDown;
        if (iconDown.style.transform === '' ||
          iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      },
      // 状态4：归位
      restore() {
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          this.setIsBookmark(true);
          // 这里还要添加书签位置到书签栏目中+本地存储中
          this.addBookmark();
        } else {
          this.setIsBookmark(false);
          // 这里还要将书签栏目中书签位置删除+删除本地存储
          this.removeBookmark();
        }
      },
      // 添加书签信息到书签栏+本地存储中
      addBookmark() {
        // 获取本地存储的书签信息
        this.bookmark = getBookmark(this.getFileName);
        // 如果书签信息不存在，则赋予一个空数组
        if (!this.bookmark) {
          this.bookmark = [];
        }
        // 获取当前位置
        const currentLocation = this.getCurrentBook.rendition.currentLocation();
        const cfiBase = currentLocation.start.cfi.replace(/!.*/, '');
        const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`;
        this.getCurrentBook.getRange(cfiRange).then(range => {
          let text = range.toString().replace(/\s\s/g, '');
          if (text.length === 1) {
            text = "Cover";
          }
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          });
          saveBookmark(this.getFileName, this.bookmark);
        });
      },
      // 将书签栏中书签信息删除+删除本地存储
      removeBookmark() {
        const currentLocation = this.getCurrentBook.rendition.currentLocation();
        const cfi = currentLocation.start.cfi;
        this.bookmark = getBookmark(this.getFileName);
        if (this.bookmark) {
          saveBookmark(this.getFileName, this.bookmark.filter(item => item.cfi !== cfi));
          this.setIsBookmark(false);
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);

    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;

      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }

      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }

    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>

