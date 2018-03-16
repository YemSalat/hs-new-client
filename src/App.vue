<template>
  <div class="app _loading" data-version="%HS_APP_VERSION%">
    <div class="main">
      <Header />

      <section class="s-result">
        <div class="c-result">
          <post-list />
        </div>
      </section>

      <div class="site-info">
        <h1>Habra Scanner - парсит хабр и предоставляет интерфейс для сортировки постов.</h1>
        <p>Автор проекта - <a href="https://github.com/YemSalat">YemSalat</a></p>
      </div>
    </div>

    <settings-popup />
  </div>
</template>

<script>
import Header from './components/header/Header'
import PostList from './components/posts/PostList'
import SettingsPopup from './components/SettingsPopup'

const STORAGE_PREFIX = '$hs_'

function getVersionValue (versionString) {
  return versionString.split('.')
    .reverse()
    .map(a => parseInt(a, 10))
    .reduce((a, b, i) => a + b * Math.pow(10, i * i), 0)
}

export default {
  name: 'App',
  components: {
    Header,
    PostList,
    SettingsPopup
  },
  methods: {
    updateTab () {
      if (document.visibilityState === 'visible') {
        const settings = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}settings`))
        this.$store.commit('updateSettings', settings)
        this.$store.dispatch('setTheme')
      }
    }
  },
  created () {
    window.onpopstate = evt => {
      this.$store.dispatch('loadFiltersFromHash')
      this.$store.dispatch('scheduleLoadPosts')
    }
    document.addEventListener('visibilitychange', this.updateTab)
  },
  beforeDestroy () {
    window.removeEventListener('visibilitychange', this.updateTab)
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('loadInitialData')
      this.$store.dispatch('loadFiltersFromHash')
      this.$store.dispatch('loadPosts')
      this.$store.dispatch('setTheme')
    })

    this.$el.classList.remove('_loading')
    const appVersion = getVersionValue(this.$el.dataset.version)

    const lastVersion = getVersionValue(localStorage.getItem(`${STORAGE_PREFIX}version`) || '0')
    // debugger
    if (appVersion > lastVersion) {
      console.log('HS: App version was updated')
      this.$store.commit('migrateData', this.$el.dataset.version)
    }
    localStorage.setItem(`${STORAGE_PREFIX}version`, this.$el.dataset.version)
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
  @import 'assets/style.css';

  #app {
    transition: 0.25s ease-out;
  }

  #app._loading {
    opacity: 0.5;
  }
</style>
