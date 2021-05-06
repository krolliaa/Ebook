<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} · {{bookmark ? bookmark.length : 0}}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index"
           @click="displayBookmark(item.cfi)">
        <div class="slide-bookmark-item-icon">
          <div :class="{'icon-bookmark': isDisplayIcon(item.text)}"></div>
        </div>

        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../common/Scroll'
  import {getBookmark} from '../../utils/localStorage'
  import {ebookMixin} from '../../utils/mixin'

  export default {
    name: "EbookSlideBookmark",
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    data() {
      return {
        bookmark: null
      }
    },
    methods: {
      displayBookmark(target) {
        this.display(target, () => {
          this.hideTittleAndMenu()
        })
      },
      isDisplayIcon(itemText) {
        // 通过结合getIsBookmark 和本地存储的标签判断是否显示图标
        if (this.getIsBookmark) {
          if (itemText == this.getBookText)
            return true;
        } else {
          return false;
        }
      }
    }
    ,
    mounted() {
      this.bookmark = getBookmark(this.getFileName);
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-slide-bookmark {
    width: 100%;

    .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include left;
    }

    .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .slide-bookmark-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;

        .slide-bookmark-item-icon {
          flex: 0 0 px2rem(29);
          @include left;

          .icon-bookmark {
            width: px2rem(20);
            height: px2rem(20);
            font-size: px2rem(12);
            border-radius: 50%;
            background: #bbb;
            @include center;
          }
        }

        .slide-bookmark-item-text {
          font-size: px2rem(14);
          line-height: px2rem(15);
          max-height: px2rem(45);
          @include ellipsis2(3);
        }
      }
    }
  }
</style>
