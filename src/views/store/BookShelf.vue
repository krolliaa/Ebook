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
    <!--initPosition为初始化位置-->
    <scroll class="book-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            :initPosition="initPosition"
            @onScroll="onScroll"
            ref="scroll">
      <!--传递onTabClick改变showType的值-->
      <!--v-if="!isDataEmpty"可不加-->
      <shelf-search @onSearchClick="onSearchClick"
                    @onCancel="onSearchCancel"
                    @onTabClick="onSearchTabClick"
                    ref="shelfSearch"
                    v-if="isDataEmpty"></shelf-search>
      <shelf-list class="book-shelf-list"
                  :data="bookList"
                  :showType="showType"
                  :isEditMode="isEditMode"
                  @onBookClick="onBookClick"
                  ref="bookShelf"
                  v-if="isDataEmpty"></shelf-list>
      <!--书架中没有书的时候展示的内容，纯页面，有点鸡肋，可以不要-->
      <shelf-empty class="book-shelf-empty" v-if="!isDataEmpty"></shelf-empty>
      <shelf-footer class="book-shelf-footer"
                    :data="bookList"
                    :bookList="bookList"
                    :isInGroup="false"
                    @setPrivate="setPrivate"
                    @setDownload="setDownload"
                    @removeBook="removeBook"
                    @groupEdit="groupEdit"
                    v-show="!isEditMode"></shelf-footer>
      <toast :text="toastText" ref="toast"></toast>
    </scroll>
  </div>
</template>

