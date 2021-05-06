<template>
  <!--随机推荐栏目-->
  <div class="flap-card-wrapper">

    <!--设置是否显示动画卡片，当加载到图书就不显示-->
    <div class="flap-card-bg" v-if="ifShowFlapCard">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-semi-circle">
          <div class="flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>

      <div class="point-wrapper" v-if="ifShowPoint">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="(item, index) in pointList"
             :key="index"></div>
      </div>

    </div>

    <!--设置关闭按钮-->
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FlapCard",
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
    methods: {
      close() {
        this.$emit('close')
      },
      startAnimation() {
        console.log("实现了动画效果");
      },
      stopAnimation() {
        console.log("关闭了动画效果");
      },
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
      /*transform: scale(0);*/
      /*opacity: 0;*/

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
        }
      }
    }

    .book-card {
      position: relative;
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
      }
    }

    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
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
