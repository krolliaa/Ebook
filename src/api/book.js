import axios from "axios";

export function home2() {
  console.log("我是：" + process.env.VUE_APP_BOOK_URL);
  return axios({
    method: 'get',
    // 模仿后端数据接口，本机接口即可，放在mockjs
    // 其配置在 index.js 里头
    url: `${process.env.VUE_APP_BOOK_URL}/book/home`
  })
}
