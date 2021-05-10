<template>
    <div class="recommend">
        <title-view :label="$t('home.recommend')" :btn="$t('home.seeAll')" @onClick="showBookCategory"></title-view>
        <div class="recommend-list">
            <div class="recommend-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
                <div class="img-wrapper">
                    <img class="img" v-lazy="item.cover">
                </div>
                <div class="content-wrapper">
                    <div class="title title-medium" ref="title">{{item.title}}</div>
                    <div class="num sub-title" ref="num">{{$t('home.readers').replace('$1', item.readers)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TitleView from "./TitleView";
    import {ebookHome} from '../../utils/mixin'
    import {getCategoryName} from "../../utils/book";
    import {getLocalStorage} from "../../utils/localStorage";

    export default {
        mixins: [ebookHome],
        components: {
            TitleView
        },
        props: {
            data: Array
        },
        methods: {
            showBookCategory() {
                if (getLocalStorage('locale') === 'cn') {
                    alert("暂时只有这三本书哦~");
                } else {
                    alert('There are only 3 books for now~');
                }
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global.scss";

    .recommend {
        .recommend-list {
            width: 100%;
            @include top;
            padding: 0 px2rem(5);
            box-sizing: border-box;

            .recommend-item {
                flex: 0 0 33.33%;
                width: 33.33%;
                padding: 0 px2rem(5);
                box-sizing: border-box;

                .img-wrapper {
                    @include center;

                    .img {
                        width: 80%;
                    }
                }

                .content-wrapper {
                    width: 100%;
                    margin-top: px2rem(10);
                    @include columnCenter;

                    .title {
                        text-align: center;
                    }

                    .num {
                        margin-top: px2rem(5);
                    }
                }
            }
        }
    }
</style>
