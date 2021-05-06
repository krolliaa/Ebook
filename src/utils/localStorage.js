import Storage from 'web-storage-cache';

const localStorage = new Storage();

export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, {exp: expire});
}

export function getLocalStorage(key) {
  return localStorage.get(key);
}

export function removeLocalStorage(key) {
  return localStorage.delete(key);
}

export function clearLocalStorage() {
  return localStorage.clear()
}

// 获取渲染的电子书
export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`);
  // 如果该书没有任何设置，给予一个空对象，然后设置传入的 key
  if (!book) {
    book = {}
  }
  book[key] = value;
  // bookmark 到这里仍然有数据
  setLocalStorage(`${fileName}-info`, book);
}

export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`);
  if (book) {
    return book[key];
  } else {
    return null;
  }
}

// 字号
export function setFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize);
}

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize');
}

// 字体样式
export function setFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily);
}

export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily');
}

// 国际化
export function getLocale() {
  return getLocalStorage('locale');
}

export function setLocale(locale) {
  setLocalStorage('locale', locale);
}

// 主题
export function saveTheme(fileName, value) {
  setBookObject(fileName, 'theme', value);
}

export function getTheme(fileName) {
  return getBookObject(fileName, 'theme');
}

// 进度
export function saveLocation(fileName, startCfi) {
  setBookObject(fileName, 'location', startCfi);
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location');
}

// 本书阅读时间
export function saveReadTime(fileName, readTime) {
  setBookObject(fileName, 'readTime', readTime);
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'readTime');
}

// 书签
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark);
}

export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark');
}

// 书城首页
export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}
