<template>
  <div class="book-store">
    <!--
        在开发中经常有从列表跳到详情页，
         然后返回详情页的时候需要缓存列表页的状态（比如滚动位置信息），
         这个时候就需要保存状态，要缓存状态；
         vue里提供了keep-alive组件用来缓存状态。
    -->
    <keep-alive>
      <transition :name="transitionName">
        <router-view class="child-view"/>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
  import {os} from '../../utils/utils.js'
  import {clearLocalStorage} from "../../utils/localStorage";

  export default {
    name: "index",
    mounted() {
      clearLocalStorage();
    },
    data() {
      return {
        transitionName: ''
      }
    },
    computed: {
      os() {
        return os();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (to.query.key) {
          vm.menuIndex = parseInt(to.query.key);
        }
      })
    },
    // 跳转页面 不同进度的页面有不同的跳转动画效果
    beforeRouteUpdate(to, from, next) {
      if (to.meta.key > from.meta.key) {
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }
      next();
    }
  }
  window.onload = function () {
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    })
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault()
    })
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-store {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    overflow: hidden;

    .child-view {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      min-width: 200px;
      max-width: 640px;
      transform: translate3d(0, 0, 0);
      opacity: 1;

      &.slide-left-enter, &.slide-right-leave-to {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
      }

      &.slide-left-leave-to, &.slide-right-enter {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
      }

      &.slide-left-enter-active, &.slide-left-leave-active {
        transition: all .2s linear;
      }
    }
  }
</style>
