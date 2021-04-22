<template>
  <div id="app">
    <span class="text1">ABCDEFG</span><br/>
    <span class="text2">HIJKLMN</span>
    <router-view/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  const getters = {
    a: () => 1,
    b: () => 2
  }

  function fn(keys) {
    let data = {};
    keys.forEach(key => {
      if (getters.hasOwnProperty(key)) {
        data[key] = getters[key];
      }
    });
    return data;
  }

  export default {
    computed: {
      ...mapGetters(['getBookTest']),
      ...fn(['a', 'b', 'c'])
    },
    mounted() {
      this.$store.dispatch("setTest", 10);
      // console.log(this.$store.state.book.test);
      // console.log(this.getBookTest);
      console.log(this.a, this.b);
    }
  };
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');
    let fontSize = window.innerWidth / 10;
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px';
  });
</script>

<style lang="scss" scoped>
  @import "./assets/styles/global.scss";

  .text1 {
    font-family: "Days One";
    font-size: px2rem(20);
    color: chocolate;
  }

  .text2 {
    font-family: "Montserrat";
    font-size: px2rem(20);
    color: orangered;
  }
</style>
