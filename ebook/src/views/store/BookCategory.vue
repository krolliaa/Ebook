<template>
  <!--分组页面-->
  <div class="book-category">
    <shelf-title class="shelf-title"
                 :title="category.title"
                 :isEditMode.sync="isEditMode"
                 :ifShowBack="ifShowBack"
                 :ifShowClear="ifShowClear"
                 :ifGroupEmpty="isEmpty"
                 :data="bookList"
                 :category="category"
                 @onEditClick="onEditClick"
                 @deleteGroup="deleteGroup"
                 @editGroupName="editGroupName"
                 ref="shelfTitle"></shelf-title>
    <scroll-view class="book-shelf-scroll-wrapper"
                 :top="42"
                 :bottom="scrollBottom"
                 @onScroll="onScroll"
                 ref="scroll"
                 v-if="!isEmpty">
      <shelf-list class="book-shelf-list"
                  :data="category.itemList"
                  :isEditMode="isEditMode"
                  @onBookClick="onBookClick"
                  ref="bookShelf"></shelf-list>
    </scroll-view>
    <book-shelf-footer class="book-shelf-footer"
                       :data="category.itemList"
                       :bookList="bookList"
                       :isInGroup="true"
                       :category="category"
                       @setPrivate="setPrivate"
                       @setDownload="setDownload"
                       @removeBook="removeBook"
                       @groupEdit="groupEdit"
                       v-if="isEditMode && !isEmpty"></book-shelf-footer>
    <toast :text="toastText" ref="toast"></toast>
    <div class="shelf-empty-view" v-if="isEmpty">
      <span class="shelf-empty-text">{{$t('shelf.groupNone')}}</span>
    </div>
  </div>
</template>

