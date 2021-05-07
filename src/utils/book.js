import {realPx} from "./utils";
import {getReadTime} from "./localStorage";

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
