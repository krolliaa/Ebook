<template>
  <div class="book-shelf-wrapper">
    <transition-group>
      <div class="book-shelf-item" v-for="(item, index) in bookData" :key="item.id">
        <div class="book-img-wrapper" ref="bookImg">
        </div>
        <div class="book-title-wrapper">
          <span class="book-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: "Shelf"
  }
</script>

<style scoped>

</style>
