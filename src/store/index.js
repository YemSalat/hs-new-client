import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const store = new Vuex.Store({
  mutations,
  actions,
  state: {
    posts: [],
    selectedFilters: {
      date: 'twodays',
      domain: ['habrahabr.ru', 'geektimes.ru'],
      by: 'comments',
      order: 'desc',
      from: '2017-01-01',
      keyword: ''
    },
    loading: true,
    loadingTimer: null,
    errorText: null,
    userSettings: {
      ignoredAuthors: [],
      ignoredPosts: [],
      favoritePosts: [],
      saveFilters: false,
      showRemovedPosts: true,
      darkTheme: true
    },
    showIgnored: false,
    showSettingsPopup: false,
    lastVisit: Date.now()
  },
  getters: {
    allPosts: state => {
      return state.posts
        .filter(post => {
          const filteredPosts = state.userSettings.ignoredPosts
            .filter(p => p.id === post.id && p.domain === post.domain)
          const filteredAuthors = state.userSettings.ignoredAuthors
            .filter(p => p.author === post.author)
          const filteredFavorites = state.userSettings.favoritePosts
            .filter(p => p.id === post.id && p.domain === post.domain)
          if (filteredPosts.length) {
            post.ignored = true
            return state.showIgnored
          } else if (filteredAuthors.length) {
            post.ignoredAuthor = true
            return state.showIgnored
          } else if (filteredFavorites.length) {
            post.favorite = true
          }
          return true
        })
    },
    settings: state => state.userSettings,
    postUrl () {
      return post => {
        const { id, flag, domain, url } = post
        if (flag === 1) {
          return `https://sohabr.net/${domain === 'habrahabr.ru' ? 'habr' : 'gt'}/post/${id}`
        }
        return url
      }
    }
  }
})
