<template>
<section class="c-header">
  <logo />

  <section class="s-query">
    <div class="c-query-bar">
      <post-filters />
    </div>
    <div class="query-info-bar">
      <info-bar />
    </div>
  </section>
</section>

</template>

<script>
import Logo from './Logo'
import InfoBar from './InfoBar'
import PostFilters from './filters/PostFilters'

export default {
  name: 'Header',
  components: {
    Logo,
    InfoBar,
    PostFilters
  }
}
</script>
