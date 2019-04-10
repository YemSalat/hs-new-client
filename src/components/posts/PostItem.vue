<template>
  <div
    :class="{
      'e-post': true,
      '_menu-open': this.menuOpen,
      '_ignored': post.ignored || post.ignoredAuthor,
      '_moved': !!post.flag
    }"
  >
    <span
      title="Удалить из закладок"
      :class="{
        'post-favicon': true,
        '_visible': post.favorite
        }"
      @click="unbookmarkPost(post)"
    >
      <!-- <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" class=""></path></svg> -->
      <svg aria-hidden="true" data-prefix="fas" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-bookmark fa-w-12 fa-2x"><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z" class=""></path></svg>
    </span>
    <div v-if="post.image" class="post-image" >
      <a
        target="_blank"
        :href="postUrl(post)"
        :class="{ '_visible': showPostImage }"
        :style="showPostImage ? 'background-image: url('+ post.image +')' : ''"
        rel="noopener"
      >
        &nbsp;
      </a>
    </div>
    <h3 class="post-title">
      <a :href="postUrl(post)" rel="noopener">{{ post.title }}</a>
    </h3>
    <p class="post-content">{{ post.content }}..</p>
    <div class="post-info-hubs">
      <span class="info-hubs-content">{{ post.hubs }}</span>
    </div>
    <div class="post-info">
      <span class="post-comments icon icon-comment-empty">
        <a :href="postUrl(post) + '#comments'" rel="noopener">{{ post.comments }}</a>
      </span>
      <span class="post-rating icon icon-thumbs-up">{{ post.rating }}</span>
      <span class="post-views icon icon-eye">{{ post.views }}</span>
      <span class="post-stars icon icon-star-empty">{{ post.stars }}</span>
      <span :title="post.date" class="post-date icon icon-calendar-empty">{{ post.date | formatPostDate }}</span>
      <span class="post-author icon icon-child">
        <a :href="'https://habr.com/users/' + post.author" rel="noopener">{{ post.author }}</a>
      </span>
      <span class="post-info-flags">{{ this.postFlags }}</span>
      <div class="post-controls">
        <!-- <span title="Open in new tab" class="post-ct icon icon-link-ext el-opennewtab" onclick="_openInNewTab(event, '')"></span> -->
        <span
          title="Settings"
          class="post-ct icon icon-cog el-post-settings"
          @click="toggleMenu()"
        >
          <ul class="post-menu">
            <li v-if="!post.ignored" title="Ignore post" @click="ignorePost(post)">Заблокировать пост</li>
            <li v-else title="Unblock post" @click="unblockPost(post)">Разблокировать пост</li>

            <li v-if="!post.ignoredAuthor" title="Ignore author" @click="ignoreAuthor(post)">Заблокировать автора</li>
            <li v-else title="Unblock author" @click="unblockAuthor(post)">Разблокировать автора</li>
            <li v-if="!post.favorite" title="Save to favorites" @click="bookmarkPost(post)">Добавить в закладки</li>
            <li v-else title="Remove favorites" @click="unbookmarkPost(post)">Удалить из закладок</li>
          </ul>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const RU_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
]

