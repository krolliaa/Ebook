<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import {ebookMixin} from '../../utils/mixin.js'
  import {addCss} from "../../utils/book";
  import {
    setFontSize,
    getFontSize,
    setFontFamily,
    getFontFamily,
    saveTheme,
    getTheme,
    getLocation,
    clearLocalStorage
  } from "../../utils/localStorage";

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
      // 隐藏标题栏和菜单栏，翻页时引用
      hideTittleAndMenu() {
        this.setMenuVisible(false);
        this.setSettingVisible(-1);
        this.setFontFamilyPopUpVisible(false);
      },
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
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/styles/global.scss";
</style>
