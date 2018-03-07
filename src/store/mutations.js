import queryString from 'query-string'

const STORAGE_PREFIX = '$hs_'

function findPostByIdAndDomain (posts, id, domain) {
  return posts.filter(p => {
    return p.id === id && p.domain === domain
  })[0] || null
}

export default {
  updateUserSetting (state, setting) {
    state.userSettings[setting.set] = setting.val
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  addIgnoredPost (state, post) {
    post.ignored = true

    let ignoredPost = { ...post }
    delete ignoredPost.content
    ignoredPost.ts = Date.now()

    state.userSettings.ignoredPosts.push(ignoredPost)
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  removeIgnoredPost (state, post) {
    const actualPost = findPostByIdAndDomain(state.posts, post.id, post.domain)
    if (actualPost) actualPost.ignored = false

    state.userSettings.ignoredPosts = state.userSettings.ignoredPosts
      .filter(ignoredPost => {
        return ignoredPost.id !== post.id && ignoredPost.domain !== post.domain
      })
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(state.userSettings))
  },
  removeIgnoredAuthor (state, post) {
    state.userSettings.ignoredAuthors = state.userSettings.ignoredAuthors
      .filter(ignoredAuthor => {
        post.ignoredAuthor = false
        return ignoredAuthor.author !== post.author
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

    const ignoredAuthor = { ...post }
    delete ignoredAuthor.content
    ignoredAuthor.ts = Date.now()

    state.userSettings.ignoredAuthors.push(ignoredAuthor)
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
    const hashFilters = JSON.parse(JSON.stringify(Object.assign({}, state.selectedFilters)))

    if (hashFilters.domain.length !== 1) delete hashFilters.domain
    if (hashFilters.date !== 'since') delete hashFilters.from
    if (!hashFilters.keyword || hashFilters.keyword.length < 3) delete hashFilters.keyword

    location.hash = queryString.stringify(hashFilters)

    if (state.userSettings.saveFilters) {
      localStorage.setItem(`${STORAGE_PREFIX}filters`, JSON.stringify(state.selectedFilters))
    }
  },
  toggleSettingsPopup (state, show) {
    state.showSettingsPopup = show
  }
}
