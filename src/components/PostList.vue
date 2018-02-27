<template>
  <div
    :class="{
        'post-list': true,
        '_loading': this.$store.state.loading
      }"
  >
    <div class="e-post" v-for="post in allPosts" :key="post.id">
      <div
        v-if="post.image"
        class="post-image"
        :style="'background-image: url('+ post.image +')'"
      >
        <a target="_blank" :href="post.url"></a>
      </div>
      <h3 class="post-title">
        <a :href="post.url">{{ post.title }}</a>
      </h3>
      <p class="post-content">{{ post.content }}</p>
      <div class="post-info-hubs">
        <span class="info-hubs-content">{{ post.hubs }}</span>
      </div>
      <div class="post-info">
        <span
          :title="post.domain"
          :class="{
            'post-logo': true,
            'habrahabr': post.domain === 'habrahabr.ru',
            'geektimes': post.domain === 'geektimes.ru'
            }"
        />
        <span class="post-comments icon icon-comment-empty">
          <a :href="post.url + '#comments'">{{ post.comments }}</a>
        </span>
        <span class="post-rating icon icon-thumbs-up">{{ post.rating }}</span>
        <span class="post-views icon icon-eye">{{ post.views }}</span>
        <span class="post-stars icon icon-star-empty">{{ post.stars }}</span>
        <span class="post-date icon icon-calendar-empty">{{ post.date }}</span>
        <span class="post-author icon icon-child">
          <a :href="post.author">{{ post.author }}</a>
        </span>
        <span class="post-info-flags"></span>
        <div class="post-controls">
          <!-- <span title="Open in new tab" class="post-ct icon icon-link-ext el-opennewtab" :onclick="_openInNewTab(event, '')"></span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PostList',
  computed: {
    posts () {
      return this.$store.state.posts
    },
    ...mapGetters(['allPosts'])
  }
}
</script>

<style lang="scss">
  .post-list {
    transition: 0.5s ease;
    perspective: 1000px;
    perspective-origin: center top;

    &._loading {
      opacity: 0.3;
      // filter: blur(1px);
    }
  }

  .e-post {
    position: relative;
    color: #111;
    background-color: #fff;
    border-color: #e7e7e7;
    padding: 20px;
    margin-bottom: 30px;
    overflow: hidden;
    box-sizing: border-box;
    transition: 0.25s ease;
  }

  ._loading .e-post {
    transform: rotate3d(1, 0, 0, 20deg);
  }

  .post-title {
    margin-bottom: 5px;
    font-weight: lighter;
    line-height: 1.2;
  }

  .post-content {
    margin: 10px 0 15px;
    line-height: 1.4;
  }

  .post-image {
    width: 180px;
    height: 120px;
    float: right;
    margin-left: 20px;
    background-size: cover;
    background-position: center;
    margin-top: 10px;
    position: relative;

    & > a {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .post-info {
    color: #7f8c8d;
    position: relative;
    clear: both;
  }

  .post-info-hubs {
    margin-bottom: 10px;
    color: #7f8c8d;
  }

  .post-info span {
    display: inline-block;
  }

  .post-info > span {
    margin-right: 25px;
    font-size: 15px;
  }

  .post-info > span > span {
    margin-right: 8px;
  }

  .post-info > span > span:after {
    content: ':';
  }

  .post-info > span::before {
    transition: 0.15s ease;
  }

  .post-info > span:hover::before {
    opacity: 1;
  }

  .post-controls {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
  }

  .post-logo {
    width: 20px;
    height: 20px;
    background-size: 100%;
    margin-right: 20px !important;
    vertical-align: text-bottom;
    opacity: 0.9;

    &.habrahabr {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path fill="%23c7c7c7" d="M0 0h72v72h-72z"/><path fill="%23fff" d="M40 18v13h-10v-13h-7v31h7v-13h10v13h7v-31z"/></svg>');
    }
    &.geektimes {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path xmlns="http://www.w3.org/2000/svg" fill="%23c7c7c7" d="M0 0h72v72h-72z"/><g fill="%23fff"><path d="M26 33h10v12.181c-2 .929-5.484 1.394-8.737 1.394-3.57 0-6.222-1.035-8.171-3.105-1.949-2.07-2.869-5.022-2.869-8.856 0-3.739 1.093-6.649 3.227-8.729s5.136-3.121 8.98-3.121c1.458 0 2.84.137 4.134.412 1.294.275 2.425.623 3.386 1.046l-1.979 4.911c-1.669-.824-3.5-1.236-5.497-1.236-1.827 0-3.239.594-4.237 1.782-.998 1.188-1.497 2.886-1.497 5.093 0 2.165.452 3.815 1.355 4.951s2.422 1.703 4.122 1.703c.929 0 1.784-.09 2.784-.269v-3.157h-5v-5zM51 46h-6v-18h-6v-5h18v5h-6v18z"/></g></svg>');
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
