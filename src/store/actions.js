import queryString from 'query-string'

const allowedHash = {
  domain: ['habrahabr.ru', 'geektimes.ru'],
  date: ['day', 'twodays', 'week', 'month', 'since'],
  by: ['comments', 'views', 'rating', 'stars', 'date'],
  order: ['asc', 'desc'],
  from: /[\d{4}-\d{2}-\d{2}]/
}

const STORAGE_PREFIX = '$hs_'

export default {
  loadInitialData ({ state, commit }) {
    const settings = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}settings`) || 'null')
    if (settings) commit('updateSettings', settings)
    const posts = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}posts`) || 'null')
    if (posts) commit('updatePosts', posts)
    if (state.userSettings.saveFilters) {
      const filters = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}filters`) || 'null')
      if (filters) commit('updateFilters', filters)
    }
  },
  loadFiltersFromHash ({ commit }) {
    const filters = queryString.parse(location.hash)
    if (typeof filters.domain === 'string') {
      filters.domain = [filters.domain]
    }
    const result = {}
    Object.keys(allowedHash).forEach(param => {
      if (!filters[param]) return
      if (typeof filters[param] === 'string') {
        if (allowedHash[param] instanceof RegExp) {
          if (filters[param].match(allowedHash[param])) result[param] = filters[param]
        } else if (allowedHash[param].indexOf(filters[param]) > -1) {
          result[param] = filters[param]
        }
      } else if (filters[param] instanceof Array) {
        result[param] = filters[param].filter(p => {
          return (allowedHash[param].indexOf(p) > -1)
        })
      }
    })
    if (filters.keyword) {
      result.keyword = filters.keyword
    }
    if (Object.keys(result).length) {
      commit('updateFilters', result)
    }
  },
  loadData ({ state, commit }) {
    commit('setLoading', true)
    if (state.errorText) {
      commit('setError', null)
    }

    let params = Object.keys(state.selectedFilters)

    params = params.filter(k => {
      if (k === 'from' && state.selectedFilters['date'] !== 'since') return false
      if (k === 'keyword' && state.selectedFilters.keyword.length < 2) return false
      if (k === 'domain' && state.selectedFilters.domain.length !== 1) return false
      return true
    })
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(state.selectedFilters[k])}`)
      .join('&')

    fetch(`/v1/posts?${params}`)
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