<script>
  import ShelfTitle from "../../components/shelf/ShelfTitle";
  import ScrollView from "../../components/common/Scroll";
  import ShelfList from "../../components/shelf/ShelfList";
  import BookShelfFooter from "../../components/shelf/ShelfFooter";
  import Toast from "../../components/shelf/Toast";
  import {getLocalStorage, setLocalStorage} from "../../utils/localStorage";
  import {getLocalForage, removeLocalForage} from "../../utils/localForage";
  import {download} from "../../api/book";
  import Epub from 'epubjs'

  global.ePub = Epub;
  const BOOK_SHELF_KEY = 'bookShelf';

  export default {
    components: {
      ShelfTitle,
      ScrollView,
      ShelfList,
      BookShelfFooter,
      Toast
    },
    computed: {
      isEmpty() {
        if (this.category && this.category.itemList && this.category.itemList.length > 0) {
          return false
        } else {
          return true
        }
      }
    },
    data() {
      return {
        index: null,
        bookList: [],
        category: {},
        isEditMode: false,
        ifShowBack: true,
        ifShowClear: false,
        scrollBottom: 0,
        toastText: ''
      }
    },
    methods: {
      // 改变分组
      editGroupName(category, groupName) {
        category.title = groupName;
        this.onEditClick(false);
        this.saveBookShelfToLocalStorage();
      },
      // 删除分组，移动书籍到书架
      deleteGroup(category) {
        const itemList = this.getBooksFromCategory(category);
        this.removeCategory(category)
        this.clearAddFromBookList()
        this.appendBookToList(itemList)
        this.appendAddToBookList()
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        this.$router.go(-1)
      },
      // 从bookList移出分组
      removeCategory(category) {
        this.bookList = this.bookList.filter(item => {
          return category.id !== item.id
        });
      },
      // 从分组中获取书籍
      getBooksFromCategory(category) {
        return category.itemList;
      },
      // 编辑分组
      groupEdit(operation, group) {
        switch (operation) {
          case 1:
            this.moveToGroup(group)
            break
          case 2:
            this.newGroup(group)
            this.moveToGroup(group)
            break
          case 3:
            this.moveOutGroup()
            break
        }
      },
      // 获取选中的书籍
      getSelectedBooks() {
        const selectedBooks = this.bookList.filter(item => {
          return item.selected
        })
        this.bookList.filter(item => {
          if (item.type === 2 && item.itemList) {
            item.itemList.filter(subItem => {
              if (subItem.selected) {
                selectedBooks.push(subItem)
              }
            })
          }
        })
        return selectedBooks;
      },
      // 获取没有选中的书籍
      clearSelectedBooks() {
        this.bookList = this.bookList.filter(item => {
          return !item.selected;
        });
        this.bookList.forEach(item => {
          if (item.type === 2 && item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected;
            })
          }
        })
      },
      // 将图书移动至书架（移出分组所用）
      appendBookToList(selectedBooks) {
        let id = 1;
        if (this.bookList.length > 0) {
          id = this.bookList[this.bookList.length - 1].id + 1;
        }
        selectedBooks.forEach(item => {
          item.id = id++
          this.bookList.push(item)
        })
      },
      // 移出分组
      moveOutGroup() {
        this.clearAddFromBookList()
        const selectedBooks = this.getSelectedBooks()
        this.clearSelectedBooks()
        this.appendBookToList(selectedBooks)
        this.appendAddToBookList()
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        this.showToast(this.$t('shelf.moveBookOutSuccess'))
      },
      // 新建分组
      newGroup(group) {
        this.clearAddFromBookList()
        this.bookList.push(group)
        this.appendAddToBookList()
      },
      // 移动进分组
      moveToGroup(group) {
        const selectedBooks = this.getSelectedBooks();
        this.clearSelectedBooks();
        if (group && group.itemList) {
          group.itemList = [...group.itemList, ...selectedBooks];
          group.itemList.forEach((item, index) => {
            item.id = index + 1;
          })
        }
        ;
        // 关闭编辑模式
        this.onEditClick(false)
        // 将书架信息保存到本地
        this.saveBookShelfToLocalStorage();
        // 显示弹窗
        this.showToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
      },
      // 添加图书的样式
      appendAddToBookList() {
        this.bookList.push({
          cover: '',
          title: '',
          type: 3,
          id: this.bookList.length > 0 ? this.bookList[this.bookList.length - 1].id + 1 : 1
        })
      },
      // 获取除了添加之外的所有图书
      clearAddFromBookList() {
        this.bookList = this.bookList.filter(item => {
          return item.type !== 3
        })
      },
      // 图书移除书架
      removeBook() {
        this.bookList = this.bookList.filter(item => {
          if (item.itemList) {
            item.itemList = item.itemList.filter(subItem => {
              return !subItem.selected
            })
          }
          return !item.selected
        });
        // 关闭编辑模式
        this.onEditClick(false);
        // 保存书架信息到本地存储
        this.saveBookShelfToLocalStorage()
      },
      // 图书点击进入图书详情页
      onBookClick(item, index) {
        this.$router.push({
          path: '/book-store/detail',
          query: {
            fileName: item.fileName,
            category: item.categoryText
          }
        })
      },
      // 显示弹窗
      showToast(text) {
        this.toastText = text
        this.$refs.toast.show()
      },

      // 下载相关（暂时不弄）
      removeDownloadBook(item) {
        return new Promise((resolve, reject) => {
          removeLocalForage(item.fileName, () => {
            console.log(`[${item.fileName}]删除成功...`)
            resolve()
          }, reject)
        })
      },
      downloadBook(item) {
        return new Promise((resolve, reject) => {
          getLocalForage(item.fileName, (err, value) => {
            if (!err && value instanceof Blob) {
              console.log(`[${item.fileName}]读取成功...`, value, new Epub(value))
              resolve()
            } else {
              download(item, item => {
                console.log('[' + item.fileName + ']下载成功...')
                resolve()
              }, reject, reject)
            }
          })
        })
      },
      async setDownload(needDownload) {
        if (needDownload) {
          this.showToast(this.$t('shelf.setDownloadSuccess'))
        } else {
          this.showToast(this.$t('shelf.removeDownloadSuccess'))
        }
        for (let i = 0; i < this.bookList.length; i++) {
          const item = this.bookList[i]
          if (needDownload && item.selected) {
            console.log(`item-正在处理第${i + 1}本书`)
            await this.downloadBook(item).then(() => {
              item.cache = needDownload
            })
          } else if (!needDownload && item.selected) {
            console.log(`item-正在处理第${i + 1}本书`)
            await this.removeDownloadBook(item).then(() => {
              item.cache = needDownload
            })
          }
          if (item.itemList) {
            for (let i = 0; i < item.itemList.length; i++) {
              await this.downloadItem(item.itemList[i], needDownload)
            }
          }
        }
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        console.log('数据保存成功...')
      },
      async downloadItem(subItem, needDownload) {
        console.log(`subItem-正在处理${subItem.fileName}`)
        if (needDownload && subItem.selected) {
          await this.downloadBook(subItem).then(() => {
            subItem.cache = needDownload
          })
        } else if (!needDownload && subItem.selected) {
          await this.removeDownloadBook(subItem).then(() => {
            subItem.cache = needDownload
          })
        }
      },

      // 设置私密阅读
      setPrivate(v) {
        this.bookList.forEach(item => {
          if (item.selected) {
            item.private = v
          }
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              if (subItem.selected) {
                subItem.private = v
              }
            })
          }
        })
        this.onEditClick(false)
        this.saveBookShelfToLocalStorage()
        if (v) {
          this.showToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.showToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      // 是否点击了编辑
      onEditClick(v) {
        this.isEditMode = v
        if (!this.isEditMode) {
          this.bookList.forEach(item => {
            if (item.bookId) {
              item.selected = false
            } else if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        if (this.isEditMode) {
          this.scrollBottom = 48
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        } else {
          this.scrollBottom = 0
          this.$nextTick(() => {
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh()
            }
          })
        }
      },
      // 滚动组件
      onScroll(offsetY) {
        if (offsetY > 0) {
          this.$refs.shelfTitle.showShadow()
        } else {
          this.$refs.shelfTitle.hideShadow()
        }
      },
      // 获取所有的图书包括分组
      getBookList() {
        this.bookList = this.getBookShelfFromLocalStorage();
      },
      // 获取URL地址栏的参数
      getCategoryList() {
        // 获取下标
        this.index = this.$route.query.index;
        // 得到具体的组
        this.category = this.bookList[this.index]
        console.log("已获取到具体分组：", this.category);
      },
      // 保存当前书架信息到本地存储
      saveBookShelfToLocalStorage() {
        setLocalStorage(BOOK_SHELF_KEY, this.bookList)
      },
      // 获取本地存储的书架图书
      getBookShelfFromLocalStorage() {
        return getLocalStorage(BOOK_SHELF_KEY)
      }
    },
    mounted() {
      this.getBookList()
      this.getCategoryList()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-category {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;

    .shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(14);
      color: #333;
    }
  }
</style>
