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
        <label
          for="sinceInput"
          :class="{
            'query-item-box': true,
            '_active': 'since' === selectedDate
          }"
        >
          <input
            id="sinceInput"
            v-model="selectedDate"
            name="date"
            type="radio"
            value="since"
            :checked="'since' === selectedDate"
          />
          <span>от.. </span>
          <input
            v-model="selectedFrom"
            v-on:click.prevent="state.$store.selectedFilters.date = 'since'"
            type="date"
            value="2017-01-01"
            class="from-input"
          >
        </label>
      </div>
    </div>
    <div class="query-row __unselectable">
      <div class="query-item query-item_by back-drop">
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

      <div class="query-item query-item_order back-drop">
        <span class="back-drop-splash" />
        <label
          v-for="filter in filters.order"
          :key="filter.val"
          :class="{
            'query-item-box': true,
            '_active': filter.val === $store.state.selectedFilters.order
          }"
        >
          <input
            v-model="selectedOrder"
            name="order"
            type="radio"
            :value="filter.val"
            :checked="filter.val === $store.state.selectedFilters.order"
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
        ],
        order: [
          { val: 'desc' },
          { val: 'asc' }
        ]
      }
    }
  },
  methods: {
    moveBackDrop (e) {
      const item = e.target ? e.target.parentNode : e.querySelector('._active')
      if (item.tagName !== 'LABEL') return

      const splash = item.parentNode.querySelector('.back-drop-splash')
      splash.style.transform = `translate3d(${item.offsetLeft}px, ${item.offsetTop}px, 0)`
      splash.style.height = `${item.offsetHeight}px`
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
    selectedFrom: {
      get () {
        return this.$store.state.selectedFilters.from
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'date', val: 'since' })
        this.$store.commit('updateSelectedFilter', { filter: 'from', val })
        this.$store.dispatch('scheduleLoadData')
      }
    },
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
    },
    selectedOrder: {
      get () {
        return this.$store.state.selectedFilters.order
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'order', val })
        this.$store.dispatch('scheduleLoadData')
      }
    }
  }
}
</script>

<style lang="scss">
  .from-input {
    background: transparent;
    border: none;
    height: 20px;
    font-family: 'Ubuntu Light', 'Ubuntu', sans-serif;
    font-size: 14px;
    vertical-align: baseline;
  }

  .back-drop-splash {
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    background: #fff;
    transition: 0.15s ease-out;
  }

  .query-row {
    margin-bottom: 24px;
  }

  .query-item {
    position: relative;
    font-size: 16px;
    display: inline-block;
    margin-right: 24px;
    background: rgba(0,0,0, 0.025);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 7px 0px rgba(0,0,0, .025) inset;
    overflow: hidden;

    &:last-child {
      margin-right: 0;
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
    color: #1f1f1f;
    background-color: transparent;
    padding: 0;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    transition: 0.2s ease;
    padding: 0 12px;
    cursor: pointer;
    white-space: nowrap;

    &.marked {
      margin: 0;
      padding: 0 16px;

      &._active {
        opacity: 1;
        color: #111;
        background-color: #fff;
      }
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
    &.stars::before { content: '\e802'; } /* '' */
    &.views::before { content: '\e803'; } /* '' */
    &.rating::before { content: '\e806'; } /* '' */
    &.comments::before { content: '\f0e5'; } /* '' */
    &.date::before { content: '\f133'; } /* '' */
    &.author::before { content: '\f1ae'; } /* '' */
    &.desc::before { content: '\e800'; } /* '' */
    &.asc::before { content: '\e801'; } /* '' */
  }

  input[type="radio"],
  input[type="checkbox"] {
    cursor: pointer;
    margin: 0 3px 0 0;
    padding: 0;
    height: 32px;
  }
</style>
