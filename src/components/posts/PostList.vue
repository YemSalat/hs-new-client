<template>
  <div
    :class="{
        'post-list': true,
        '_loading': this.$store.state.loading
      }"
  >
  <div v-if="allPosts.length === 0" class="placeholder">
    Ничего не найдено 😢
  </div>
  <transition-group tag="div" name="post-list">
    <post-item v-for="post in allPosts" :key="post.id" :post="post" ref="posts" />
  </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PostItem from './PostItem'

export default {
  name: 'PostList',
  components: {
    PostItem
  },
  data () {
    return {
      postImagesTimer: -1,
      postImagesDelay: 250,
      postImagesEvents: ['scroll', 'resize']
    }
  },
  methods: {
    loadVisiblePostImages () {
      clearTimeout(this.postImagesTimer)
      this.postImagesTimer = setTimeout(() => {
        this.$refs.posts.forEach(post => {
          const el = post.$el
          if (elementIsInViewport(el)) {
            post.loadPostImage()
          }
        })
      }, this.postImagesDelay)
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    ...mapGetters(['allPosts'])
  },
  mounted () {
    this.postImagesEvents.forEach(event => {
      window.addEventListener(event, this.loadVisiblePostImages)
    })
  },
  beforeDestroy () {
    this.postImagesEvents.forEach(event => {
      window.removeEventListener(event, this.loadVisiblePostImages)
    })
  },
  updated () {
    this.$nextTick(() => {
      this.loadVisiblePostImages()
    })
  }
}

function elementIsInViewport (el) {
  const rect = el.getBoundingClientRect()
  const wHeight = window.innerHeight

  return (
    (rect.top >= 0 && rect.top <= wHeight) ||
    (rect.bottom >= 0 && rect.bottom <= wHeight)
  )
}
</script>

<style lang="scss">
  .post-list-enter-active, .post-list-leave-active {
    transition: all 2s;
  }
  .post-list-enter, .post-list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-30px);
    // transform-origin: left;
  }
  .post-list-move {
    transition: transform 2s;
  }

  .s-result {
    margin-top: 24px;
  }

  .placeholder {
    margin: 0 0 24px;
    font-size: 16px;
  }

  .post-list {
    transition: 0.5s ease;
    perspective: 1000px;
    perspective-origin: center top;

    &._loading {
      opacity: 0.3;
      // filter: blur(1px);
    }
  }

  .e-query-info {
      line-height: 1;
      padding: 0 0 24px;
  }

  @media screen and (max-width: 768px) {
    .post-info {
      line-height: 1.75;
      text-align: justify;
    }

    .post-info > span {
      display: inline-block;
      margin-right: 15px;
      text-align: left;
    }

    .post-info > span.icon:before {
      margin-right: 5px;
    }

    .post-image {
      float: none;
      width: 100%;
      height: 100px;
      margin: 0 auto 15px;
    }
  }
</style>
