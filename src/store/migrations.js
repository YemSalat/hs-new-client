const STORAGE_PREFIX = '$hs_'

function uidWithDomain (post) {
  return `${post.domain}_${post.id}`
}

function uidWithAuthor (post) {
  return post.author
}

function updatePostsToObject (postsArray, uidGenerator) {
  if (Array.isArray(postsArray)) {
    const postsObject = {}
    postsArray.forEach(post => {
      postsObject[uidGenerator(post)] = post
    })
    return postsObject
  }
  return {}
}

export default [
  {
    version: '0.9.6',
    up ({ state }) {
      const settings = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}settings`) || 'null')
      if (!settings) return

      settings.favoritePosts = updatePostsToObject(settings.favoritePosts, uidWithDomain)
      settings.ignoredPosts = updatePostsToObject(settings.ignoredPosts, uidWithDomain)
      settings.ignoredAuthors = updatePostsToObject(settings.ignoredAuthors, uidWithAuthor)

      localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings))
    }
  }
]
