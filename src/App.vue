<template>
  <div class="app _loading">
    <div class="main">
      <logo />

      <section class="s-query">
        <div class="c-query-bar">
          <post-filters />
        </div>
        <div class="query-info-bar">
          <info-bar />
        </div>
      </section>

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
import Logo from './components/Logo'
import PostList from './components/PostList'
import PostFilters from './components/PostFilters'
import InfoBar from './components/InfoBar'
import SettingsPopup from './components/SettingsPopup'

export default {
  name: 'App',
  components: {
    PostList,
    PostFilters,
    Logo,
    InfoBar,
    SettingsPopup
  },
  created () {
    window.onpopstate = evt => {
      this.$store.dispatch('loadFiltersFromHash')
      this.$store.dispatch('scheduleLoadData')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('loadInitialData')
      this.$store.dispatch('loadData')
      this.$store.dispatch('loadFiltersFromHash')
    })

    this.$el.classList.remove('_loading')
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
    transition: 0.2s ease-out;
  }

  #app._loading {
    opacity: 0.5;
  }
</style>