export default {
  name: 'PostItem',
  data () {
    return {
      menuOpen: false,
      showPostImage: false
    }
  },
  props: {
    post: { type: Object, required: true }
  },
  methods: {
    loadPostImage () {
      const img = new Image()
      img.onload = () => { this.showPostImage = true }
      img.src = this.post.image
    },
    closeWhenOutside (evt) {
      if (evt.target.parentNode.className !== 'popup-menu') {
        this.menuOpen = false
        document.removeEventListener('click', this.closeWhenOutside)
      }
    },
    toggleMenu () {
      if (this.menuOpen === false) {
        this.menuOpen = true
        this.$nextTick(() => {
          document.addEventListener('click', this.closeWhenOutside)
        })
      } else {
        this.menuOpen = false
        document.removeEventListener('click', this.closeWhenOutside)
      }
    },
    bookmarkPost (post) {
      this.$store.commit('addFavoritePost', post)
    },
    unbookmarkPost (post) {
      this.$store.commit('removeFavoritePost', post)
    },
    ignorePost (post) {
      this.$store.commit('addIgnoredPost', post)
    },
    unblockPost (post) {
      this.$store.commit('removeIgnoredPost', post)
    },
    ignoreAuthor (post) {
      this.$store.commit('addIgnoredAuthor', post)
    },
    unblockAuthor (post) {
      this.$store.commit('removeIgnoredAuthor', post)
    }
  },
  computed: {
    postFlags () {
      const flags = []

      if (this.post.is_translation) flags.push('Перевод')
      if (this.post.is_sandbox) flags.push('Песочница')
      if (this.post.is_tutorial) flags.push('Tutorial')
      if (this.post.is_recovery) flags.push('Recovery')

      return flags.length ? `[ ${flags.join(', ')} ]` : ''
    },
    ...mapGetters(['postUrl'])
  },
  filters: {
    formatPostDate (val) {
      const postDate = new Date(val)
      const startOfDay = (new Date()).setHours(0, 0, 0, 0)
      const minutes = ('0' + postDate.getMinutes()).slice(-2)
      const hours = postDate.getHours()
      const day = postDate.getDate()
      const monthIndex = postDate.getMonth()
      const year = postDate.getFullYear()

      if (postDate.valueOf() > startOfDay) return `сегодня в ${hours}:${minutes}`

      return `${day} ${RU_MONTHS[monthIndex]} ${year}`
      // return val.match(/[^T]+/)[0]
    }
  }
}
</script>

