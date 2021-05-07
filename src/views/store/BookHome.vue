<template>
  <div class="book-home">
    <search-bar
      @showFlapCard="showFlapCard"
      :ifShowSearchPage="ifShowSearchPage"
      :ifShowHotSearch="ifShowHotSearch"
      :bookListOffsetY="bookListOffsetY"
      @back="onBack"
      ref="searchBar"></search-bar>
    <!--只要不显示搜索框或者热门搜索就展示图书列表-->
    <div class="book-list-wrapper" v-show="!ifShowSearchPage || !ifShowHotSearch" ref="bookListWrapper">
      <!--图片栏目-->
      <div class="banner-wrapper">
        <div class="banner" :style="bannerStyle"></div>
      </div>
      <!--猜你喜欢栏目-->
      <guess-you-like></guess-you-like>
      <!--热门推荐栏目-->
      <recommend></recommend>
      <!--精选栏目-->
      <featured></featured>
      <!--各学科图书栏目-->
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <!--分类栏目-->
      <category></category>
    </div>
    <!--随机推荐栏目-->
    <!--
      只有当ifFlapCardShow才显示
      赋予关闭方法
      赋予数据data为随机值,random在SearchBar.vue组件点击时将执行showFlapCard方法
        为了方便管理，我们在SearchBar.vue组件中的点击emit到父组件即BookHome.vue组件这里来
      赋予ref值为flapCard方便获取当前DOM
    -->
    <flap-card v-if="ifFlapCardShow" @close="closeFlapCard" :data="random" ref="flapCard"></flap-card>
  </div>
</template>

<script>
  import SearchBar from "../../components/home/SearchBar";
  import GuessYouLike from "../../components/home/GuessYouLike";
  import Recommend from "../../components/home/Recommend";
  import Featured from "../../components/home/Featured";
  import CategoryBook from "../../components/home/CategoryBook";
  import Category from "../../components/home/Category";
  import FlapCard from "../../components/home/FlapCard";
  import {home2} from "../../api/book";
  import {getHome, saveHome, getLocalStorage, setLocalStorage} from "../../utils/localStorage";
  import {realPx} from "../../utils/utils";

  export default {
    name: "BookHome",
    components: {
      SearchBar,
      GuessYouLike,
      Recommend,
      Featured,
      CategoryBook,
      Category,
      FlapCard
    },
    data() {
      return {
        isBack: false,
        ifFlapCardShow: false,
        ifShowSearchPage: false,
        ifShowHotSearch: true,
        data: null,
        guessYouLike: null,
        bannerStyle: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null,
        random: null,
        randomList: null,
        bookListOffsetY: 0
      }
    },
    mounted() {
      // 获取本地存储的home
      const home = getHome();
      if (home) {
        this.parseHomeData(home)
      } else {
        home2().then(response => {
          // 获取从接口[/book/home]传递进来的数据
          if (response.status === 200 && response.data) {
            this.parseHomeData(response.data)
            saveHome(response.data)
          }
        }).catch((e) => {
          alert("页面出错了！");
        })
      }
      // 设置bookListWrapper DOM 的高度
      this.$refs.bookListWrapper.style.height = window.innerHeight - realPx(52) + 'px';
      // 设置滚动条
      this.$refs.bookListWrapper.addEventListener('scroll', this.handleBookListScroll)
      // 获取本地存储的偏移量
      this.bookListOffsetY = getLocalStorage('offsetY')

    },
    methods: {
      // 随机推荐栏目核心方法
      showFlapCard() {
        // 将ifFlapCardShow设为true
        this.ifFlapCardShow = true;
        const randomPrepare = Math.random() * this.randomList.length;
        const randomNumber = parseInt(randomPrepare, 10);
        // 赋予一个随机推荐的值，这里我们是使用mockjs来模拟后端接口，就不用后端数据了，节省时间
        // 获取随机图书信息
        this.random = this.randomList[randomNumber];
        this.$nextTick(() => {
          // 调用子组件 FlapCard 中的 startAnimation() 方法产生动画
          this.$refs.flapCard.startAnimation()
        })
      },
      parseHomeData(data) {
        this.data = data;
        // 获取猜你喜欢栏目的图书信息
        this.guessYouLike = data.guessYouLike;
        // 获取热门推荐栏目的图书信息
        this.recommend = data.recommend;
        // 获取精选栏目的图书信息
        this.featured = data.featured;
        // 获取各学科图书信息
        this.categoryList = data.categoryList;
        // 获取分类信息
        this.categories = data.categories;
        // 获取要随机抽取的图书列表信息
        this.randomList = data.random;
        // 获取书城首页图片连接，这里是一个css层叠样式
        this.bannerStyle = {
          backgroundImage: 'url(' + data.banner + ')'
        }
        // DOM 加载完毕后加载滚动条
        this.$nextTick(() => {
          if (this.bookListOffsetY) {
            this.$refs.bookListWrapper.scrollTo(0, this.bookListOffsetY)
          }
        });
      },
      onBack() {
        this.isBack = true
      },
      // 关闭自动推荐
      closeFlapCard() {
        this.$refs.flapCard.stopAnimation();
        this.ifFlapCardShow = false;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-home {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: px2rem(16);
    color: #666;

    .book-list-wrapper {
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .banner-wrapper {
        width: 100%;
        padding: px2rem(10);
        box-sizing: border-box;

        .banner {
          width: 100%;
          height: px2rem(150);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .recommend {
        margin-top: px2rem(20);
      }

      .featured {
        margin-top: px2rem(20);
      }

      .category-list-wrapper {
        margin-top: px2rem(20);
      }

      .category {
        margin-top: px2rem(20);
      }
    }
  }
</style>
