<template>
  <div>
    <book-home></book-home>
  </div>
</template>

<script>
  import BookHome from "./BookHome";

  export default {
    name: "index",
    components: {
      BookHome
    }
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
