<template>
  <div class="book-shelf-wrapper">
    <!--只有在showType === 0 时和 showType === 1时才显示-->
    <!--等于0表示默认显示时的书架-->
    <!--等于1表示点击搜索框后默认显示的书架-->
    <transition-group name="list" tag="div" id="book-shelf-list" v-if="showType === 0 || showType === 1">
      <!--遍历书架上的每本书-->
      <div class="book-shelf-item" v-for="(item, index) in bookData" :key="item.id" @click="onBookClick(item, index)">
        <!--书架图书封面-->
        <!--1.默认图书 2.分组图书 3.添加图书-->
        <div class="book-img-wrapper" :class="{'add-book': item.type === 3, 'category-book': item.type ===2}"
             ref="bookImg">
          <shelf-image :data="item" :isEditMode="isEditMode" v-if="item.type === 1"></shelf-image>
          <shelf-category :data="item" :isEditMode="isEditMode" v-else-if="item.type === 2"></shelf-category>
          <span class="icon-add icon" v-else></span>
        </div>

        <!--书架图书名称-->
        <div class="book-title-wrapper">
          <span class="book-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>

    <!--不同显示类型显示不同布局-->
    <!--showType:0表示没有点击搜索框 || 1表示点击搜索框 || 2按进度 || 3按购买-->
    <!--上面已经做了showType === 0 || 1 时的样式，这里做按进度和按购买显示的样式-->
<!--    <div class="book-shelf-label-list-wrapper" v-if="showType === 2 || showType === 3">-->
<!--      <div class="book-shelf-list-wrapper" v-for="(item, index) in purchaseData" :key="index" ref="bookShelfList">-->
<!--        <div class="book-shelf-label-item" :class="{'is-fixed': item.isFixed}">-->
<!--          <span class="book-shelf-label-text">{{item.label}}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="book-shelf-item-wrapper">-->
<!--        <div class="book-shelf-item">-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!--只有在默认图书页面时-->
    <!--显示几本公开，几本私密-->
    <div class="book-shelf-statistics" v-show="showType === 0">{{$t('shelf.statistic').replace('$1',
      publicNumber).replace('$2', privateNumber)}}
    </div>
  </div>
</template>

