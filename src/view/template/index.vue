<template>
  <div class="novel-wrap">
    <h3 class="title">{{chapter.title}}</h3>
    <h4 class="subtitle" v-if="chapter.subtitle">{{chapter.subtitle}}</h4>
    <p v-for="(item, index) in chapter.content" :key="index">{{ item }}</p>
    <div class="menu" v-if="chapter.title">
      <button @click="preChapter">上一章</button>
      <button @click="gotoDirectory">返回目录</button>
      <button @click="nextChapter">下一章</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chapter: {},
    };
  },
  methods: {
    gotoDirectory() {
        this.$router.replace('/directory')
    },
    setContent(e) {
        window.scrollTo(0,0)
        this.chapter = e
    },
    init() {
        callVscode({cmd: 'init', page: this.$route.query.idx || ''}, this.setContent)
    },
    preChapter() {
        callVscode("left", this.setContent);
    },
    nextChapter() {
        callVscode("right", this.setContent);
    },
    keyHandle({ keyCode }) {
      switch (keyCode) {
        case 37:
          // 左
          this.preChapter()
          break;
        case 39:
          // 右
          this.nextChapter()
          break;
        default:
          // 其他
          break;
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keyHandle);
    this.init()
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyHandle);
  },
};
</script>