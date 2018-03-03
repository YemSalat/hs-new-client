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
      ignoredPosts: []
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
            post.ignored = true
            return state.showIgnored
          }
          return true
        })
    }
  },
  mutations: {
    addIgnoredPost (state, post) {
      post.ignored = true
      state.userSettings.ignoredPosts.push(`${post.domain}_${post.id}`)
    },
    addIgnoredAuthor (state, post) {
      state.posts.forEach(p => {
        if (p.author === post.author) {
          p.ignored = true
        }
      })
      state.userSettings.ignoredAuthors.push(post.author)
    },
    updatePosts (state, posts) {
      state.posts = posts.map(p => {
        p.ignored = false
        return p
      })
      localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(posts))
    },
    updateFilters (state, filters) {
      state.selectedFilters = filters
    },
    setError (state, errorText) {
      state.errorText = errorText
    },
    setLoading (state, loading) {
      state.loading = loading
    },
    setShowIgnoredPosts (state, show) {
      state.showIgnored = show
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
      if (filters) commit('updateFilters', filters)
    },
    loadData ({ state, commit }) {
      commit('setLoading', true)
      commit('setError', null)

      let params = Object.keys(state.selectedFilters)

      params = params.filter(k => {
        if (k === 'from' && state.selectedFilters['date'] !== 'since') return false
        if (k !== 'domain') return true
        return state.selectedFilters.domain.length <= 1
      })
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(state.selectedFilters[k])}`)
        .join('&')

      fetch(`http://new.habrascanner.com/v1/posts?${params}`)
        .then(data => data.json().then(body => {
          commit('updatePosts', body.posts)
          commit('setLoading', false)
          commit('setShowIgnoredPosts', false)
        }))
        .catch(err => {
          console.error(err)
          commit('setError', 'что-то пошло не так 😢')
        })
    },
    scheduleLoadData ({ state, dispatch, commit }) {
      commit('setLoading', true)

      clearTimeout(state.loadingTimer)
      state.loadingTimer = setTimeout(() => {
        dispatch('loadData')
      }, 350)
    }
  }
})
