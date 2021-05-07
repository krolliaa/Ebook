<template>
  <!--随机推荐栏目-->
  <div class="flap-card-wrapper">
    <!--是否显示动画取决于runFlapCardAnimation-->
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-if="ifShowFlapCard">
      <!--设置是否显示动画卡片，当加载到图书就不显示-->
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-semi-circle">
          <div class="flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <!--设置小球散布：flapCard.scss-->
      <div class="point-wrapper" v-if="ifShowPoint">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="(item, index) in pointList"
             :key="index"></div>
      </div>
    </div>
    <!--设置推荐出书籍-->
    <!--runBookCardAnimation决定是否显示动画效果，ifShowBookCard决定是否显示图书-->
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-if="ifShowBookCard">
      <div class="book-card-wrapper">
        <!--数据data是从BookHome.vue的random传递过来的，random是随机挑选的一本书-->
        <!--显示图书封面-->
        <div class="img-wrapper">
          <!--图片懒加载，视野区优先加载，使页面更加流畅-->
          <img class="img" v-lazy="data.cover">
        </div>
        <!--显示图书内容-->
        <div class="content-wrapper">
          <!--所属书名-->
          <div class="title">{{data.title}}</div>
          <!--所属作者-->
          <div class="author sub-title-medium">{{data.author}}</div>
          <!--所属学科-->
          <div class="category">{{categoryText()}}</div>
        </div>
        <!--立即阅读，显示图书详情-->
        <div class="read-btn" @click.stop="showBookDetail">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <!--设置关闭按钮-->
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import {categoryText, showBookDetail} from "../../utils/book";

  export default {
    name: "FlapCard",
    props: {
      data: Object
    },
    data() {
      return {
        pointList: [],
        flapCardList: [
          {
            r: 255,
            g: 102,
            _g: 102,
            b: 159,
            imgLeft: 'url(' + require('@/assets/images/gift-left.png') + ')',
            imgRight: 'url(' + require('@/assets/images/gift-right.png') + ')',
            backgroundSize: '50% 50%',
            zIndex: 100,
            rotateDegree: 0
          },
          {
            r: 74,
            g: 171,
            _g: 171,
            b: 255,
            imgLeft: 'url(' + require('@/assets/images/compass-left.png') + ')',
            imgRight: 'url(' + require('@/assets/images/compass-right.png') + ')',
            backgroundSize: '50% 50%',
            zIndex: 99,
            rotateDegree: 0
          },
          {
            r: 255,
            g: 198,
            _g: 198,
            b: 102,
            imgLeft: 'url(' + require('@/assets/images/star-left.png') + ')',
            imgRight: 'url(' + require('@/assets/images/star-right.png') + ')',
            backgroundSize: '50% 50%',
            zIndex: 98,
            rotateDegree: 0
          },
          {
            r: 255,
            g: 102,
            _g: 102,
            b: 159,
            imgLeft: 'url(' + require('@/assets/images/heart-left.png') + ')',
            imgRight: 'url(' + require('@/assets/images/heart-right.png') + ')',
            backgroundSize: '50% 50%',
            zIndex: 97,
            rotateDegree: 0
          },
          {
            r: 59,
            g: 201,
            _g: 201,
            b: 22,
            imgLeft: 'url(' + require('@/assets/images/crown-left.png') + ')',
            imgRight: 'url(' + require('@/assets/images/crown-right.png') + ')',
            backgroundSize: '50% 50%',
            zIndex: 96,
            rotateDegree: 0
          }
        ],
        front: 0,
        back: 1,
        intervalTime: 25,
        runPointAnimation: false,
        runFlapCardAnimation: false,
        runBookCardAnimation: false,
        ifShowBookCard: false,
        ifShowFlapCard: true,
        ifShowPoint: true
      }
    },
    created() {
      // 创建 18 个小球
      for (let i = 0; i < 18; i++) {
        this.pointList.push({})
      }
    },
    methods: {
      showBookDetail() {
        // 显示图书细节 => 跳转到图书详情页面
        alert("阅读细节完成！");
        console.log(this.data);
        if (this.data) {
          showBookDetail(this, this.data);
        }
      },
      categoryText() {
        return categoryText(this.data.category, this)
      },
      close() {
        this.$emit('close')
      },
      startAnimation() {
        // 将runFlapCardAnimation设为true表示需要开始动画
        this.runFlapCardAnimation = true;
        // 显示卡片翻转
        setTimeout(() => {
          this.startFlapCardAnimation();
        }, 300);
        // 弹出小球
        setTimeout(() => {
          this.startPointAnimation()
        }, 300);
        // 隐藏动画，显示推荐的书籍
        setTimeout(() => {
          this.stopAnimation()
          this.showBookCard()
        }, 2500)
      },
      // 停止动画
      stopAnimation() {
        // 清除定时器任务 卡片任务
        clearInterval(this.task);
        // 停止卡片动画
        this.runFlapCardAnimation = false
        // 停止弹出小球动画
        this.runPointAnimation = false
      },
      // 开启卡片显示的动画 循环播放，直至图书加载完成【这里用2.5s模拟加载过程】
      startFlapCardAnimation() {
        // 做一些动画前的准备，这里封装成了prepare()方法
        this.prepare();
        // 开启定时任务开始旋转
        this.task = setInterval(() => {
          this.rotateSemiCircle()
        }, this.intervalTime)
      },
      // 旋转前的准备
      prepare() {
        // // 获取下一个动画卡片，起始时下一张卡片index默认为 1
        const backFlapCard = this.flapCardList[this.back];
        // 获取下一张卡片的左半部分
        const backLeftSemiCircle = this.$refs.left[this.back];
        // 翻转成180度，因为要贴到上一张卡片的右边，提前翻转180度到右边
        backFlapCard.rotateDegree = 180;
        // 下一张卡片左半部分颜色提前变深，这样等等才能变浅，有个变动效果
        backFlapCard._g = backFlapCard.g - 5 * 9
        // 当前左半部分旋转度设置为0，传递下一张卡片和左半部分
        this.rotate(backFlapCard, backLeftSemiCircle);
      },
      // 实现旋转 => 增加样式
      rotate(item, dom) {
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
        dom.style.backgroundColor = `rgb(${item.r} ,${item._g} ,${item.b})`;
      },
      // 旋转
      rotateSemiCircle() {
        // 获取当前卡片
        const frontFlapCard = this.flapCardList[this.front];
        // 获取下一张卡片
        const backFlapCard = this.flapCardList[this.back];
        // 获取当前卡片的右半部分
        const frontRightSemiCircle = this.$refs.right[this.front];
        // 获取下一张卡片的左半部分
        const backLeftSemiCircle = this.$refs.left[this.back];
        // 当前卡片旋转度增加
        frontFlapCard.rotateDegree += 10;
        // 下一章卡片旋转度减少 prepare已将右半部分初始值设置为180
        backFlapCard.rotateDegree -= 10;
        // 当前卡片右半部分颜色加深
        if (frontFlapCard.rotateDegree < 90) {
          frontFlapCard._g -= 5;
        }
        // 下一张卡片左半部分颜色变浅
        if (backFlapCard.rotateDegree < 90) {
          backFlapCard._g += 5;
        }
        // 如果垂直了，下一张卡片的 zIndex 要增加
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2;
        }
        // 当前卡片右半实现翻动效果
        this.rotate(frontFlapCard, frontRightSemiCircle);
        // 下一张卡片左半实现翻动效果
        this.rotate(backFlapCard, backLeftSemiCircle);
        // 当前卡片右半部分翻动180度之后就重置
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.reset();
        }
      },
      reset() {
        // 获取当前卡片
        const frontFlapCard = this.flapCardList[this.front];
        // 获取下一张卡片
        const backFlapCard = this.flapCardList[this.back];
        // 获取当前卡片的右半部分
        const frontRightSemiCircle = this.$refs.right[this.front];
        // 获取下一张卡片的左半部分
        const backLeftSemiCircle = this.$refs.left[this.back];
        // 重置当前卡片的旋转度为 0
        frontFlapCard.rotateDegree = 0;
        // 重置下一张卡片的旋转度为 0
        backFlapCard.rotateDegree = 0;
        // 恢复当前卡片颜色
        frontFlapCard._g = frontFlapCard.g;
        // 恢复下一张卡片颜色
        backFlapCard._g = backFlapCard.g;
        // 当前卡片旋转恢复
        this.rotate(frontFlapCard, frontRightSemiCircle);
        // 下一张卡片旋转恢复
        this.rotate(backFlapCard, backLeftSemiCircle);
        // 改变front和back的值
        this.front++;
        this.back++;
        // 当超过值时重置front和back
        if (this.front >= this.flapCardList.length) {
          this.front = 0;
        }
        if (this.back >= this.flapCardList.length) {
          this.back = 0;
        }
        // 获取卡片列表的长度，用于改变 zIndex 优先级
        const len = this.flapCardList.length;
        // 这里实现了一个算法
        // 比如当前为第一张卡片翻转：
        // (0 - 0 + 5) % 5 = 0 ===> 100 - 0 = 100;
        // (1 - 0 + 5) % 5 = 1 ===> 100 - 1 = 99;
        // ......
        // 依次类推
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len);
        });
        // 准备翻转
        this.prepare();
      },
      // 显示推荐书籍
      showBookCard() {
        this.ifShowBookCard = true
        this.runBookCardAnimation = true
        this.ifShowFlapCard = false
        this.ifShowPoint = false
      },
      // 弹出小球
      startPointAnimation() {
        this.runPointAnimation = true
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      // 添加卡片样式
      semiCircleStyle(item, direction) {
        return {
          backgroundColor: `rgb(${item.r} ,${item.g} ,${item.b})`,
          backgroundImage: direction === 'left' ? item.imgLeft : item.imgRight,
          backgroundSize: item.backgroundSize
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .flap-card-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    @include center;

    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      background: white;
      border-radius: px2rem(5);
      transform: scale(0);
      opacity: 0;

      &.animation {
        animation: scale .3s ease-in both;
      }

      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        70% {
          transform: scale(1.3);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .flap-card {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1500;
        margin: auto;
        width: px2rem(48);
        height: px2rem(48);

        .flap-card-semi-circle {
          width: 100%;
          height: 100%;
          display: flex;

          .flap-card-semi-circle-left {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-color: #ffc666;
            background-repeat: no-repeat;
            background-position: center right;
            border-radius: px2rem(24) 0 0 px2rem(24);
            transform-origin: right;
            backface-visibility: hidden;
          }

          .flap-card-semi-circle-right {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center left;
            border-radius: 0 px2rem(24) px2rem(24) 0;
            transform-origin: left;
            backface-visibility: hidden;
          }
        }
      }

      .point-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2000;
        @include center;

        .point {
          @include absCenter;
          z-index: 3000;
          border-radius: 50%;
          transform: scale(0);

          &.animation {
            @for $i from 1 to length($moves) + 1 {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }

    .book-card {
      position: relative;
      bottom: px2rem(15);
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;

      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }

      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;

        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;

          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }

        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);

          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }

          .author {
            margin-top: px2rem(10);
            text-align: center;
          }

          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }

        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }

    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(80);
      z-index: 1100;
      width: 100%;
      @include center;

      .icon-close {
        display: inline-block;
        width: px2rem(45);
        height: px2rem(45);
        font-size: px2rem(25);
        color: white;
        background: #333;
        border-radius: 50%;
        @include center;
      }
    }
  }
</style>
