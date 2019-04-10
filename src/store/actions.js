import queryString from 'query-string'

const allowedHash = {
  date: ['day', 'twodays', 'week', 'month', 'since'],
  by: ['comments', 'views', 'rating', 'stars', 'date'],
  order: ['asc', 'desc'],
  from: /[\d{4}-\d{2}-\d{2}]/
}

const LOAD_POSTS_DELAY = 500
const STORAGE_PREFIX = '$hs_'
const MIN_DATE_FIELD_DIFF = 1000 * 60 * 60 * 24 * 2

export default {
  setTheme ({ state }) {
    const theme = state.userSettings.darkTheme ? 'dark' : 'regular'
    document.body.dataset.theme = theme
  },
  loadInitialData ({ state, commit, dispatch }) {
    // load user settings
    const settings = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}settings`))
    if (settings) {
      commit('updateSettings', settings)
      dispatch('setTheme')
    }
    // load posts
    const posts = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}posts`))
    if (posts) commit('updatePosts', posts)
    // load filters
    if (state.userSettings.saveFilters) {
      const filters = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}filters`))
      if (filters) commit('updateFilters', filters)
    }
    // load last visit date
    let lastVisit = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}visit`))
    if (!lastVisit) lastVisit = Date.now()
    commit('setLastVisit', parseInt(lastVisit, 10))
    // load date from field
    if (state.userSettings.saveFilters) return
    if (Date.now() - state.lastVisit > MIN_DATE_FIELD_DIFF) {
      const dateValue = (new Date(state.lastVisit)).toISOString().replace(/T[^$]+/, '')
      commit('updateFilters', { date: 'since', from: dateValue })
    }
  },
  loadFiltersFromHash ({ commit }) {
    const filters = queryString.parse(window.location.hash)
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
  loadPosts ({ state, commit }) {
    commit('setLoading', true)
    if (state.errorText) {
      commit('setError', null)
    }

    let params = Object.keys(state.selectedFilters)

    params = params.filter(k => {
      if (k === 'from' && state.selectedFilters['date'] !== 'since') return false
      if (k === 'keyword' && state.selectedFilters.keyword.length < 2) return false
      return true
    })
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(state.selectedFilters[k])}`)
      .join('&')

    window.fetch(`/v1/posts?${params}`)
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
  scheduleLoadPosts ({ state, dispatch, commit }) {
    commit('setLoading', true)

    clearTimeout(state.loadingTimer)
    state.loadingTimer = setTimeout(() => {
      dispatch('loadPosts')
    }, LOAD_POSTS_DELAY)
  }
}
