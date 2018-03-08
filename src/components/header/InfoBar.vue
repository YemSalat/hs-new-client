<template>
  <span class="e-query-info-content">
    <span v-if="errorText">{{ errorText }}</span>
    <span v-else class="query-info-text">
      {{ amount | postsAmount }}
      <span class="info-mark">{{ domain }} {{ date }}</span>
      <span v-if="keyword"> со словом </span><span v-if="keyword" class="info-mark _sp">{{ keyword }}</span>
      <span v-if="amount > 0">
        отсортированы по <span class="info-mark">{{ by }}</span>
        в порядке <span class="info-mark">{{ order }}</span>
      </span>
    </span>

    <span v-if="filteredPosts" class="ignored-posts" @click="toggleIgnoredPosts()">
      :: скрыто {{ filteredPosts | postsAmount }}
      <span v-if="showIgnored === true">убрать</span>
      <span v-else>показать</span>
    </span>
  </span>
</template>

<script>
const dictionary = {
  by: {
    comments: 'комментариям',
    rating: 'рэйтингу',
    date: 'дате публикации',
    stars: 'звездам',
    views: 'просмотрам'
  },
  order: {
    desc: 'убывания',
    asc: 'возрастания'
  },
  date: {
    day: 'за 24 часа',
    twodays: 'за два дня',
    week: 'за неделю',
    month: 'за месяц'
  },
  domain: {
    'geektimes.ru': 'с geektimes',
    'habrahabr.ru': 'с хабра'
  }
}

export default {
  name: 'InfoBar',
  computed: {
    showIgnored () {
      return this.$store.state.showIgnored
    },
    filteredPosts () {
      const ignoredPosts = this.$store.state.posts.filter(post => {
        return this.$store.state.userSettings.ignoredPosts
          .filter(p => p.id === post.id && p.domain === post.domain).length > 0
      }).length
      const ignoredAuthors = this.$store.state.posts.filter(post => {
        return this.$store.state.userSettings.ignoredAuthors
          .filter(
            p => p.author === post.author &&
            this.$store.state.userSettings.ignoredPosts.filter(p => p.id === post.id).length === 0
          ).length > 0
      }).length
      return ignoredPosts + ignoredAuthors
    },
    errorText () {
      return this.$store.state.errorText
    },
    amount () {
      return this.$store.getters.allPosts.length
    },
    date () {
      if (this.$store.state.selectedFilters.date === 'since') {
        return 'от ' + this.$store.state.selectedFilters.from
      }

      return dictionary.date[this.$store.state.selectedFilters.date]
    },
    by () {
      return dictionary.by[this.$store.state.selectedFilters.by]
    },
    order () {
      return dictionary.order[this.$store.state.selectedFilters.order]
    },
    domain () {
      if (this.$store.state.selectedFilters.domain.length !== 1) return ''
      return dictionary.domain[this.$store.state.selectedFilters.domain]
    },
    keyword () {
      const keyword = this.$store.state.selectedFilters.keyword
      if (!keyword || keyword.length < 2) return ''
      return `«${keyword}»`
    }
  },
  methods: {
    toggleIgnoredPosts () {
      this.$store.commit('setShowIgnoredPosts', !this.$store.state.showIgnored)
    }
  },
  filters: {
    postsAmount (val) {
      const postsAmount = parseInt(val, 10)
      if (!postsAmount) {
        return `${postsAmount} постов`
      } else if (postsAmount === 1) {
        return `${postsAmount} пост`
      } else if (postsAmount < 5) {
        return `${postsAmount} поста`
      } else {
        return `${postsAmount} постов`
      }
    }
  }
}
</script>

<style lang="scss">
  .query-info-bar {
    height: 24px;
  }
  .e-query-info-content {
    color: $light-gray;
    display: inline-block;
    vertical-align: middle;

    [data-theme="dark"] & {
      color: #a2a5a6;
    }

  }
  .info-mark {
    border-bottom: 1px solid rgba(0,0,0, 0.1);
    &._sp {
      background: #fff;
      padding: 0 2px;

      [data-theme="dark"] & {
        background: #1a1c1d;
        color: #f1f1f1;
      }
    }
  }

  .query-info-text {
    // margin-right: 10px;
  }

  .ignored-posts {
    cursor: pointer;

    & > span {
      border-bottom: 1px dashed rgba(0,0,0, 0.1);
    }
  }
</style>
