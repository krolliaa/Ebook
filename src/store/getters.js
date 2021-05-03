const getters = {
  getFileName: state => {
    return state.book.fileName;
  },
  getMenuVisible: state => {
    return state.book.menuVisible;
  },
  getSettingVisible: state => {
    return state.book.settingVisible;
  },
  getDefaultFontSize: state => {
    return state.book.defaultFontSize;
  },
  getCurrentBook: state => {
    return state.book.currentBook;
  },
  getDefaultFontFamily: state => {
    return state.book.defaultFontFamily;
  },
  getFontFamilyPopUpVisible: state => {
    return state.book.fontFamilyPopUpVisible;
  },
  getDefaultTheme: state => {
    return state.book.defaultTheme;
  },
  getBookAvailable: state => {
    return state.book.bookAvailable;
  },
  getProgress: state => {
    return state.book.progress;
  },
  getSection: state => {
    return state.book.section;
  }
}

export default getters
