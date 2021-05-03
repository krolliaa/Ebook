import {mapGetters, mapActions} from 'vuex'
import {themeList, addCss, removeAllCss} from "./book";
import {saveLocation, setLocale} from "./localStorage";

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
      'getSection'
    ]),
    getThemeList() {
      return themeList(this);
    }
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
      'setSection'
    ]),
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
    removeAllCss,
    // refreshLocation 方法可以获取当前位置，并且更新进度条，最后将当前位置保存到本地存储中
    refreshLocation() {
      const currentLocation = this.getCurrentBook.rendition.currentLocation();
      if (!currentLocation.start) return;
      const startCfi = currentLocation.start.cfi;
      const progress = this.getCurrentBook.locations.percentageFromCfi(startCfi);
      this.setProgress(Math.floor(progress * 100));
      this.setSection(currentLocation.start.index);
      saveLocation(this.getFileName, startCfi);
    },
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
    }
  }
}
