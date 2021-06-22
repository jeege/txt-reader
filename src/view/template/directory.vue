<template>
    <div class="d-wrap">
        <p class="d-item" v-for="(item, index) in directory" @click="gotoPage(index)">{{item}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return {
            directory: []
        }
    },
    methods: {
        gotoPage(index) {
            this.$router.push(`/index?idx=${index}`)
        }
    },
    mounted() {
        callVscode('getDirectory', (e) => {
            this.directory = e
        })
    }
}
</script>