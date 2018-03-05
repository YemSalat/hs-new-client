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
      saveFilters: false
    },
    showIgnored: false
  },
  getters: {
    allPosts: state => {
      return state.posts
        .filter(post => {
          if (state.userSettings.ignoredPosts.indexOf(`${post.domain}_${post.id}`) > -1) {
            post.ignored = true
            return state.showIgnored
          } else if (state.userSettings.ignoredAuthors.indexOf(post.author) > -1) {
            post.ignoredAuthor = true
            return state.showIgnored
          }
          return true
        })
    }
  }
})
