<template>
  <div class="novel-wrap">
    <h3 class="title">{{ chapter.title }}</h3>
    <h4 class="subtitle" v-if="chapter.subtitle">{{ chapter.subtitle }}</h4>
    <p v-for="(item, index) in chapter.content" :key="index">{{ item }}</p>
    <div class="menu" v-if="chapter.title">
      <button class="btn" @click="preChapter">上一章</button>
      <button class="btn" @click="gotoDirectory">返回目录</button>
      <button class="btn" @click="nextChapter">下一章</button>
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
      this.$router.push("/directory");
    },
    setContent({ chapter, scrollTop }) {
      this.chapter = chapter;
      this.$nextTick(() => {
        window.scrollTo(0, scrollTop || 0);
      })
    },
    init() {
      callVscode(
        { cmd: "init", page: this.$route.query.idx || "" },
        this.setContent
      );
    },
    preChapter() {
      callVscode("left", this.setContent);
    },
    nextChapter() {
      callVscode("right", this.setContent);
    },
    setScrollTop() {
      callVscode({
        cmd: "setScrollTop",
        scrollTop: document.documentElement.scrollTop,
      });
    },
    keyHandle({ keyCode }) {
      switch (keyCode) {
        case 37:
          // 左
          this.preChapter();
          break;
        case 39:
          // 右
          this.nextChapter();
          break;
        case 27:
          // esc
          this.gotoDirectory()
          break;
        default:
          // 其他
          break;
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keyHandle);
    this.scrollHandle = throttle(this.setScrollTop, 300)
    window.addEventListener("scroll", this.scrollHandle);
    this.init();
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyHandle);
    window.removeEventListener("scroll", this.scrollHandle)
  },
};
</script>