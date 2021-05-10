import {realPx} from "./utils";
import {getReadTime} from "./localStorage";
import {setLocalStorage, getLocalStorage} from "./localStorage";

const BOOK_SHELF_KEY = 'bookShelf';

// 字号列表
export const FONT_SIZE_LIST = [
  {fontSize: 12},
  {fontSize: 14},
  {fontSize: 16},
  {fontSize: 18},
  {fontSize: 20},
  {fontSize: 22},
  {fontSize: 24}
]

// 字体样式列表
export const FONT_FAMILY = [
  {fontFamily: 'Default'},
  {fontFamily: 'Cabin'},
  {fontFamily: 'Days One'},
  {fontFamily: 'Montserrat'},
  {fontFamily: 'Tangerine'}
]

// 获取种类
export const categoryList = {
  'ComputerScience': 1,
  'SocialSciences': 2,
  'Economics': 3,
  'Education': 4,
  'Engineering': 5,
  'Environment': 6,
  'Geography': 7,
  'History': 8,
  'Laws': 9,
  'LifeSciences': 10,
  'Literature': 11,
  'Biomedicine': 12,
  'BusinessandManagement': 13,
  'EarthSciences': 14,
  'MaterialsScience': 15,
  'Mathematics': 16,
  'MedicineAndPublicHealth': 17,
  'Philosophy': 18,
  'Physics': 19,
  'PoliticalScienceAndInternationalRelations': 20,
  'Psychology': 21,
  'Statistics': 22
}

// 主题列表
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    }
  ]
}

// 查找图书
export function findBook(fileName) {
  const bookList = getLocalStorage(BOOK_SHELF_KEY)
  return flatBookList(bookList).find(item => item.fileName === fileName)
}

// 动态添加主题样式文件
export function addCss(href) {
  const link = document.createElement('link');
  const head = document.getElementsByTagName('head')[0];
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  head.appendChild(link);
}

// 用于 removeAllCss 函数中
export function removeCss(href) {
  const links = document.getElementsByTagName('link');
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link);
    }
  }
}

// 移出所有CSS样式
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
}

// 获取阅读时长，以分钟为单位
export function getReadTimeByMinute(fileName) {
  const readTime = getReadTime(fileName);
  // 如果本地存储没有阅读时长，则设置为 0
  if (!readTime) {
    return 0;
  } else {
    return Math.ceil(readTime / 60);
  }
}

// 数组扁平化 ===> 目录
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))));
}

// 获取当前学科
export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.computerScience')
    case 2:
      return vue.$t('category.socialSciences')
    case 3:
      return vue.$t('category.economics')
    case 4:
      return vue.$t('category.education')
    case 5:
      return vue.$t('category.engineering')
    case 6:
      return vue.$t('category.environment')
    case 7:
      return vue.$t('category.geography')
    case 8:
      return vue.$t('category.history')
    case 9:
      return vue.$t('category.laws')
    case 10:
      return vue.$t('category.lifeSciences')
    case 11:
      return vue.$t('category.literature')
    case 12:
      return vue.$t('category.biomedicine')
    case 13:
      return vue.$t('category.businessandManagement')
    case 14:
      return vue.$t('category.earthSciences')
    case 15:
      return vue.$t('category.materialsScience')
    case 16:
      return vue.$t('category.mathematics')
    case 17:
      return vue.$t('category.medicineAndPublicHealth')
    case 18:
      return vue.$t('category.philosophy')
    case 19:
      return vue.$t('category.physics')
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return vue.$t('category.psychology')
    case 22:
      return vue.$t('category.statistics')
  }
}

// 跳转至图书详情页
export function showBookDetail(vue, book) {
  vue.$router.push({
    // 跳转路径
    path: '/book-store/detail',
    // 获取文件名和目录
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}

// 获取图书分类列表
export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ComputerScience'
    case 2:
      return 'SocialSciences'
    case 3:
      return 'Economics'
    case 4:
      return 'Education'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Psychology'
    case 22:
      return 'Statistics'
  }
}

// 将本书从书架中移除
export function removeFromBookShelf(bookItem) {
  // 获取本地存储的书架数据
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  // 遍历整个bookList
  bookList = bookList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName);
    }
    return item.fileName !== bookItem.fileName;
  });
  // 将数据存储到本地
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

// 将本书添加至书架
export function addToShelf(book) {
  // 获取本地存储的书架数据
  let bookList = getLocalStorage(BOOK_SHELF_KEY);
  // 获取除了添加模块的其它所有在书架上的书
  bookList = clearAddFromBookList(bookList);
  // 类型为默认
  book.type = 1;
  // 添加至书架
  bookList.push(book);
  // 将书架中的id全部改动，不要0
  bookList.forEach((item, index) => {
    item.id = index + 1;
  });
  // 添加最后添加的模块 类型为 3
  appendAddToBookList(bookList);
  // 存储至本地
  setLocalStorage(BOOK_SHELF_KEY, bookList);
}

// 获取除了添加模块的其它所有在书架上的书
export function clearAddFromBookList(bookList) {
  return bookList.filter(item => {
    return item.type !== 3
  });
}

// 添加最后添加的模块
export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

// 中英文切换
export function switchLocale(vue) {
  if (vue.$i18n.locale === 'en') {
    vue.$i18n.locale = 'cn'
  } else {
    vue.$i18n.locale = 'en'
  }
  setLocalStorage('locale', vue.$i18n.locale)
}

// 重置
export function reset(vue) {
  vue.$store.dispatch('setMenuVisible', false)
  vue.$store.dispatch('setSettingVisible', 0)
  vue.$store.dispatch('setFontFamilyVisible', false)
  vue.$store.dispatch('setSpeakingIconBottom', realPx(58))
}

// 扁平化bookList => 用于在点击了搜索框
export function flatBookList(bookList) {
  // 如果 bookList 存在
  if (bookList) {
    // 获取默认图书和分组
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    });
    // 获取分组
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    // 对分组进行遍历获取默认图书id，赋予 index
    categoryList.forEach(item => {
      // 获取 index
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      });
      // 把
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          // 将分组里的图书插入到orgBookList
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}
