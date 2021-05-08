<template>
  <div class="book-shelf">
    <!--isEditMode 是否进入编辑模式-->
    <!--bookList 传入书籍列表数据-->
    <!--ifShowBack 是否显示返回按钮-->
    <!--ifShowClear 是否显示清除缓存按钮-->
    <!--onEditClick 编辑功能，加.sync是为了获取子组件传递进来的值-->
    <!--clearCache 清除缓存功能-->
    <!--clearCache 清除缓存功能-->
    <!--ref="shelfTitle" 添加标签方便获取DOM-->
    <!--ifShowTitle 是否显示标题-->
    <shelf-title class="shelf-title"
                 :title="$t('shelf.title')"
                 :isEditMode.sync="isEditMode"
                 :data="bookList"
                 :ifShowBack="ifShowBack"
                 :ifShowClear="ifShowClear"
                 @onEditClick="onEditClick"
                 @clearCache="clearCache"
                 ref="shelfTitle"
                 v-show="ifShowTitle"></shelf-title>
    <scroll class="book-shelf-scroll-wrapper" :top="0" @onScroll="onScroll" ref="scroll">
      <shelf-search @onSearchClick="onSearchClick"
                    @onCancel="onSearchCancel"
                    ref="shelfSearch"></shelf-search>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div style="height: 50px!important;">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
<!--      <shelf class="book-shelf-list"-->
<!--                  :data="bookList"-->
<!--                  :isEditMode="isEditMode"-->
<!--                  ref="bookShelf"></shelf>-->
    </scroll>
  </div>
</template>

<script>
  import ShelfTitle from "../../components/shelf/ShelfTitle";
  import ShelfSearch from "../../components/shelf/ShelfSearch";
  import Scroll from "../../components/common/Scroll";
  import {realPx} from "../../utils/utils";

  export default {
    components: {
      Scroll,
      ShelfTitle,
      ShelfSearch
    },
    computed: {},
    data() {
      return {
        bookList: [], // 书架书籍
        ifShowTitle: true, // 是否显示标题 默认显示
        isEditMode: false, // 是否处于编辑模式 默认不显示
        ifShowBack: false, // 是否显示返回按钮 默认不显示
        ifShowClear: true, // 是否显示清除缓存按钮 默认显示
      }
    },
    methods: {
      onScroll(offsetY) {
        // 偏移量大于了54（搜索框高度）了
        if (offsetY > realPx(54)) {
          // 标题栏显示阴影
          this.$refs.shelfTitle.showShadow();
          // 如果标题没显示，那说明搜索框显示了，那么给搜索框添加阴影
          if (!this.ifShowTitle) {
            this.$refs.shelfSearch.showShadow()
          }
        } else {
          // 如果偏移量不够那么隐藏阴影
          this.$refs.shelfTitle.hideShadow()
          if (this.$refs.shelfSearch) {
            this.$refs.shelfSearch.hideShadow()
          }
        }
      },
      onEditClick(v) {
        this.isEditMode = v;
      },
      clearCache() {
        alert("点了清除");
      },
      onSearchClick() {
        // 回到不编辑模式
        this.onEditClick(false);
        // 隐藏标题
        this.hideTitle();
      },
      // 点击取消，显示标题栏，v-if/v-else决定显示中英文翻译按钮还是取消按钮
      onSearchCancel() {
        this.showTitle();
      },
      // 显示标题
      showTitle() {
        this.ifShowTitle = true
      },
      // 隐藏标题
      hideTitle() {
        this.ifShowTitle = false
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    font-size: 0;

    .shelf-title {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 110;
    }

    .book-shelf-list {
      position: absolute;
      top: px2rem(93.5);
      left: 0;
      z-index: 100;
    }

    .book-shelf-empty {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 100;
    }

    .book-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      background: white;
    }

    .book-shelf-scroll-wrapper2 {
      position: absolute;
      top: px2rem(93.5);
      left: 0;
      z-index: 101;
    }
  }
</style>
