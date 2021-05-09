<template>
  <div class="book-shelf-footer">
    <!--遍历标签-->
    <div class="book-shelf-tab-wrapper" v-for="(item, index) in tabs" :key="index" @click="onTabClick(item)">
      <!--显示标签 当有选择的图书才显示选择样式-->
      <div class="book-shelf-tab">
        <!--是否私密，不是私密显示设置私密图书样式-->
        <div class="icon-private tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 1 && !isPrivate"></div>
        <!--是私密显示关闭私密阅读样式-->
        <div class="icon-private-see tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 1 && isPrivate"></div>
        <!--未下载：开启离线-->
        <div class="icon-download tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 2 && !isDownload"></div>
        <!--已下载: 删除-->
        <div class="icon-download-remove tab-icon" :class="{'is-selected': isSelected}"
             v-if="item.index === 2 && isDownload"></div>
        <!--移动到...-->
        <div class="icon-move tab-icon" :class="{'is-selected': isSelected}" v-if="item.index === 3"></div>
        <!--移出书架-->
        <div class="icon-shelf tab-icon" :class="{'is-selected': isSelected}" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4, 'is-selected': isSelected}">{{label(item)}}
        </div>
      </div>
    </div>
    <!--因为上拉框的内容很类似，所以这里做成同一个组件-->
    <!--popTitle: 标题-->
    <!--confirmText: 为开启/关闭-->
    <!--isRemoveText：是否移出-->
    <!--cancelText：取消文字-->
    <!--onConfirm：执行的方法-->
    <popup ref="popup"
           :title="popTitle"
           :confirmText="confirmText"
           :isRemoveText="isRemoveText"
           :cancelText="$t('shelf.cancel')"
           @confirm="onConfirm"></popup>
    <shelf-group-dialog :visible.sync="ifGroupDialogShow"
                        :data="data"
                        :bookList="bookList"
                        :category="category"
                        :isInGroup="isInGroup"
                        @group="groupEdit"></shelf-group-dialog>
  </div>
</template>

<script>
  import Popup from "./Popup";
  import ShelfGroupDialog from "./ShelfGroupDialog";

  export default {
    name: "ShelfFooter",
    components: {
      Popup,
      ShelfGroupDialog
    },
    props: {
      data: Array,
      bookList: Array,
      isInGroup: Boolean,
      category: Object
    },
    data() {
      return {
        popTitle: '',
        confirmText: '',
        isRemoveText: false,
        ifShowPopup: false,
        ifGroupDialogShow: false,
        onConfirm: function () {
        }
      }
    },
    computed: {
      // 是否选择
      isSelected() {
        if (this.data) {
          // 找到就返回 true
          return this.data.some(item => item.selected);
        } else {
          return false;
        }
      },
      // 是否私密
      isPrivate() {
        if (!this.isSelected) {
          return false;
        } else {
          if (this.data) {
            return this.data.every(item => {
              if (item.selected) {
                return item.private;
              } else {
                return true;
              }
            })
          } else {
            return false;
          }
        }
      },
      // 是否下载
      isDownload() {
        if (!this.isSelected) {
          return false;
        } else {
          if (this.data) {
            return this.data.every(item => {
              if (item.selected) {
                return item.cache;
              } else {
                return true;
              }
            })
          } else {
            return false;
          }
        }
      },
      // 四个标签
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      }
    },
    methods: {
      // 所选书籍
      selectedBooks() {
        const selectedBooks = [];
        this.data.forEach(item => {
          if (item.selected) {
            selectedBooks.push(item);
          }
        })
        return selectedBooks;
      },
      // 显示数据，在显示的时候就循环遍历条件 绝妙的思想
      // 这样就不用单独写方法判断了
      label(item) {
        switch (item.index) {
          case 1:
            // 私密就选择"关闭私密阅读"否则显示"开启私密"
            return this.isPrivate ? item.label2 : item.label;
          case 2:
            // 删除下载
            return this.isDownload ? item.label2 : item.label;
          default:
            return item.label;
        }
      },
      // 根据传入的 item 选择功能
      onTabClick(item) {
        if (item.index === 1) {
          // 是否私密阅读
          this.showPrivate();
        } else if (item.index === 2) {
          // 是否离线下载
          this.showDownload();
        } else if (item.index === 3) {
          // 是否到分组
          this.showGroupDialog();
        } else if (item.index === 4) {
          // 是否移出书架
          this.showRemove();
        }
      },
      // 是否私密的上拉框
      showPrivate() {
        if (this.isSelected) {
          // 是私密就显示为设置非私密上拉框，非私密就显示成私密上拉框
          if (!this.isPrivate) {
            this.showPopup(this.$t('shelf.setPrivateTitle'), this.$t('shelf.open'), this.onSetPrivate);
          } else {
            this.showPopup(this.$t('shelf.closePrivateTitle'), this.$t('shelf.close'), this.onCancelPrivate)
          }
        }
      },
      // 是否下载的上拉框
      showDownload() {
        if (this.isSelected) {
          if (!this.isDownload) {
            this.showPopup(this.$t('shelf.setDownloadTitle'), this.$t('shelf.open'), this.onSetDownload)
          } else {
            this.showPopup(this.$t('shelf.removeDownloadTitle'), this.$t('shelf.delete'), this.onRemoveDownload, true)
          }
        }
      },
      // 弹出分组
      showGroupDialog() {
        if (this.isSelected) {
          // 有选择就可以设置移动分组，弹出分组框
          this.ifGroupDialogShow = true;
        }
      },
      // 移出书架的上拉框
      showRemove() {
        if (this.isSelected) {
          let msg;
          // 显示的书籍是否为一本，是一本就显示书名
          // 一本以上就不显示书名
          if (this.selectedBooks.length === 1) {
            msg = this.$t('shelf.removeBookTitle').replace('$1', '《' + this.selectedBooks[0].title + '》')
          } else {
            msg = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
          }
          this.showPopup(msg, this.$t('shelf.removeBook'), this.removeBook, true);
        }
      },
      //显示上拉框
      showPopup(title, confirmText, onConfirm, isRemoveText = false) {
        // title 为标题
        // confirmText 为开启/关闭
        // onConfirm 为要执行的方法
        // isRemoveText 是否移出
        this.popTitle = title;
        this.confirmText = confirmText;
        this.onConfirm = onConfirm;
        this.isRemoveText = isRemoveText;
        this.$refs.popup.show();
      },
      // 设置私密阅读
      onSetPrivate() {
        this.$emit('setPrivate', true);
      },
      // 取消私密阅读
      onCancelPrivate() {
        this.$emit('setPrivate', false);
      },
      // 离线下载
      onSetDownload() {
        this.$emit('setDownload', true)
      },
      // 移除离线下载
      onRemoveDownload() {
        this.$emit('setDownload', false)
      },
      // 分组编辑
      groupEdit(operation, group) {
        this.$emit('groupEdit', operation, group)
      },
      // 移除书籍
      removeBook() {
        this.$emit('removeBook')
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);

    .book-shelf-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;

      .book-shelf-tab {
        width: 100%;
        height: 100%;
        @include columnCenter;

        .tab-icon {
          font-size: px2rem(20);
          color: #666;
          opacity: .5;

          &.icon-shelf {
            color: $color-pink;
          }

          &.icon-download {
            font-size: px2rem(22);
          }

          &.is-selected {
            opacity: 1;
          }
        }

        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          opacity: .5;

          &.remove-text {
            color: $color-pink;
          }

          &.is-selected {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
