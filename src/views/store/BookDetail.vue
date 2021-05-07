<template>
  <div class="book-detail">
    <!--显示书籍的标题-->
    <detail-title @back="back"
                  :showShelf="true"
                  ref="title"></detail-title>
  </div>
</template>

<script>
  import DetailTitle from "../../components/detail/DetailTitle";

  export default {
    name: "BookDetail",
    components: {
      DetailTitle
    },
    methods: {
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>
