<template>
  <div class="book-detail">
    <!--显示书籍的标题-->
    <detail-title @back="back" :showShelf="true" ref="title"></detail-title>
    <scroll class="content-wrapper" :top="42" :bottom="52" @onScroll="onScroll" ref="scroll">
      <!--显示图书信息-->
      <detail-info :cover="cover" :title="title" :author="author" :desc="desc"></detail-info>
      <!--显示图书版权：出版社、分类、语言和ISBN-->
      <div class="book-detail-content-wrapper">
        <!--显示版权-->
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <!--显示目录-->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="read(item)">
              <div class="book-detail-content-navigation-text"
                   :class="{'is-sub': item.deep> 1}"
                   :style="itemStyle(item)"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--显示试读-->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <!--底部栏目-->
    <div class="bottom-wrapper">
      <!--阅读本书-->
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <!--听书-->
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <!--加入书架-->
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
  import DetailTitle from "../../components/detail/DetailTitle";
  import DetailInfo from "../../components/detail/DetailInfo";
  import Scroll from "../../components/common/Scroll";
  import Toast from "../../components/shelf/Toast";
  import {flatList, detail} from "../../api/book";
  import {px2rem, realPx} from "../../utils/utils";
  import {getLocalStorage} from "../../utils/localStorage";
  import {getLocalForage} from "../../utils/localForage";
  import Epub from 'epubjs';

  global.ePub = Epub;

  export default {
    name: "BookDetail",
    components: {
      DetailTitle,
      DetailInfo,
      Scroll,
      Toast
    },
    computed: {
      // 标题
      title() {
        return this.metadata ? this.metadata.title : ''
      },
      // 作者
      author() {
        return this.metadata ? this.metadata.creator : ''
      },
      // 详情
      desc() {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      // 出版社
      publisher() {
        return this.metadata ? this.metadata.publisher : '-'
      },
      // 语言
      lang() {
        return this.metadata ? this.metadata.language : '-'
      },
      // ISBN
      isbn() {
        return this.metadata ? this.metadata.identifier : '-'
      },
      // 显示目录：扁平化
      flatNavigation() {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)));
        } else {
          return []
        }
      },
      // 加入书架
      inBookShelf() {
        return false;
        // if (this.bookItem && this.bookShelf) {
        //   const flatShelf = (function flatten(arr) {
        //     return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v));
        //   })(this.bookShelf).filter(item => item.type === 1)
        //   const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName);
        //   return book && book.length > 0;
        // } else {
        //   return false;
        // }
      }
    },
    data() {
      return {
        bookShelf: null,
        bookItem: null,
        book: null,
        metadata: null,
        trialRead: null,
        cover: null,
        navigation: null,
        displayed: false,
        audio: null,
        randomLocation: null,
        description: null,
        toastText: '',
        trialText: null,
        categoryText: null,
        opf: null
      }
    },
    mounted() {
      // 初始化图书详情页面
      this.init();
    },
    methods: {
      // 显示目录样式
      itemStyle(item) {
        return {
          marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
        }
      },
      back() {
        this.$router.go(-1)
      },
      // 初始化页面 => 获取图书信息
      init() {
        // 从URL地址栏获取书名
        const fileName = this.$route.query.fileName;
        // 从URL地址栏获取学科分类 因为我们阅读器的URL地址就是如：History|FileName
        this.categoryText = this.$route.query.category;
        if (fileName) {
          // 从mock => /api/book.js 后台接口获取这本书的细节
          detail({fileName}).then(response => {
            if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
              // 获取图书信息;
              const data = response.data.data;
              this.bookItem = data;
              this.cover = this.bookItem.cover;
              // 这里是为了获取content.opf因为epubjs解析也是首先获取content.opf的
              // 解析content.opf就可以获取图书资源信息
              let rootFile = data.rootFile;
              if (rootFile.startsWith('/')) {
                rootFile = rootFile.substring(1, rootFile.length);
              }
              this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${fileName}/${rootFile}`;
              // 解析电子书
              this.parseBook(this.opf);
            } else {
              // 如果没有传递fileName
              this.showToast(response.data.msg)
            }
          });
        }
        this.bookShelf = getLocalStorage('bookShelf');
      },
      // 解析电子书
      parseBook(blob) {
        this.book = new Epub(blob)
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        })
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
          if (this.navigation.toc && this.navigation.toc.length > 1) {
            this.display(this.navigation.toc[1].href)
              .then(section => {
                if (this.$refs.scroll) {
                  this.$refs.scroll.refresh()
                }
                this.displayed = true
                const reg = new RegExp('<.+?>', 'g')
                const text = section.output.replace(reg, '').replace(/\s\s/g, '')
                this.description = text
              })
          }
        })
      },
      display(location) {
        if (this.$refs.preview) {
          if (!this.rendition) {
            this.rendition = this.book.renderTo('preview', {
              width: window.innerWidth > 640 ? 640 : window.innerWidth,
              height: window.innerHeight,
              method: 'default'
            })
          }
          if (!location) {
            return this.rendition.display()
          } else {
            return this.rendition.display(location)
          }
        }
      },
      doFlatNavigation(content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },
      showToast(text) {
        this.toastText = text;
        this.$refs.toast.show();
      },
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      findBookFromList(fileName) {
        flatList().then(response => {
          if (response.status === 200) {
            const bookList = response.data.data.filter(item => item.fileName === fileName)
            if (bookList && bookList.length > 0) {
              this.bookItem = bookList[0]
              console.log(this.bookItem)
              this.initBook()
            }
          }
        })
      },
      initBook() {
        if (this.bookItem) {
          getLocalForage(this.bookItem.fileName, (err, blob) => {
            if (err) {
              this.downloadBook()
            } else {
              if (blob) {
                this.parseBook(blob)
              } else {
                this.downloadBook()
              }
            }
          })
        }
      },
      downloadBook() {
        const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`
        this.parseBook(opf)
      },
      // 点击目录可以直接跳转阅读
      read(item) {
        getLocalForage(this.bookItem.fileName, (err, value) => {
          if (!err && value instanceof Blob) {
            this.$router.push({
              path: `/ebook/${this.bookItem.fileName}`,
              query: {
                navigation: item.href
              }
            })
          } else {
            this.$router.push({
              path: `/ebook/${this.bookItem.fileName}`,
              query: {
                navigation: item.href,
                opf: this.opf
              }
            })
          }
        })
      },
      // 阅读器功能
      readBook() {
        getLocalForage(this.bookItem.fileName, (err, value) => {
          if (!err && value instanceof Blob) {
            this.$router.push({
              path: `/ebook/${this.bookItem.fileName}`
            })
          } else {
            this.$router.push({
              path: `/ebook/${this.bookItem.fileName}`,
              query: {
                opf: this.opf
              }
            })
          }
        })
      },
      // 听书功能
      trialListening() {
        getLocalForage(this.bookItem.fileName, (err, value) => {
          if (!err && value instanceof Blob) {
            this.$router.push({
              path: '/book-store/book-speaking',
              query: {
                fileName: this.bookItem.fileName
              }
            })
          } else {
            this.$router.push({
              path: '/book-store/book-speaking',
              query: {
                fileName: this.bookItem.fileName,
                opf: this.opf
              }
            })
          }
        })
      },
      // 是否添加进书架
      addOrRemoveShelf() {
        alert("添加成功");
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-detail {
    width: 100%;
    background: white;

    .content-wrapper {
      width: 100%;

      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;

        .book-detail-content-title {
          font-size: px2rem(20);
          font-weight: bold;
          padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
          box-sizing: border-box;
        }

        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          box-sizing: border-box;

          .loading-text-wrapper {
            width: 100%;

            .loading-text {
              font-size: px2rem(14);
              color: #666;
            }
          }

          .book-detail-content-row {
            display: flex;
            box-sizing: border-box;
            margin-bottom: px2rem(10);

            .book-detail-content-label {
              flex: 0 0 px2rem(70);
              font-size: px2rem(14);
              color: #666;
            }

            .book-detail-content-text {
              flex: 1;
              font-size: px2rem(14);
              color: #333;
            }
          }

          #preview {
          }

          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #666;
              border-bottom: px2rem(1) solid #eee;

              &:last-child {
                border-bottom: none;
              }

              .book-detail-content-navigation-text {
                width: 100%;
                @include ellipsis;

                &.is-sub {
                  color: #666;
                }
              }
            }
          }
        }
      }

      .audio-wrapper {
        width: 100%;
        padding: px2rem(15);
        box-sizing: border-box;

        #audio {
          width: 100%;
        }
      }
    }

    .bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 120;
      display: flex;
      width: 100%;
      height: px2rem(52);
      box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);

      .bottom-btn {
        flex: 1;
        color: $color-blue;
        font-weight: bold;
        font-size: px2rem(14);
        @include center;

        &:active {
          color: $color-blue-transparent;
        }

        .icon-check {
          margin-right: px2rem(5);
        }
      }

      &.hide-shadow {
        box-shadow: none;
      }
    }
  }
</style>
