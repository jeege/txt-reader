<template>
    <div class="d-wrap">
        <div class="search-wrap">
            <button class="btn" @click="backHandle">返回</button>
            <input class="ipt" v-model.lazy="keyword" type="text" placeholder="搜索章节">
        </div>
        <p class="d-item" v-for="item in showDirectory" @click="gotoPage(item.idx)">{{item.title}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return {
            directory: [],
            keyword: ''
        }
    },
    computed: {
        showDirectory() {
            if (this.keyword) {
                return this.directory.filter(i => i.title.indexOf(this.keyword) >=0 )
            }
            return this.directory
        }
    },
    methods: {
        backHandle() {
            this.$router.go(-1)
        },
        gotoPage(index) {
            this.$router.push(`/index?idx=${index}`)
        },
        keyHandle({ keyCode }) {
        switch (keyCode) {
            case 27:
            // esc
            this.backHandle()
            break;
            default:
            // 其他
            break;
        }
        },
    },
    mounted() {
        document.addEventListener("keydown", this.keyHandle);
        callVscode('getDirectory', (e) => {
            this.directory = e
        })
    },
    destroyed() {
        document.removeEventListener("keydown", this.keyHandle);
    }
}
</script>