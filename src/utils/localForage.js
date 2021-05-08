import localForage from 'localforage'

// 全部采用异步的方式 设置数据
export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function (err) {
    if (cb2) cb2(err)
  })
}

// 获取数据
export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}

// 删除数据
export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function () {
    cb()
  }).catch(function (err) {
    cb2(err)
  })
}

// 清空 indexDB
export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function () {
    cb()
  }).catch(function (err) {
    cb2(err)
  })
}

// 获取长度
export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      console.log(numberOfKeys)
    }).catch(function (err) {
    console.log(err)
  })
}

// 遍历，获取每个元素
export function iteratorLocalForage() {
  localForage.iterate(function (value, key, iterationNumber) {
    console.log([key, value])
  }).then(function () {
    console.log('Iteration has completed')
  }).catch(function (err) {
    console.log(err)
  })
}

// 判断当前浏览器是否支持 indexDB，不支持无法提供离线缓存功能
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
