import Vue from 'vue'
import Vuex from 'vuex'

const STORAGE_PREFIX = '$hs_'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    posts: [],
    selectedFilters: {
      date: 'twodays',
      domain: ['habrahabr.ru'],
      by: 'comments'
    },
    loading: true,
    loadingTimer: null
  },
  getters: {
    allPosts: state => state.posts
  },
  mutations: {
    updatePosts (state, posts) {
      console.log('UPDATING POSTS!', posts)
      state.posts = posts
      localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(posts))
    },
    updateFilters (state, filters) {
      console.log('UPDATING Filters!', filters)
      state.selectedFilters = filters
    },
    setLoading (state, loading) {
      state.loading = loading
    },
    updateSelectedFilter (state, update) {
      state.selectedFilters[update.filter] = update.val
      localStorage.setItem(`${STORAGE_PREFIX}filters`, JSON.stringify(state.selectedFilters))
    }
  },
  actions: {
    loadInitialData ({ commit }) {
      const posts = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}posts`) || 'null')
      const filters = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}filters`) || 'null')
      if (posts) commit('updatePosts', posts)
      if (filters) {
        console.log('FILTES!')
        commit('updateFilters', filters)
      }
    },
    loadData ({ state, commit }) {
      commit('setLoading', true)

      const params = Object.keys(state.selectedFilters)
        .filter(k => {
          if (k !== 'domain') return true
          if (state.selectedFilters.domain.length > 1) return false
          return true
        })
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(state.selectedFilters[k])}`)
        .join('&')

      fetch(`http://0.0.0.0:3000/posts?${params}`).then(data => {
        data.json().then(body => commit('updatePosts', body.posts))
        commit('setLoading', false)
      })
    },
    scheduleLoadData ({ state, dispatch, commit }) {
      commit('setLoading', true)

      clearTimeout(state.loadingTimer)
      state.loadingTimer = setTimeout(() => {
        dispatch('loadData')
      }, 700)
    }
  }
})
