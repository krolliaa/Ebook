<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"></div>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import {ebookMixin} from '../../utils/mixin.js'
  import {
    setFontSize,
    getFontSize,
    setFontFamily,
    getFontFamily,
    saveTheme,
    getTheme,
    getLocation,
    // clearLocalStorage
  } from "../../utils/localStorage";
  import {flatten} from "../../utils/book";

  global.ePub = Epub;
  export default {
    name: "EbookReader",
    mixins: [ebookMixin],
    mounted() {
      // 使用 vuex 传递 fileName，因为后续 fileName 将大量被使用到
      this.setFileName(this.$route.params.fileName.split("|").join("/")).then(() => {
        this.initEpub();
      });
    },
    methods: {
      // 初始化渲染电子书
      initEpub() {
        //http://192.168.43.124:8080/#/ebook/History|2017_Book_InterdisciplinaryPerspectivesO
        // 分解用户输入的URL地址，
        const url = process.env.VUE_APP_RES_URL + '/epub/' + this.getFileName + '.epub';
        this.book = new Epub(url);
        this.setCurrentBook(this.book);
        this.initRendition();
        this.initGesture();
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.getFileName) / 16));
        }).then(locations => {
          this.setBookAvailable(true);
          this.refreshLocation();
        })
      },
      // 向上翻页
      prevPage() {
        // 如果渲染图书存在，则往前翻页
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation();
          });
          this.hideTittleAndMenu();
        }
      },
      // 向下翻页
      nextPage() {
        // 如果渲染图书存在，则往后翻页
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation();
          });
          this.hideTittleAndMenu();
        }
      },
      // 手势触动显示/隐藏标题栏和菜单栏
      toggleTitleAndMenu() {
        // 只有在菜单栏的存在时候设置栏不显示，显示菜单栏时不必操作，减少一步代码的执行
        if (this.getMenuVisible) {
          this.setSettingVisible(-1);
          this.setFontFamilyPopUpVisible(false);
        }
        this.setMenuVisible(!this.getMenuVisible);
      },
      // 初始化渲染
      initRendition() {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        // clearLocalStorage();
        const location = getLocation(this.getFileName);
        // 这里 location 为 null 时会自动不渲染
        this.display(location, () => {
          this.parseBook();
          this.initTheme();
          this.initFontSize();
          this.initFontFamily();
          this.initGlobalStyle();
        });
        this.rendition.hooks.content.register(contents => {
          // addStylesheet 本身返回一个 promise 对象
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
          ]).then(() => {
          })
        });
      },
      initGesture() {
        this.rendition.on("touchstart", (e) => {
          this.startTime = e.timeStamp;
          this.startClientX = e.changedTouches[0].clientX;
        });
        this.rendition.on("touchend", (e) => {
          this.endTime = e.timeStamp;
          this.endClientX = e.changedTouches[0].clientX;
          const offsetX = this.endClientX - this.startClientX;
          const time = this.endTime - this.startTime;
          // 如果间隔时间在 500ms 之内并且移动的距离绝对值对于 40 才触发换页
          if (time < 500 && offsetX > 40) {
            // offsetX 大于 0 表示向右滑，这里指定了一个条件，切换右页面
            this.prevPage();
          } else if (time < 500 && offsetX < -40) {
            // offsetX 小于 0 表示向左滑，这里指定了一个条件，切换左页面
            this.nextPage();
          } else {
            this.toggleTitleAndMenu();
          }
          // e.preventDefault();
          // e.stopPropagation();
        });
      },
      initFontSize() {
        let fontSize = getFontSize(this.getFileName);
        if (!fontSize) {
          setFontSize(this.getFileName, this.getDefaultFontSize);
        } else {
          this.rendition.themes.fontSize(fontSize);
          this.setDefaultFontSize(fontSize);
        }
      },
      initFontFamily() {
        let fontFamily = getFontFamily(this.getFileName);
        if (!fontFamily) {
          setFontFamily(this.getFileName, this.getDefaultFontFamily);
        } else {
          this.rendition.themes.font(fontFamily);
          this.setDefaultFontFamily(fontFamily);
        }
      },
      initTheme() {
        let defaultTheme = getTheme(this.getFileName);
        if (!defaultTheme) {
          defaultTheme = this.getThemeList[0].name;
          saveTheme(this.getFileName, defaultTheme);
        }
        this.setDefaultTheme(defaultTheme);
        this.getThemeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style);
        });
        this.rendition.themes.select(defaultTheme);
      },
      parseBook() {
        // 获取封面：cover
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url);
          })
        });
        // 获取图书信息：metadata
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata);
        });
        // 获取图书目录：navigation
        this.book.loaded.navigation.then(nav => {
          const navigation = flatten(nav.toc);

          function find(item, level = 0) {
            return item.parent ? find(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level) : level;
          }

          navigation.forEach(item => {
            item.level = find(item);
          });
          this.setNavigation(navigation);
        })
      },
      onMaskClick(e) {
        const offsetX = e.offsetX;
        const width = window.innerWidth;
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage();
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
      },
      move(e) {
        let offsetY = 0;
        // 如果 firstOffsetY 存在，则给 offsetY 赋值，否则就将触碰的第一点的offsetY赋值给firstOffsetY
        // 获取 firstOffsetY 用于获取整体的偏移量 = 手指最后滑动到的地方的 clientY - e.changedTouches[0].clientY
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY;
        }
        e.preventDefault();
        e.stopPropagation();
      },
      moveEnd(e) {
        this.setOffsetY(0);
        this.firstOffsetY = null;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
  }
</style>
