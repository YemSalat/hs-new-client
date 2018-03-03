<template>
  <div class="app _loading">
    <div class="main">
      <Logo />

      <section class="s-query">
        <div class="c-query-bar">
          <PostFilters />
        </div>
      </section>

      <section class="s-result">
        <div class="c-result">
          <PostList />
        </div>
      </section>

      <div class="site-info">
        <h1>Habra Scanner - парсит хабр и предоставляет интерфейс для сортировки постов.</h1>
        <p>Просто выберите в каком порядке представить результат в графе "ORDER BY", а в правой колонке "WHERE" выберите критерии поиска. Жмете "GO" и готово.</p>
        <p>Автор проекта - <a href="https://github.com/YemSalat">YemSalat</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './components/Logo'
import PostList from './components/PostList'
import PostFilters from './components/PostFilters'

export default {
  name: 'App',
  components: {
    PostList,
    PostFilters,
    Logo
  },
  created () {
    this.$store.dispatch('loadInitialData')
    this.$store.dispatch('loadData')
  },
  mounted () {
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
