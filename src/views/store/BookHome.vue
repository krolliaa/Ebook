<template>
  <div class="book-home">
    <search-bar
      :ifShowSearchPage="ifShowSearchPage"
      :ifShowHotSearch="ifShowHotSearch"
      ref="searchBar"
    ></search-bar>
  </div>
</template>

<script>
  import SearchBar from "../../components/home/SearchBar";

  export default {
    name: "BookHome",
    components: {
      SearchBar
    },
    data() {
      return {
        ifShowSearchPage: false,
        ifShowHotSearch: true,
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-home {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: px2rem(16);
    color: #666;

    .book-list-wrapper {
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .banner-wrapper {
        width: 100%;
        padding: px2rem(10);
        box-sizing: border-box;

        .banner {
          width: 100%;
          height: px2rem(150);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .recommend {
        margin-top: px2rem(20);
      }

      .featured {
        margin-top: px2rem(20);
      }

      .category-list-wrapper {
        margin-top: px2rem(20);
      }

      .category {
        margin-top: px2rem(20);
      }
    }
  }
</style>