<style lang="scss">
  @keyframes duck {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(5px);
    }
    70% {
      transform: translateY(-3px);
    }
    85% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(0);
    }
  }

  .post-favicon {
    display: block;
    position: absolute;
    width: 24px;
    height: 24px;
    top: -5px;
    left: -10px;
    z-index: 10;
    transition: 0.2s ease;
    opacity: 0;
    visibility: hidden;
    cursor: pointer;
    // animation: duck 0.4s reverse;

    &._visible {
      animation: duck 0.4s;
      visibility: visible;
      opacity: 1;
    }

    & > svg > path {
      fill: #e2cd66;
    }
  }

   .e-post {
    position: relative;
    color: #111;
    background-color: #fff;
    border: 1px solid #e7e7e7;
    padding: 20px;
    margin-bottom: 30px;
    box-sizing: border-box;
    transition: 0.25s ease;
    // will-change: transform;

    [data-theme="dark"] & {
      color: #e4e9ea;
      background-color: #2c3338;
      border: 1px solid #212529;
    }

    &._moved {
      background-color: #eff4f5;
      border: 1px solid #cbcbcb;

    [data-theme="dark"] & {
      background-color: #58474f;
      border: 1px solid #57474f;
    }

      &::after {
        content: '';
        display: block;
        position: absolute;
        left: -4px;
        top: -14px;
        -webkit-transform: rotateZ(-45deg);
        transform: rotateZ(-135deg);
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 20px solid #cbcbcb;
      }
    }

    &._ignored {
      background-color: #f7f5f1;
      border: 1px solid #e0e0e0;

      [data-theme="dark"] & {
        background-color: #374642;
        border: 1px solid #1a3a2d;
      }

      &::after {
        border-left-color: #e0e0e0;
      }
    }
  }

  .post-title {
    margin-top: 5px;
    margin-bottom: 5px;
    font-weight: lighter;
    line-height: 1.2;
  }

  .post-content {
    margin: 10px 0 14px;
    line-height: 1.4;
  }

  .post-image {
    width: 180px;
    height: 120px;
    float: right;
    margin-left: 20px;
    background-color: #eee;
    margin-top: 10px;
    position: relative;

    [data-theme="dark"] & {
      background-color: #212529;
    }

    & > a {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      transition: 0.75s ease;
      opacity: 0;
      visibility: hidden;

      &._visible {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .post-info {
    color: #7f8c8d;
    position: relative;
    clear: both;

    [data-theme="dark"] & {
      color: #b0b7b7;
    }
  }

  .post-info-hubs {
    margin-bottom: 14px;
    color: #7f8c8d;

    [data-theme="dark"] & {
      color: #b0b7b7;
    }
  }

  .post-info span {
    display: inline-block;
    &.post-logo {
      margin-right: 24px;
    }
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
    margin-right: 20px;
    vertical-align: text-bottom;
    opacity: 0.9;
    display: inline-block;

    &.habrahabr {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path fill="%23c7c7c7" d="M0 0h72v72h-72z"/><path fill="%23fff" d="M40 18v13h-10v-13h-7v31h7v-13h10v13h7v-31z"/></svg>');
      [data-theme="dark"] & {
        opacity: 1;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path fill="%239aa0a0" d="M0 0h72v72h-72z"/><path fill="%232d3338" d="M40 18v13h-10v-13h-7v31h7v-13h10v13h7v-31z"/></svg>');
      }
    }
    &.geektimes {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path xmlns="http://www.w3.org/2000/svg" fill="%23c7c7c7" d="M0 0h72v72h-72z"/><g fill="%23fff"><path d="M26 33h10v12.181c-2 .929-5.484 1.394-8.737 1.394-3.57 0-6.222-1.035-8.171-3.105-1.949-2.07-2.869-5.022-2.869-8.856 0-3.739 1.093-6.649 3.227-8.729s5.136-3.121 8.98-3.121c1.458 0 2.84.137 4.134.412 1.294.275 2.425.623 3.386 1.046l-1.979 4.911c-1.669-.824-3.5-1.236-5.497-1.236-1.827 0-3.239.594-4.237 1.782-.998 1.188-1.497 2.886-1.497 5.093 0 2.165.452 3.815 1.355 4.951s2.422 1.703 4.122 1.703c.929 0 1.784-.09 2.784-.269v-3.157h-5v-5zM51 46h-6v-18h-6v-5h18v5h-6v18z"/></g></svg>');
      [data-theme="dark"] & {
        opacity: 1;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 72 72"><path style="fill: #9aa0a0;" xmlns="http://www.w3.org/2000/svg" fill="%23c7c7c7" d="M0 0h72v72h-72z"/><g fill="%23fff"><path style="fill: #2d3338;" d="M26 33h10v12.181c-2 .929-5.484 1.394-8.737 1.394-3.57 0-6.222-1.035-8.171-3.105-1.949-2.07-2.869-5.022-2.869-8.856 0-3.739 1.093-6.649 3.227-8.729s5.136-3.121 8.98-3.121c1.458 0 2.84.137 4.134.412 1.294.275 2.425.623 3.386 1.046l-1.979 4.911c-1.669-.824-3.5-1.236-5.497-1.236-1.827 0-3.239.594-4.237 1.782-.998 1.188-1.497 2.886-1.497 5.093 0 2.165.452 3.815 1.355 4.951s2.422 1.703 4.122 1.703c.929 0 1.784-.09 2.784-.269v-3.157h-5v-5zM51 46h-6v-18h-6v-5h18v5h-6v18z"/></g></svg>');
      }
    }
  }

  .post-ct {
    position: relative;
    opacity: 0;
    visibility: visible;
    transition: 0.5s ease;
    transition-delay: 0.45s;
    transform: translate3d(0, 8px, 0);
    font-size: 24px;
    cursor: pointer;

    &.icon::before {
      margin: 0;
      opacity: 0.7;
    }
  }
  .e-post._menu-open .post-ct,
  .e-post:hover .post-ct {
    transform: none;
    visibility: visible;
    opacity: 1;
    transition-delay: 0.25s;
  }

  .post-menu {
    position: absolute;
    top: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    right: 0;
    min-width: 220px;
    font-size: 16px;
    z-index: 1000;
    cursor: default;
    border: 1px solid #ebebeb;
    background-color: #fff;
    font-size: 14px;
    color: #111;
    visibility: hidden;
    opacity: 0;
    transition: 0.4s ease;

    ._menu-open & {
      opacity: 1;
      visibility: visible;
    }

    & > li {
      padding: 8px;
      cursor: pointer;

      &:hover {
        background-color: #eaf8ff;
      }
    }
  }

</style>
