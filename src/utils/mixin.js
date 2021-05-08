import {mapGetters, mapActions} from 'vuex'
import {themeList, addCss, removeAllCss, getReadTimeByMinute, showBookDetail} from "./book";
import {saveLocation, getBookmark} from "./localStorage";

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'getFileName',
      'getMenuVisible',
      'getSettingVisible',
      'getDefaultFontSize',
      'getCurrentBook',
      'getDefaultFontFamily',
      'getFontFamilyPopUpVisible',
      'getDefaultTheme',
      'getBookAvailable',
      'getProgress',
      'getSection',
      'getCover',
      'getMetadata',
      'getNavigation',
      'getOffsetY',
      'getIsBookmark',
      'getBookText',
      'getPaginate',
      'getPageList',
      'getIsPaginating'
    ]),
    getThemeList() {
      return themeList(this);
    },
    getSectionName() {
      return this.getNavigation && this.getSection ? this.getNavigation[this.getSection].label : '';
    },
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyPopUpVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark',
      'setBookText',
      'setPaginate',
      'setPageList',
      'setIsPaginating'
    ]),
    // 插入主题样式样式
    initGlobalStyle() {
      switch (this.getDefaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break;
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break;
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break;
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break;
      }
    },
    // refreshLocation 方法可以获取当前位置，并且更新进度条，最后将当前位置保存到本地存储中
    refreshLocation() {
      const currentLocation = this.getCurrentBook.rendition.currentLocation();
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi;
        const progress = this.getCurrentBook.locations.percentageFromCfi(startCfi);
        this.setProgress(Math.floor(progress * 100));
        this.setSection(currentLocation.start.index);
        saveLocation(this.getFileName, startCfi);
        const bookmark = getBookmark(this.getFileName);
        if (bookmark) {
          // 如果本地存储的书签信息中有当前cfi，就显示书签，否则不显示书签
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true);
          } else {
            this.setIsBookmark(false);
          }
          // 如果本地存储书签信息存在都不存在直接不显示书签
        } else {
          this.setIsBookmark(false);
        }
        const cfiBase = currentLocation.start.cfi.replace(/!.*/, '');
        const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '');
        const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`;
        this.getCurrentBook.getRange(cfiRange).then(range => {
          let text = range.toString().replace(/\s\s/g, '');
          if (text.length === 1) {
            text = "Cover";
          }
          this.setBookText(text);
        });
        if (this.getPageList) {
          const totalPage = this.getPageList.length
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    // 渲染整个图书包括进度条等
    display(target, cb) {
      if (target) {
        this.getCurrentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) cb();
        })
      } else {
        this.getCurrentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) cb();
        })
      }
    },
    // 隐藏标题栏和菜单栏，翻页+目录引用
    hideTittleAndMenu() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyPopUpVisible(false);
    },
    // 获取阅读时间
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.getFileName));
    },
  }
}

export const ebookHome = {
  methods: {
    showBookDetail(item) {
      showBookDetail(this, item);
    }
  }
}
