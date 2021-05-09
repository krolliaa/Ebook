<template>
  <transition name="fade">
    <div class="shelf-group-dialog-bg" v-if="visible">
      <div class="shelf-group-dialog-wrapper" v-if="selectGroupDialogVisible">
        <div class="dialog-list">
          <!--移动书籍-->
          <div class="dialog-title-wrapper">
            <span class="dialog-title-text">{{$t('shelf.moveBook')}}</span>
          </div>
          <!--新建分组+分组栏目栏目-->
          <div class="dialog-list-wrapper">
            <!--新建分组、移出分组都属于分组框里面的内容，我们将其跟具体的分组都放在categoryList-->
            <!--只有新建分组才标蓝：:class加个判断即可-->
            <!--只有在选择了书并且在分组里面，才显示移出分组-->
            <!--当是新建分组时直接显示-->
            <div class="dialog-list-item" :class="{'is-add': item.edit ? item.edit === 1 :false}"
                 v-for="(item, index) in categoryList" :key="index" @click="onGroupClick(item)"
                 v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
              <div class="dialog-list-item-text">{{item.title}}</div>
              <!--当前分组页面下勾选√-->
              <div class="dialog-list-icon-wrapper"
                   v-if="category && item.id ? category.id === item.id : false">
                <span class="icon-check"></span>
              </div>
            </div>
          </div>
        </div>
        <!--取消按钮-->
        <div class="dialog-btn-wrapper" @click="hide">
          <div class="dialog-btn">{{$t('shelf.cancel')}}</div>
        </div>
      </div>

      <!--新建分组-->
      <div class="shelf-group-dialog-wrapper" v-if="newGroupDialogVisible">
        <div class="dialog-list">
          <div class="dialog-title-wrapper">
            <span class="dialog-title-text">{{$t('shelf.newGroup')}}</span>
          </div>
          <div class="dialog-input-title-wrapper">
            <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
          </div>
          <div class="dialog-input-wrapper">
            <div class="dialog-input-inner-wrapper">
              <!--输入新建分组名-->
              <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
              <!--如果输入框中有内容就显示小x黑圈按钮-->
              <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName.length > 0">
                <span class="icon-close-circle-fill"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-btn-wrapper">
          <!--无论与否都取消框-->
          <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
          <!--有文字才显示确认框-->
          <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName.length === 0}">
            {{$t('shelf.confirm')}}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "ShelfGroupDialog",
    props: {
      visible: Boolean,
      data: Array,
      bookList: Array,
      isInGroup: Boolean,
      category: Object,
      isEditGroupName: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 新建分组弹框显示，默认为 false
        newGroupDialogVisible: false,
        // 点击分组弹框显示，默认为 true
        selectGroupDialogVisible: true,
        // 新建分组名默认为空
        newGroupName: ''
      }
    },
    computed: {
      // 默认的分组信息 包括新建分组和移出分组
      defaultCategory() {
        return [
          {
            title: this.$t('shelf.newGroup'),
            edit: 1
          },
          {
            title: this.$t('shelf.groupOut'),
            edit: 2
          }
        ]
      },
      // 全部分组列表 默认的栏目 + bookList带的分组
      categoryList() {
        const list = this.bookList ? this.bookList.filter(item => item.type === 2) : [];
        return [...this.defaultCategory, ...list];
      }
    },
    methods: {
      // 新建分组
      createNewGroup() {
        // 如果是修改分组名
        if (this.isEditGroupName) {
          this.$emit('editGroupName', this.category, this.newGroupName)
          this.hide()
        } else {
          if (this.newGroupName.length > 0) {
            this.$emit('group', 2, {
              id: this.bookList[this.bookList.length - 2].id + 1,
              itemList: [],
              selected: false,
              title: this.newGroupName,
              type: 2
            })
          }
        }
        this.hide();
      },
      // 点击小x黑圈清除文字
      clear() {
        this.newGroupName = '';
      },
      // 点击分组各事件
      onGroupClick(item) {
        // 如果是新建分组
        if (item.edit && item.edit === 1) {
          // 弹出新建分组框
          this.showCreateGroupDialog();
          // 如果是移出分组
        } else if (item.edit && item.edit === 2) {
          // 移出分组
          this.$emit('group', 3, item);
        } else {
          // 移入分组
          this.$emit('group', 1, item);
          // 调用Toast弹框表示移入成功
          this.hide();
        }
      },
      // 新建分组弹框
      showCreateGroupDialog() {
        this.newGroupDialogVisible = true;
        this.selectGroupDialogVisible = false;
        this.newGroupName = '';
        // 显示新建分组输入框输可输入分组名
        this.$nextTick(() => {
          this.$refs.dialogInput.focus()
        })
      },
      // 编辑分组弹窗
      showEditGroupDialog() {
        this.newGroupDialogVisible = true
        this.selectGroupDialogVisible = false
        this.newGroupName = this.category.title
        this.$nextTick(() => {
          this.$refs.dialogInput.focus()
        })
      },
      show() {
        this.$emit('update:visible', true)
      },
      // 隐藏弹窗
      hide() {
        this.$emit('update:visible', false)
        this.newGroupDialogVisible = false
        this.selectGroupDialogVisible = true
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-group-dialog-bg {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 120;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .2);
    font-size: px2rem(16);
    color: #333;
    @include center;

    .shelf-group-dialog-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 60%;
      max-height: 80%;
      background: white;
      border-radius: px2rem(10);

      .dialog-list {
        width: 100%;
        padding: 0 px2rem(20);
        box-sizing: border-box;
        @include scroll;

        .dialog-title-wrapper {
          font-size: px2rem(22);
          font-weight: bold;
          text-align: center;
          padding: px2rem(30) 0 px2rem(20) 0;
        }

        .dialog-list-wrapper {
          font-size: px2rem(14);

          .dialog-list-item {
            display: flex;
            padding: px2rem(15) 0;
            box-sizing: border-box;
            color: #666;

            &.is-add {
              color: $color-blue;

              &:active {
                color: $color-blue-transparent;
              }
            }

            &:active {
              color: rgba(102, 102, 102, .5)
            }

            .dialog-list-item-text {
              flex: 1;
            }

            .dialog-list-icon-wrapper {
              flex: 0 0 px2rem(30);
              color: $color-blue;
              @include right;
            }
          }
        }
      }

      .dialog-btn-wrapper {
        display: flex;
        width: 100%;
        background: $color-blue;
        font-size: px2rem(14);
        font-weight: bold;
        color: white;
        text-align: center;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        border-radius: 0 0 px2rem(10) px2rem(10);

        .dialog-btn {
          flex: 1;

          &.is-empty {
            color: rgba(255, 255, 255, .5);
          }

          &:active {
            color: rgba(255, 255, 255, .5)
          }
        }
      }

      .dialog-input-title-wrapper {
        font-size: px2rem(10);
        margin-top: px2rem(20);
      }

      .dialog-input-wrapper {
        width: 100%;
        padding: 0 0 px2rem(30) 0;
        box-sizing: border-box;

        .dialog-input-inner-wrapper {
          display: flex;
          width: 100%;
          padding: px2rem(10) 0;
          box-sizing: border-box;
          border-bottom: px2rem(1) solid #eee;
          font-size: px2rem(14);
          color: #666;

          .dialog-input {
            flex: 1;
            border: none;

            &:focus {
              outline: none;
            }
          }

          .dialog-input-clear-wrapper {
            flex: 0 0 px2rem(30);
            color: #ccc;
            @include center;

            &:active {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
