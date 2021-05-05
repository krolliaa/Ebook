const book = {
  state: {
    fileName: '', // URL后缀
    menuVisible: false, // 菜单和标题栏是否显示
    settingVisible: -1, // -1:不显示 || 0：字体大小 || 1：主题设置 || 2：进度条 || 3：菜单
    defaultFontSize: 16, // 默认字体大小
    currentBook: null, // 获取当前页面的书
    defaultFontFamily: 'Default', // 默认字体样式
    fontFamilyPopUpVisible: false, // 字体样式上拉框是否显示
    defaultTheme: 'Default', // 默认主题
    bookAvailable: false, // 书籍是否解析完成分页完毕
    progress: 0, // 进度
    section: 0, // 章节
    cover: null, // 图书封面
    metadata: null, // 图书信息
    navigation: null, // 图书目录
    offsetY: 0, // 上下偏移量,
    isBookmark: false, // 当前页是否为书签页
  },
  mutations: {
    SET_FILENAME: (state, newFileName) => {
      state.fileName = newFileName;
    },
    SET_MENU_VISIBLE: (state, visible) => {
      state.menuVisible = visible;
    },
    SET_SETTING_VISIBLE: (state, key) => {
      state.settingVisible = key;
    },
    SET_DEFAULT_FONT_SIZE: (state, fontSize) => {
      state.defaultFontSize = fontSize;
    },
    SET_CURRENT_BOOK: (state, currentBook) => {
      state.currentBook = currentBook;
    },
    SET_DEFAULT_FONT_FAMILY: (state, newFontFamily) => {
      state.defaultFontFamily = newFontFamily;
    },
    SET_FONT_FAMILY_POP_UP_VISIBLE: (state, visible) => {
      state.fontFamilyPopUpVisible = visible;
    },
    SET_DEFAULT_THEME: (state, newTheme) => {
      state.defaultTheme = newTheme;
    },
    SET_BOOK_AVAILABLE: (state, available) => {
      state.bookAvailable = available;
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress;
    },
    SET_SECTION: (state, section) => {
      state.section = section;
    },
    SET_COVER: (state, cover) => {
      state.cover = cover;
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata;
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation;
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY;
    },
    SET_IS_BOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark;
    },
  }
}
export default book;
