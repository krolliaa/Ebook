<template>
  <!--猜你喜欢栏目-->
  <div class="guess-you-like">
    <title-view :label="$t('home.guessYouLike')" :btn="$t('home.change')" @onClick="change"></title-view>
    <!--猜你喜欢栏目的书架-->
    <div class="guess-you-like-list">
      <div class="guess-you-like-item" v-for="(item, index) in showData" :key="index" @click="showBookDetail(item)">
        <!--图书图片-->
        <div class="img-wrapper">
          <img class="img" v-lazy="item.cover" :key="item.cover">
        </div>
        <!--图书信息-->
        <div class="content-wrapper">
          <!--图书标题-->
          <div class="title title-big" ref="title">{{item.title}}</div>
          <!--图书作者-->
          <div class="author sub-title" ref="author">{{item.author}}</div>
          <!--图书结果：对感兴趣的人也在读-->
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleView from "./TitleView";
  import {realPx} from '../../utils/utils'
  import {ebookHome} from '../../utils/mixin'

  export default {
    name: "GuessYouLike",
    // 接收BookHome传递的书籍信息
    props: {
      data: Array
    },
    mixins: [ebookHome],
    computed: {
      width() {
        return window.innerWidth - realPx(20) - realPx(60) + 'px'
      },
      showData() {
        // 根据data是否存在显示数据
        // 太妙了，这里我们做了一个通用的方法：
        // 每点击一次，index 的值就会发生改变，根据这个算法我们就可以单纯根据 this.index 来显示数据
        if (this.data) {
          return [
            this.data[this.index],
            this.data[this.index + this.total],
            this.data[this.index + this.total * 2]
          ]
        } else {
          return [];
        }
      }
    },
    watch: {
      // 这里我们提供的mock接口书籍只有9本guessYouLike
      // 我们打算每次显示 3 本书，所以这里除以 3
      data(v) {
        this.total = v.length / 3;
      }
    },
    components: {
      // 引入 TitleView 组件，因为每个栏目都有标题和更换一批的字样，所以这里抽取成TitleView，实现模块化开发，国际化
      TitleView
    },
    data() {
      return {
        index: 0,
        total: 0
      }
    },
    methods: {
      // 用户点击更换一批时的具体实现
      change() {
        // 如果索引超过了总的长度，就将索引置为0
        // 否则索引++，页面会根据监视index的值显示showData返回的数据
        if (this.index + 1 >= this.total) {
          this.index = 0
        } else {
          this.index++
        }
      },
      // 这里的result 感兴趣的人直接在后台数据封装好了
      resultText(item) {
        if (item && item.type && item.result) {
          switch (item.type) {
            case 1:
              return this.$t('home.sameAuthor').replace('$1', item.result)
            case 2:
              return this.$t('home.sameReader').replace('$1', item.result)
            case 3:
              return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
          }
        }
      },
      // 重置宽度大小
      resize() {
        this.$nextTick(() => {
          this.$refs.title.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.author.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.result.forEach(item => {
            item.style.width = this.width
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .guess-you-like {
    .guess-you-like-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;

      .guess-you-like-item {
        display: flex;
        margin-top: px2rem(15);

        &:first-child {
          margin-top: px2rem(5);
        }

        .img-wrapper {
          flex: 0 0 20%;
          padding: px2rem(10) px2rem(10) px2rem(10) 0;
          box-sizing: border-box;

          .img {
            width: 100%;
          }
        }

        .content-wrapper {
          flex: 1;
          padding: px2rem(10) 0;
          box-sizing: border-box;

          .author {
            margin-top: px2rem(15);
          }

          .result {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
