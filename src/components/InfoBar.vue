<template>
  <span class="e-query-info-content">
    <span v-if="errorText">{{ errorText }}</span>
    <span v-else class="query-info-text">{{ amount }} постов <span class="info-mark">{{ domain }} {{ date }}</span> отсортированных по <span class="info-mark">{{ by }}</span> в порядке <span class="info-mark">{{ order }}</span></span>

    <span class="filtered-posts" @click="toggleIgnoredPosts()">
      ignored: {{ filteredPosts }}
      <span v-if="showIgnored === true">hide</span>
      <span v-else>show</span>
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
        return this.$store.state.userSettings.ignoredPosts.indexOf(`${post.domain}_${post.id}`) > -1
      }).length
      const ignoredAuthors = this.$store.state.posts.filter(post => {
        return (this.$store.state.userSettings.ignoredAuthors.indexOf(post.author) > -1 &&
               this.$store.state.userSettings.ignoredPosts.indexOf(`${post.domain}_${post.id}`) < 0)
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
      if (!this.$store.state.selectedFilters.keyword) return ''
      return dictionary.domain[this.$store.state.selectedFilters.domain]
    }
  },
  methods: {
    toggleIgnoredPosts () {
      this.$store.commit('setShowIgnoredPosts', !this.$store.state.showIgnored)
    }
  }
}
</script>

<style lang="scss">
  .e-query-info-content {
    color: $light-gray;
  }
  .info-mark {
    // background: rgba(255, 255, 255, 0.6);
    // padding: 0 4px;
    // border-radius: 4px;
    border-bottom: 1px solid rgba(0,0,0, 0.1);
  }
  .query-info-text {
    margin-right: 10px;
  }
  .filtered-posts {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
