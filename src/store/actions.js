const actions = {
  setFileName: ({commit, state}, newFileName) => {
    return commit("SET_FILENAME", newFileName);
  },
  setMenuVisible: ({commit, state}, visible) => {
    return commit('SET_MENU_VISIBLE', visible);
  },
  setSettingVisible: ({commit, state}, key) => {
    return commit('SET_SETTING_VISIBLE', key);
  },
  setDefaultFontSize: ({commit, state}, fontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', fontSize);
  },
  setCurrentBook: ({commit, state}, currentBook) => {
    return commit('SET_CURRENT_BOOK', currentBook);
  },
  setDefaultFontFamily: ({commit, state}, newFontFamily) => {
    return commit('SET_DEFAULT_FONT_FAMILY', newFontFamily);
  },
  setFontFamilyPopUpVisible: ({commit, state}, visible) => {
    return commit('SET_FONT_FAMILY_POP_UP_VISIBLE', visible);
  },
  setDefaultTheme: ({commit, state}, newTheme) => {
    return commit('SET_DEFAULT_THEME', newTheme);
  },
  setBookAvailable: ({commit, state}, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable);
  },
  setProgress: ({commit, state}, progress) => {
    return commit('SET_PROGRESS', progress);
  },
  setSection: ({commit, state}, section) => {
    return commit('SET_SECTION', section);
  },
}

export default actions
