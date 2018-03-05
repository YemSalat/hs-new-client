import queryString from 'query-string'

const STORAGE_PREFIX = '$hs_'

export default {
  addIgnoredPost (state, post) {
    post.ignored = true
    state.userSettings.ignoredPosts.push(`${post.domain}_${post.id}`)
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  removeIgnoredPost (state, post) {
    post.ignored = false
    state.userSettings.ignoredPosts = state.userSettings.ignoredPosts
      .filter(postDomainId => {
        return postDomainId !== `${post.domain}_${post.id}`
      })
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  removeIgnoredAuthor (state, post) {
    state.userSettings.ignoredAuthors = state.userSettings.ignoredAuthors
      .filter(author => {
        post.ignoredAuthor = false
        return author !== post.author
      })
    state.posts = state.posts.map(p => {
      p.ignoredAuthor = false
      return p
    })
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  addIgnoredAuthor (state, post) {
    state.posts.forEach(p => {
      if (p.author === post.author) {
        p.ignoredAuthor = true
      }
    })
    state.userSettings.ignoredAuthors.push(post.author)
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  updatePosts (state, posts) {
    state.posts = posts.map(p => {
      p.ignored = false
      p.ignoredAuthor = false
      return p
    })
    localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(posts))
  },
  updateFilters (state, filters) {
    state.selectedFilters = Object.assign(state.selectedFilters, filters)
  },
  updateSettings (state, settings) {
    state.userSettings = settings
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
    const filters = Object.assign({}, state.selectedFilters)
    if (filters.domain.length !== 1) delete filters.domain
    if (filters.date !== 'since') delete filters.from
    location.hash = queryString.stringify(filters)
    if (state.userSettings.saveFilters) {
      localStorage.setItem(`${STORAGE_PREFIX}filters`, JSON.stringify(state.selectedFilters))
    }
  }
}