<script>
  import ShelfImage from "./ShelfImage";
  import ShelfCategory from "./ShelfCategory";
  import {flatBookList} from "../../utils/book";

  export default {
    name: "Shelf",
    props: {
      data: Array,
      isEditMode: Boolean,
      showType: {
        type: Number,
        default: 0
      }
    },
    components: {
      ShelfImage,
      ShelfCategory
    },
    computed: {
      // 获取图书数据
      bookData() {
        // 如果是默认就直接返回 bookList
        // showType 为 0 显示默认时候的图书，有分组有默认图书等
        if (this.showType === 0) {
          return this.data;
          // 否则返回扁平化的数据
          // showType 为 1 返回扁平化数据
          // 这时候显示的是每一本图书，不显示分组
        } else if (this.showType === 1) {
          return flatBookList(this.data);
        }
        return flatBookList(this.data);
      },
      // 公开图书个数
      publicNumber() {
        // 如果书籍存在，才遍历，否则显示 0 本
        if (this.data) {
          let number = 0;
          this.data.filter(item => {
            // 如果不是私密的并且类型为默认的即没有分组也不是添加样式number就往上加
            if (!item.private && item.type === 1) {
              number++;
              // 遍历分组要求条件是分组里面有内容
            } else if (item.type === 2 && item.itemList.length > 0) {
              // 这种写法真秀
              number += item.itemList.filter(subItem => {
                return !subItem.private && subItem.type === 1;
              }).length;
            }
          });
          return number;
        } else {
          return 0;
        }
      },
      // 私密图书个数
      privateNumber() {
        // 当图书列表数据没有内容返回 0 否则遍历
        if (this.data) {
          let number = 0;
          this.data.filter(item => {
            if (item.private && item.type === 1) {
              number++;
            } else if (item.type === 2 && item.itemList.length > 0) {
              number += item.filter(subItem => {
                return subItem.private && subItem.type === 1;
              }).length
            }
          });
          return number;
        } else {
          return 0;
        }
      },
      // 购买数据（未明）
      purchaseData() {
        // 已购买
        const bought = {
          label: this.$t('shelf.bought'),
          // 经过扁平化的数据，因为bookList里面可能有分组
          bookList: this.flatData.filter(item => item.cache),
          // bookList: flatBookList(this.data),
          isFixed: false
        }
        // 未购买
        const notPurchased = {
          label: this.$t('shelf.notPurchased'),
          bookList: this.flatData.filter(item => !item.cache),
          // bookList: flatBookList(this.data),
          isFixed: false
        }
        return [bought, notPurchased];
      },
      // 获取位置（未明）
      // bookShelfList() {
      //   return this.$refs.bookShelfList[0].getBoundingClientRect().height;
      // },
      // 获取位置（未明）
      // bookShelfList2() {
      //   return this.$refs.bookShelfList[1].getBoundingClientRect().height;
      // }
    },
    methods: {
      onBookClick(item, index) {
        // 添加图书 => 进入书城
        if (item.type === 3) {
          this.$router.push('/book-store/home');
        } else if (item.type === 1) {
          if (this.isEditMode) {
            item.selected = !item.selected;
          } else {
            this.$emit('onBookClick', item, index);
          }
          // 表示点击的是分组
          // 进入分组页面
        } else if (item.type === 2) {
          if (!this.isEditMode) {
            this.$router.push({
              path: '/book-store/category',
              query: {
                index: index
              }
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf-wrapper {
    width: 100%;
    overflow: auto;
    font-size: 0;

    #book-shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .book-shelf-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;

        &.list-move {
          transition: transform .5s;
        }

        &.list-leave-active {
          display: none;
        }

        .book-img-wrapper {
          width: 100%;
          @include shelfImgHeight;
          box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
          @include center;
          border: px2rem(1) solid #eee;
          box-sizing: border-box;

          &.add-book {
            box-shadow: none;
            border: px2rem(1) solid #ccc;
            box-sizing: border-box;
          }

          &.category-book {
            border: px2rem(1) solid #eee;
            box-sizing: border-box;
          }

          .book-img {
            width: 100%;
            height: 100%;
          }

          .icon-add {
            font-size: px2rem(40);
            color: #ccc;
          }
        }

        .book-title-wrapper {
          .book-title {
            margin-top: px2rem(10);
          }
        }
      }
    }

    .book-shelf-statistics {
      margin: px2rem(30) 0 px2rem(20) 0;
      text-align: center;
      font-size: px2rem(12);
      color: #999;
    }

    .book-shelf-label-list-wrapper {
      width: 100%;

      .book-shelf-list-wrapper {
        position: relative;
        width: 100%;

        .book-shelf-label-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 120;
          width: 100%;
          height: px2rem(42);
          border-top: px2rem(1) solid #eee;
          border-bottom: none;
          box-sizing: border-box;
          background: white;

          &.is-fixed {
            position: fixed;
            top: px2rem(93);
            left: 0;
            border-bottom: px2rem(1) solid #eee;
          }

          @include left;

          .book-shelf-label-text {
            font-size: px2rem(14);
            color: #666;
            margin: 0 px2rem(15);
          }
        }

        .book-shelf-item-wrapper {
          position: relative;
          z-index: 110;
          display: flex;
          flex-flow: row wrap;
          width: 100%;
          padding: px2rem(42) px2rem(15) 0 px2rem(15);
          box-sizing: border-box;

          .book-shelf-item {
            flex: 0 0 33.33%;
            width: 33.33%;
            padding: px2rem(15);
            box-sizing: border-box;

            &.list-move {
              transition: transform .5s;
            }

            &.list-leave-active {
              display: none;
            }

            .book-img-wrapper {
              width: 100%;
              @include shelfImgHeight;
              box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
              @include center;
              border: px2rem(1) solid #eee;
              box-sizing: border-box;

              &.add-book {
                box-shadow: none;
                border: px2rem(1) solid #ccc;
                box-sizing: border-box;
              }

              &.category-book {
                border: px2rem(1) solid #eee;
                box-sizing: border-box;
              }

              .book-img {
                width: 100%;
                height: 100%;
              }

              .icon-add {
                font-size: px2rem(40);
                color: #ccc;
              }
            }

            .book-title-wrapper {
              .book-title {
                margin-top: px2rem(10);
              }
            }
          }
        }
      }
    }
  }
</style>
