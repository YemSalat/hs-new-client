import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

const FLAG_REMOVED = 1
const ALL_LANGUAGES = '3'

Vue.use(Vuex)

export const store = new Vuex.Store({
  mutations,
  actions,
  state: {
    posts: [],
    selectedFilters: {
      date: 'twodays',
      by: 'comments',
      order: 'desc',
      from: '2017-01-01',
      keyword: ''
    },
    loading: true,
    loadingTimer: null,
    errorText: null,
    userSettings: {
      ignoredAuthors: {},
      ignoredPosts: {},
      favoritePosts: {},
      saveFilters: false,
      showRemovedPosts: true,
      darkTheme: false,
      language: ALL_LANGUAGES
    },
    showIgnored: false,
    showSettingsPopup: false,
    lastVisit: Date.now()
  },
  getters: {
    allPosts: state => {
      return state.posts
        .filter(post => {
          if (state.userSettings.ignoredPosts[`${post.domain}_${post.id}`]) {
            post.ignored = true
            return state.showIgnored
          } else if (state.userSettings.ignoredAuthors[`${post.author}`]) {
            post.ignoredAuthor = true
            return state.showIgnored
          } else if (state.userSettings.favoritePosts[`${post.domain}_${post.id}`]) {
            post.favorite = true
            return true
          } else if (state.userSettings.showRemovedPosts === false && post.flag === FLAG_REMOVED) {
            return false
          }
          return true
        })
    },
    settings: state => state.userSettings,
    postUrl () {
      return post => {
        const { id, flag, domain, url } = post
        if (flag === 1) {
          return `https://sohabr.net/${domain === 'habr.com' ? 'habr' : 'gt'}/post/${id}`
        }
        return url
      }
    }
  }
})
