<template>
  <div class="search-bar-wrapper">
    <div class="title-search-wrapper" :class="{'show-search': ifShowSearchPage, 'hide-shadow': ifHideShadow}"
         ref="titleSearchWrapper">
      <transition name="title">
        <!--搜索页显示时不显示标题栏-->
        <div class="title-search-page-wrapper" v-show="!ifShowSearchPage">
          <span class="title-text">{{$t('home.title')}}</span>
          <div class="icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <!--这里把返回按钮单独拿出来了，因为返回按钮在标题隐藏时不跟着隐藏-->
      <div class="icon-back-wrapper" :class="{'show-search': ifShowSearchPage}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-wrapper" :class="{'show-search': ifShowSearchPage}">
        <div class="search-back-wrapper" :class="{'show-search': ifShowSearchPage}">
          <span class="icon-back icon" :class="{'show-search': ifShowSearchPage}"></span>
        </div>
        <div class="search-bg">
          <span class="icon-search icon"></span>
          <input type="text" class="search" :placeholder="$t('home.hint')" v-model="searchText"
                 @click="showSearchPageAndHotSearch" @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <transition name="host-search">
      <div class="hot-search-wrapper" v-if="ifShowSearchPage && ifShowHotSearch" ref="searchMaskWrapper">
        <hot-search :label="$t('home.hotSearch')"
                    :btn="$t('home.change')"
                    :hotSearch="searchList.hotSearch"></hot-search>
        <div class="line"></div>
        <hot-search :label="$t('home.historySearch')"
                    :btn="$t('home.clear')"
                    :hotSearch="searchList.historySearch"></hot-search>
      </div>
    </transition>
  </div>
</template>

