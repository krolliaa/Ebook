<template>
  <transition name="fade">
    <div class="shelf-title-wrapper" :class="{'hide-shadow': ifHideShadow}">

      <!--标题 是否进入编辑模式-->
      <div class="title">
        <span class="title-text">{{title}}</span>
        <span class="sub-title-text" v-show="isEditMode">{{selectedText}}</span>
      </div>

      <!--编辑按钮：取消/编辑-->
      <div class="btn-text-wrapper" @click="onEditClick" v-if="!ifGroupEmpty && !isDataEmpty">
        <span class="btn-text">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>

      <!--未明-->
      <div class="btn-text-wrapper" @click="changeGroup" v-if="ifGroupEmpty && !isDataEmpty">
        <span class="btn-text">{{$t('shelf.editGroup')}}</span>
      </div>

      <!--如果没有任何书籍的时候，就是死侍皮卡丘页面的时候 取代按钮显示中英文切换-->
      <div class="btn-text-wrapper" @click="changeLanguage" v-if="isDataEmpty">
        <span class="btn-text">{{$t('shelf.changeLanguage')}}</span>
      </div>

      <!--清除缓存-->
      <div class="btn-clear-wrapper" @click="clearCache" v-if="ifShowClear && !isDataEmpty">
        <span class="btn-clear">{{$t('shelf.clearCache')}}</span>
      </div>

      <!--返回按钮-->
      <!--返回按钮处于显示条件并且不处于编辑模式才显示 => 左上角 -->
      <div class="btn-back-wrapper" @click="back" v-if="ifShowBack && !isEditMode">
        <span class="icon-back"></span>
      </div>

      <!--显示返回按钮并且处于编辑模式才显示修改分组-->
      <div class="btn-back-wrapper" @click="changeGroup" v-if="ifShowBack && isEditMode">
        <span class="btn-text">{{$t('shelf.editGroup')}}</span>
      </div>

      <!--上拉框-->
      <popup ref="popup"
             :title="popupTitle"
             :thirdText="thirdText"
             :confirmText="confirmText"
             :isRemoveText="true"
             :cancelText="$t('shelf.cancel')"
             @confirm="onPopupDelete"
             @third="onPopupChange"></popup>

      <!--分组-->
      <shelf-group-dialog :visible.sync="ifGroupDialogShow"
                          :isEditGroupName="true"
                          :category="category"
                          @editGroupName="editGroupName"
                          ref="groupDialog"></shelf-group-dialog>
    </div>
  </transition>
</template>

<script>
  import Popup from "./Popup";
  import ShelfGroupDialog from "./ShelfGroupDialog";
  import {switchLocale} from "../../utils/book";

  export default {
    name: 'ShelfTitle',
    components: {
      Popup,
      ShelfGroupDialog
    },
    props: {
      // 是否处于编辑模式
      isEditMode: Boolean,
      // 是否显示返回按钮
      ifShowBack: Boolean,
      // 是否清除缓存
      ifShowClear: Boolean,
      // 分组是否为空
      ifGroupEmpty: Boolean,
      // 书籍信息
      data: Array,
      title: String,
      category: Object
    },
    data() {
      return {
        ifHideShadow: true,
        // 是否显示分组弹窗
        ifGroupDialogShow: false,
        // 是否删除分组
        isDeleteGroup: false
      }
    },
    computed: {
      // 判断书架是否为空（没有书）
      isDataEmpty() {
        return !this.data || this.data.filter(item => item.type !== 3).length === 0;
      },
      // 选择书籍
      selectedText() {
        // 如果等于0直接显示选择书籍 （书架下面：选择书籍）
        // 不等于0显示选择多少本书籍 （书架下面：已选择X本）
        return this.selectedNumber === 0 ? this.$t('shelf.selectBook') : (this.selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', this.selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', this.selectedNumber));
      },
      // 选中的书本数量
      selectedNumber() {
        // this.category 表示在分组里面
        // 如果是在分组里面，且分组存在书本内容，获取分组里的内容
        if (this.category && this.category.itemList) {
          return this.category.itemList.filter(item => item.selected).length;
        } else if (this.data) {
          // 否则就是默认的页面即不是在分组里面，当有书时遍历
          return this.data.filter(item => item.selected).length;
        } else {
          return 0;
        }
      },
      // 分组里面点击修改分组的上拉框信息
      thirdText() {
        // 是否点了删除分组
        if (this.isDeleteGroup) {
          return '';
        } else {
          // 返回修改分组名
          return this.$t('shelf.editGroupName');
        }
      },
      // 上拉框标题
      popupTitle() {
        // 如果要删除分组，显示是否删除分组的标题
        if (this.isDeleteGroup) {
          return this.$t('shelf.deleteGroupTitle')
        } else {
          // 否则不显示
          return ''
        }
      },
      // 验证信息
      confirmText() {
        if (this.isDeleteGroup) {
          // 确定
          return this.$t('shelf.confirm')
        } else {
          // 删除数组
          return this.$t('shelf.deleteGroup')
        }
      }
    },
    methods: {
      // 死侍皮卡丘切换中英文
      changeLanguage() {
        switchLocale(this);
      },
      // 修改分组名称
      editGroupName(category, groupName) {
        // 传递给父组件来修改分组名称
        this.$emit('editGroupName', category, groupName);
      },
      // 弹出上拉框
      showPopup() {
        this.$refs.popup.show();
      },
      // 上拉框点击了删除分组按钮
      onPopupDelete() {
        // 如果确定删除分组
        this.isDeleteGroup = true;
        this.$emit('deleteGroup', this.category);
      },
      onPopupChange() {
        this.ifGroupDialogShow = true
        // 修改分组弹框
        this.$refs.groupDialog.showEditGroupDialog()
      },
      // 修改分组按钮
      changeGroup() {
        // 弹出上拉框
        this.showPopup();
      },
      // 返回
      back() {
        this.$router.go(-1)
      },
      // 清除缓存
      clearCache() {
        this.$emit('clearCache');
      },
      // 显示阴影
      showShadow() {
        this.ifHideShadow = false
      },
      // 隐藏阴影
      hideShadow() {
        this.ifHideShadow = true
      },
      // 是否点击了编辑按钮
      onEditClick() {
        // 判断是不是编辑模式，不是就更换为编辑模式
        // 是就显示取消样式
        if (this.isEditMode) {
          this.$emit('onEditClick', false);
        } else {
          this.$emit('onEditClick', true);
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title-wrapper {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    .title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 110;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }

      .sub-title-text {
        font-size: px2rem(10);
        color: #333;
      }
    }

    .btn-text-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 115;
      padding-right: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;

      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }

    .btn-clear-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      @include center;

      .btn-clear {
        font-size: px2rem(14);
        color: #666;
      }
    }

    .btn-back-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 115;
      padding-left: px2rem(16.5);
      box-sizing: border-box;
      height: 100%;
      font-size: px2rem(20);
      color: #666;
      @include center;

      &:active {
        color: rgba(102, 102, 102, .5);
      }

      .btn-text {
        font-size: px2rem(14);
        color: #666;
      }
    }
  }
</style>
