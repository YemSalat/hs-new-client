<template>
  <div class="query-container">
    <div class="query-row __unselectable">
      <div class="query-item query-item_domain">
        <label
          v-for="filter in filters.domain"
          :key="filter.label"
          :class="{
            'query-item-box': true,
            'marked': true,
            '_active': $store.state.selectedFilters.domain.indexOf(filter.val) > -1
          }"
        >
          <input
            v-model="selectedDomain"
            name="domain"
            type="checkbox"
            :value="filter.val"
            :checked="$store.state.selectedFilters.domain.indexOf(filter.val) > -1"
          />
          <span
            :class="{
              'post-logo': true,
              'habrahabr': filter.label === 'habrahabr',
              'geektimes': filter.label === 'geektimes'
            }"
          />
        </label>
      </div>
      <div class="query-item query-item_date back-drop">
        <span class="back-drop-splash" />
        <label
          v-for="filter in filters.date"
          :key="filter.label"
          :class="{
            'query-item-box': true,
            '_active': filter.val === $store.state.selectedFilters.date
          }"
        >
          <input
            v-model="selectedDate"
            name="date"
            type="radio"
            :value="filter.val"
            :checked="filter.val === $store.state.selectedFilters.date"
          />
          <span>{{ filter.label }}</span>
        </label>
      </div>
    </div>
    <div class="query-row __unselectable">
      <div class="query-item query-item_order back-drop">
        <span class="back-drop-splash" />
        <label
          v-for="filter in filters.by"
          :key="filter.val"
          :class="{
            'query-item-box': true,
            '_active': filter.val === $store.state.selectedFilters.by
          }"
        >
          <input
            v-model="selectedBy"
            name="by"
            type="radio"
            :value="filter.val"
            :checked="filter.val === $store.state.selectedFilters.by"
          />
          <span :class="[ 'icon', filter.val]" />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostFilters',
  data () {
    return {
      filters: {
        by: [
          { val: 'comments' },
          { val: 'rating' },
          { val: 'views' },
          { val: 'stars' },
          { val: 'date' }
        ],
        date: [
          { label: 'сутки', val: 'day' },
          { label: 'двое суток', val: 'twodays' },
          { label: 'неделя', val: 'week' },
          { label: 'месяц', val: 'month' }
        ],
        domain: [
          { label: 'habrahabr', val: 'habrahabr.ru' },
          { label: 'geektimes', val: 'geektimes.ru' }
        ]
      }
    }
  },
  methods: {
    moveBackDrop (e) {
      const item = e.target ? e.target.parentNode : e.querySelector('._active')
      if (item.tagName !== 'LABEL') return

      const splash = item.parentNode.querySelector('.back-drop-splash')
      console.log(item.offsetLeft, item)
      splash.style.transform = `translate3d(${item.offsetLeft}px, 0, 0)`
      splash.style.width = `${item.offsetWidth}px`
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      const backDrops = this.$el.querySelectorAll('.back-drop')
      backDrops.forEach(drop => {
        drop.addEventListener('click', this.moveBackDrop)
        this.moveBackDrop(drop)
      })
    })
  },
  beforeDestroy: function () {
    const backDrops = this.$el.querySelectorAll('.back-drop')
    backDrops.forEach(drop => drop.addEventListener('click', this.moveBackDrop))
  },
  computed: {
    selectedDate: {
      get () {
        return this.$store.state.selectedFilters.date
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'date', val })
        this.$store.dispatch('scheduleLoadData')
      }
    },
    selectedDomain: {
      get () {
        return this.$store.state.selectedFilters.domain
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'domain', val })
        this.$store.dispatch('scheduleLoadData')
      }
    },
    selectedBy: {
      get () {
        return this.$store.state.selectedFilters.by
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'by', val })
        this.$store.dispatch('scheduleLoadData')
      }
    }
  }
}
</script>

<style lang="scss">
  .back-drop-splash {
    position: absolute;
    top: 0;
    bottom: 0;
    background: #fff;
    transition: 0.1s ease-out;
    border-radius: 8px;
  }

  .query-row {
    margin-bottom: 24px;

    // &:last-child {
    //   margin-bottom: 0;
    // }
  }

  .query-item {
    position: relative;
    font-size: 16px;
    display: inline-block;
    margin-right: 24px;
    // background: rgba(255,255,255, .4);
    // border: 1px solid rgba(255,255,255, .5);
    // border-radius: 8px;
    background: rgba(0,0,0, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 0 2px 7px 0px rgba(0,0,0, .025) inset;

    &:last-child {
      margin-right: 0;
    }

    &  label {
      cursor: pointer;
      margin-right: 16px;
      white-space: nowrap;

      &:last-child {
        margin-right: 0;
      }
    }

    & span {
      &.post-logo {
        display: inline-block;
        margin-right: 0 !important;
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }
  }

  .query-item-inner {
    font-size: 14px;
  }

  .query-action {
    color: #487084;
    border-bottom: 1px dashed;
    cursor: pointer;
    font-size: 14px;
    font-style: italic;
  }

  .query-item-box {
    opacity: 0.75;
    color: #333;
    background-color: transparent;
    padding: 0;
    border-radius: 8px;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    transition: 0.2s ease;
    margin-right: 5px;
    padding: 0 8px;
    overflow: hidden;

    &.marked._active {
      opacity: 1;
      color: #111;
      background-color: #fff;
    }

    & .icon {
      vertical-align: middle;
    }

    & .icon::before {
      margin: 0;
    }
  }

  #q_order .query-item-box .icon::before {
    margin-right: 0;
  }

  .icon-box {
    padding: 0 5px;
  }

  .icon {
    /* icons */
    &.rating:before {
      content: '\e800';
    }
    &.stars:before {
      content: '\e809';
    }
    &.comments:before {
      content: '\e801';
    }
    &.views:before {
      content: '\e802';
    }
    &.date:before {
      content: '\e80f';
    }
    &.link-ext:before {
      content: '\e808';
    }
  }

  input[type="radio"],
  input[type="checkbox"] {
    cursor: pointer;
    margin: 0 3px 0 0;
    padding: 0;
    height: 32px;
  }
</style>
