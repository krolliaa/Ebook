<template>
  <div class="shelf-category-wrapper">
    <div class="shelf-category" :class="{'is-edit': isEditMode}" v-if="data.itemList.length > 0">
      <div class="shelf-category-item" v-for="(item, index) in data.itemList" :key="index">
        <img class="shelf-category-img" v-lazy="item.cover"/>
      </div>
    </div>
    <div class="shelf-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ShelfCategory"
  }
</script>

<style scoped>

</style>