<script>
  import ShelfTitle from "../../components/shelf/ShelfTitle";
  import ShelfSearch from "../../components/shelf/ShelfSearch";
  import ShelfList from "../../components/shelf/ShelfList";
  import Scroll from "../../components/common/Scroll";
  import ShelfEmpty from "../../components/shelf/ShelfEmpty";
  import Toast from "../../components/shelf/Toast";
  import ShelfFooter from "../../components/shelf/ShelfFooter";
  import {shelf} from "../../api/book";
  import {realPx} from "../../utils/utils";
  import {getLocalStorage, setLocalStorage} from "../../utils/localStorage";

  const BOOK_SHELF_KEY = 'bookShelf';

  export default {
    components: {
      Scroll,
      ShelfTitle,
      ShelfSearch,
      ShelfList,
      ShelfEmpty,
      Toast,
      ShelfFooter
    },
    computed: {
      isDataEmpty() {
        // 如果 this.bookList 为假，也就是bookList没有内容，显示初始化页面
        // 如果 this.bookList 的长度为 0 返回真，显示初始化页面
        return !this.bookList || this.bookList.filter(item => item.type !== 3).length === 0
      }
    },
    data() {
      return {
        bookList: [], // 书架书籍
        ifShowTitle: true, // 是否显示标题 默认显示
        isEditMode: false, // 是否处于编辑模式 默认不显示
        ifShowBack: false, // 是否显示返回按钮 默认不显示
        ifShowClear: true, // 是否显示清除缓存按钮 默认显示
        scrollBottom: 0,
        toastText: '',
        showType: 0,
        initPosition: {
          x: 0,
          y: 0
        }
      }
    },
    mounted() {
      // 获取书架上的信息
      this.getBookShelf();
    },
    methods: {
      // 1获取书架上的信息
      getBookShelf() {
        this.bookList = this.getBookShelfFromLocalStorage();
        // 如果本地存储中没有书架信息
        if (!this.bookList) {
          // 从服务器中获取书籍
          shelf().then(response => {
            this.bookList = response.data.bookList;
            // 如果从服务器上获取到的书仍为空
            if (!this.bookList) {
              this.bookList = [];
            }
            // 加入书架
            this.appendAddToBookList();
            // 保存书架信息到本地存储中
            this.saveBookShelfToLocalStorage();
            // 初始化书架
            this.initBookShelf();
          });
        }
        // 如果本地存储书架不为空直接初始化书架
        this.initBookShelf();
      },
      // 2获取选中的所有图书 √
      getSelectedBooks() {
        // 获取不在分组里的图书 有可能为空
        const selectedBooks = this.bookList.filter(item => {
          return item.selected
        });
        // 获取分组中选中的图书
        this.bookList.filter(item => {
          if (item.type === 2 && item.itemList) {
            // 分组中选中的图书
            item.filter(subItem => {
              if (subItem.selected) {
                selectedBooks.push(subItem);
              }
            })
          }
        });
        return selectedBooks;
      },
      // 3保存书架信息到本地存储中
      saveBookShelfToLocalStorage() {
        setLocalStorage(BOOK_SHELF_KEY, this.bookList);
      },
      // 4如果书架有书将每本书的选择状态置空
      initBookShelf() {
        if (this.bookList) {
          this.bookList.forEach(item => {
            item.selected = false
          })
        }
      },
      // 5从本地存储中获取书架信息
      getBookShelfFromLocalStorage() {
        return getLocalStorage(BOOK_SHELF_KEY)
      },
      // 6根据滚动条显示/隐藏阴影
      onScroll(offsetY) {
        // 偏移量大于了54（搜索框高度）了
        if (offsetY > realPx(54)) {
          // 标题栏显示阴影
          this.$refs.shelfTitle.showShadow();
          // 如果标题没显示，那说明搜索框显示了，那么给搜索框添加阴影
          if (!this.ifShowTitle) {
            // this.$refs.shelfSearch.showShadow();
          }
        } else {
          // 如果偏移量不够那么隐藏阴影
          this.$refs.shelfTitle.hideShadow();
          if (this.$refs.shelfSearch) {
            this.$refs.shelfSearch.hideShadow();
          }
        }
      },
      // 7点击默认/按进度/按购买时的不同状态 √
      onSearchTabClick(id) {
        this.showType = id
      },
      // 8图书分组操作 √
      groupEdit(operation, group) {
        switch (operation) {
          case 1:
            // 移动至分组
            this.moveToGroup(group)
            break
          case 2:
            // 新建分组
            this.newGroup(group)
            this.moveToGroup(group)
            break
          case 3:
            // 移出分组
            this.moveOutGroup()
            break
        }
      },
      // 9移动至分组
      moveToGroup(group) {
        // 获取选择的书籍
        const selectedBooks = this.getSelectedBooks();
        // 临时清空当前书架上选中的书籍
        this.clearSelectedBooks();
        // 如果分组存在并且分组里面的内容存在
        if (group && group.itemList) {
          // 合并图书
          group.itemList = [...group.itemList, ...selectedBooks]
          // 赋予id
          group.itemList.forEach((item, index) => {
            item.id = index + 1
          })
        }

      },
      // 10新建分组
      newGroup(group) {
        // 返回所有不为空的书和分组
        this.clearAddFromBookList();
        // 添加进新的分组
        this.bookList.push(group);
        // 添加添加图书到bookList
        this.appendAddToBookList()
      },
      // 11移出分组
      moveOutGroup() {
        // 获取所有图书和分组
        this.clearAddFromBookList();
        // 获取分组中选中要移出的图书
        const selectedBooks = this.getSelectedBooks();
        // 清除分组中移出的图书
        this.clearSelectedBooks();
        // 将选择移出的书籍放置到书架中 type 为 1
        this.appendBookToList(selectedBooks);
        // 末尾添加图书样式
        this.appendAddToBookList();
        // 退出编辑模式
        this.onEditClick(false);
        // 保存书架信息到本地存储
        this.saveBookShelfToLocalStorage();
        // 显示弹框
        this.showToast(this.$t('shelf.moveBookOutSuccess'));
      },
      // 12清除选中的图书 √
      clearSelectedBooks() {
        // 获取所有没有选择的图书包括分组，为了等下直接添加刚刚移出书架的书
        this.bookList = this.bookList.filter(item => {
          return !item.selected;
        })
        // subItem 为分组里的图书
        // 获取分组中的图书
        this.bookList.forEach(item => {
          // 如果是分组且存在内容
          if (item.type === 2 && item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected;
            })
          }
        });
      },
      // 13将选择移出的书籍（可能有多本）放置到书架中 type 为 1 √
      appendBookToList(selectedBooks) {
        // 分id给图书
        let id = this.bookList[this.bookList.length - 1];
        selectedBooks.forEach(item => {
          item.id = id++;
          // 刚刚从bookList中移除了现在添加到书架
          this.bookList.push(item);
        });
      },
      // 14显示弹窗
      showToast(text) {
        this.toastText = text
        this.$refs.toast.show()
      },
      // 15获取除了添加图书以外的所有图书和分组
      clearAddFromBookList(bookList) {
        this.bookList = bookList.filter(item => {
          return item.type !== 3
        });
      },
      // 16末尾添加图书
      appendAddToBookList() {
        this.bookList.push({
          cover: '',
          title: '',
          type: 3,
          id: Number.MAX_SAFE_INTEGER
        })
      },
      // 17点击了图书
      onBookClick() {
        alert("点击了图书")
      },
      // 18点击了编辑
      onEditClick(v) {
        // true / false
        this.isEditMode = v;
        // 如果点击了编辑模式，然后选择了几本书
        // 再点击时不处于编辑模式，每本书右下角的选择按钮应不被选择
        if (!this.isEditMode) {
          this.bookList.forEach(item => {
            // 如果item是书
            if (item.bookId) {
              item.selected = false;
              // 如果item是分类
            } else if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false;
              })
            }
          })
        }
        // 如果选择了编辑模式，则要设置滚动组件，预留位置给底部
        if (this.isEditMode) {
          // 显示底部 预留位置
          this.scrollBottom = 48;
          this.$nextTick(() => {
            // 确保滚动组件存在
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          });
        } else {
          this.scrollBottom = 0
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        }
      },
      // 19点击了清除缓存
      clearCache() {
        alert("点了清除");
      },
      // 20点击了搜索框
      onSearchClick() {
        // 回到不编辑模式
        this.onEditClick(false);
        // 显示类型为 1 即使之前处于编辑模式也不显示编辑模式
        // 点击搜索框将不显示添加图书的样式
        this.showType = 1;
        // 隐藏标题
        this.hideTitle();
      },
      // 21点击取消，显示标题栏，v-if/v-else决定显示中英文翻译按钮还是取消按钮
      onSearchCancel() {
        // 显示标题
        this.showTitle();
        // 显示添加图书大图标
        this.showType = 0;
        // 点击取消回到顶部
        this.$refs.scroll.scrollTo(0, 0)
      },
      // 22显示标题
      showTitle() {
        this.ifShowTitle = true
      },
      // 23隐藏标题
      hideTitle() {
        this.ifShowTitle = false
      },
      // 24将选中私密的书籍设置为私密状态
      setPrivate(v) {
        this.bookList.forEach(item => {
          if (item.selected) {
            item.private = v;
          }
        });
        // 取消编辑状态
        this.onEditClick(false)
        // 保存书架信息到本地存储
        this.saveBookShelfToLocalStorage();
        // 显示弹出成功打开私密/关闭私密窗口 => 全局弹框 vue-create-api
        if (v) {
          this.showToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.showToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      // 25隐藏弹窗
      hideToast() {
        this.$refs.toast.hide()
      },
      // 26 持续弹窗
      showContinueToast(text) {
        this.toastText = text
        this.$refs.toast.continueShow()
      },
      // 27移出书架
      removeBook() {
        this.bookList = this.bookList.filter(item => {
          if (item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected
            })
          }
          return !item.selected
        });
        this.onEditClick(false);
        this.saveBookShelfToLocalStorage();
      },

      // 28 下载图书
      // 29 下载图书相关
      setDownload(){}
      // 30 下载图书相关
      // 31 移除下载的图书
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