<script>
  import {realPx} from "../../utils/utils";
  import HotSearch from "./HotSearch";

  export default {
    name: "searchBar",
    props: {
      ifShowSearchPage: {
        type: Boolean,
        default: false
      },
      ifShowHotSearch: {
        type: Boolean,
        default: true
      },
      bookListOffsetY: Number
    },
    components: {
      HotSearch
    },
    data() {
      return {
        searchList: {
          hotSearch: [
            {
              type: 1,
              text: 'Self-Reported Population Health',
              num: '1.8万'
            },
            {
              type: 1,
              text: 'Library and Information Sciences',
              num: '1.1万'
            },
            {
              type: 1,
              text: 'Global Business Strategy',
              num: '1.3万'
            },
            {
              type: 1,
              text: 'Corporate Data Quality',
              num: '1.0万'
            },
            {
              type: 1,
              text: 'Verrechnungspreise',
              num: '3.9万'
            }
          ],
          historySearch: [
            {
              type: 2,
              text: 'Computer Science'
            },
            {
              type: 1,
              text: 'Building the Infrastructure for Cloud Security'
            },
            {
              type: 2,
              text: 'ePub'
            },
            {
              type: 2,
              text: 'api'
            },
            {
              type: 2,
              text: 'Vue.js'
            },
            {
              type: 2,
              text: 'Nginx'
            },
            {
              type: 2,
              text: 'Java'
            },
            {
              type: 2,
              text: 'hdfs'
            },
            {
              type: 2,
              text: 'vuejs'
            },
            {
              type: 2,
              text: 'es6'
            },
            {
              type: 2,
              text: 'Intel'
            },
            {
              type: 1,
              text: 'Pro Git'
            },
            {
              type: 2,
              text: 'imooc'
            },
            {
              type: 2,
              text: 'Education'
            },
            {
              type: 2,
              text: 'Springer'
            },
            {
              type: 2,
              text: 'Environment'
            }
          ]
        },
        ifHideShadow: true,
        searchText: null
      }
    },
    methods: {
      setKeyword(keyword) {
        this.searchText = keyword
        this.searchList.historySearch.push(keyword)
      },
      // 搜索是展示列表页面
      search() {
        this.$router.push({
          path: '/book-store/list',
          query: {
            keyword: this.searchText
          }
        })
      },
      hideHotSearch() {
        this.$emit('update:ifShowHotSearch', false)
      },
      // 显示阴影
      showShadow() {
        this.ifHideShadow = false
      },
      // 隐藏阴影
      hideShadow() {
        this.ifHideShadow = true
      },
      showSearchPageAndHotSearch() {
        // 显示搜索页面 => 在BookHome.vue
        this.showSearchPage();
        // 隐藏阴影
        this.hideShadow();
        // 显示热门搜索 => 将ifShowHotSearch改为true
        this.$emit('update:ifShowHotSearch', true)
        // 所有DOM显示完毕初始化热门搜索
        this.$nextTick(() => {
          this.initHotSearch()
        })
      },
      back() {
        // 设置问文框内容为空
        this.searchText = '';
        // 如果显示了搜索展示的页面
        if (this.ifShowSearchPage) {
          // 将滚动条至上，回到原来位置
          if (this.bookListOffsetY <= 0) {
            // 隐藏搜索展示的页面
            this.hideSearchPage();
          } else {
            // 如果显示了热门搜索
            if (this.ifShowHotSearch) {
              // 隐藏热门搜索
              this.hideHotSearch();
              // 隐藏阴影
              this.showShadow()
            } else {
              // 否则什么都没显示回到书架
              this.$router.push('/book-store/shelf')
            }
          }
        } else {
          this.$router.push('/book-store/shelf')
        }
        this.$emit('back')
      },
      // 隐藏搜索页面
      hideSearchPage() {
        this.$emit('update:ifShowSearchPage', false)
        this.ifHideShadow = true
      },
      // 显示搜索页面
      showSearchPage() {
        this.$emit('update:ifShowSearchPage', true)
      },
      // 显示自动推荐盒子
      showFlapCard() {
        this.$emit('showFlapCard')
      },
      // 处理滚动条
      handleScroll(e) {
        const target = e.target
        if (target) {
          if (target.scrollTop > 0) {
            this.ifHideShadow = false
          } else {
            this.ifHideShadow = true
          }
        }
      },
      // 显示热门搜索界面
      initHotSearch() {
        if (this.$refs.searchMaskWrapper) {
          // 显示的高度要减去上面搜索框的高度，要不然会覆盖
          this.$refs.searchMaskWrapper.style.height = window.innerHeight - realPx(52) + 'px'
          // 添加 scroll 滚动事件
          this.$refs.searchMaskWrapper.addEventListener('scroll', this.handleScroll)
          // 每次点击进入都会显示在顶部，所以这里scollTo为0,0位置
          this.$refs.searchMaskWrapper.scrollTo(0, 0)
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .search-bar-wrapper {
    .title-search-wrapper {
      position: relative;
      z-index: 110;
      width: 100%;
      height: px2rem(94);
      background: white;
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

      &.show-search {
        height: px2rem(52);
      }

      &.hide-shadow {
        box-shadow: none;
      }

      .title-search-page-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 105;
        width: 100%;
        height: px2rem(42);
        @include center;

        .title-text {
          font-weight: bold;
        }

        .icon-shake-wrapper {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 110;
          padding-right: px2rem(10);
          height: 100%;
          @include center;
        }
      }

      .icon-back-wrapper {
        position: absolute;
        left: px2rem(10);
        top: 0;
        z-index: 110;
        height: px2rem(42);
        @include center;
        transition: all $homeAnimationTime linear;

        &.show-search {
          height: px2rem(52);
        }
      }

      .search-wrapper {
        position: absolute;
        top: px2rem(42);
        left: 0;
        z-index: 100;
        display: flex;
        padding: px2rem(10);
        width: 100%;
        box-sizing: border-box;
        transition: all $homeAnimationTime linear;

        &.show-search {
          top: 0;
        }

        .search-back-wrapper {
          flex: 0;
          width: 0;
          @include center;
          transition: all $homeAnimationTime linear;
          visibility: hidden;

          &.show-search {
            margin-right: px2rem(10);
            flex: 0 0 px2rem(20);
            width: px2rem(20);
          }

          .icon-back {
            font-size: 0;

            &.show-search {
              font-size: px2rem(20);
            }
          }
        }

        .search-bg {
          flex: 1;
          background: #f4f4f4;
          border-radius: px2rem(20);
          border: px2rem(1) solid #eee;
          box-sizing: border-box;
          padding: px2rem(5) px2rem(15);
          transition: all $homeAnimationTime linear;
          @include left;

          .icon-search {
            font-size: px2rem(16);
            color: #999;
          }

          .search {
            color: #666;
            width: 100%;
            height: px2rem(22);
            background: transparent;
            font-size: px2rem(12);
            margin-left: px2rem(10);
            border: none;

            &:focus {
              outline: none;
            }

            &::-webkit-input-placeholder {
              color: #ccc;
            }
          }
        }
      }
    }

    .hot-search-wrapper {
      width: 100%;
      height: 100%;
      background: white;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .line {
        width: 100%;
        height: 0;
        border-top: px2rem(1) solid #eee;
        margin: px2rem(10) 0;
      }
    }
  }
</style>
