<template>
  <div class="home-title-wrapper">
    <!--栏目标题-->
    <div class="label">{{label}}</div>
    <!--点击更换或者点击查看全部时：PC端+移动端都做-->
    <div class="btn" :class="{'touch': ifOnTouch}" @touchstart="onTouchStart" @touchend="onTouchEnd"
         @mousedown="onTouchStart" @mouseup="onTouchEnd" @click="click">{{btn}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "TitleView",
    props: {
      // 接收栏目标题
      label: String,
      // 接收更换/查看全部字样
      btn: String
    },
    data() {
      return {
        ifOnTouch: false
      }
    },
    methods: {
      onTouchStart() {
        this.ifOnTouch = true
      },
      onTouchEnd() {
        this.ifOnTouch = false
      },
      click() {
        if (this.btn === '查看全部精选')
          alert('暂时只有这6本书哦~');
        else if (this.btn === 'See all Featured') {
          alert('There are only 6 books for now~');
        }
        // 在父组件实现具体的操作比如更换、查看全部
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .home-title-wrapper {
    width: 100%;
    padding: px2rem(15) px2rem(10);
    box-sizing: border-box;
    @include top;

    .label {
      flex: 1;
      font-size: px2rem(18);
      color: #333;
      font-weight: bold;
    }

    .btn {
      font-size: px2rem(14);
      color: rgba(64, 158, 255, 1);

      &.touch {
        color: rgba(64, 158, 255, .5);
      }
    }
  }
</style>
