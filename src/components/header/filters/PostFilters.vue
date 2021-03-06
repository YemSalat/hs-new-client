<template>
  <div class="query-container">
    <div class="query-row __unselectable">
      <div class="query-item query-item_by back-drop">
        <BackDrop group="by" />
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
        <BackDrop group="order" />
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

      <div class="query-item query-item_date back-drop">
        <BackDrop group="date" />
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
            v-on:click="$store.state.selectedFilters.date = 'since'"
            type="date"
            value="2017-01-01"
            class="from-input"
            name="date-from"
          >
        </label>
      </div>

      <div class="query-item query-keyword">
        <label
          :class="{
            'query-item-box': true,
            'marked': true,
            '_active': keyword && keyword.length
          }"
        >
          <span>найти</span>
          <input
            @input="updateKeyword"
            name="keyword"
            type="text"
            class="input-keyword"
            :value="keyword"
            placeholder="..."
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import BackDrop from './BackDrop'

export default {
  name: 'PostFilters',
  components: {
    BackDrop
  },
  data () {
    return {
      keywordInputDelay: 900,
      keywordTimer: -1,
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
        order: [
          { val: 'desc' },
          { val: 'asc' }
        ]
      }
    }
  },
  methods: {
    // TODO: make this into a computed prop with get/set
    updateKeyword (evt) {
      let { value } = evt.target
      value = value.trim().replace(/\s+/, ' ').substr(0, 16)

      if (typeof value !== 'string' || value === this.keyword) return
      if (value === '') {
        this.keyword = ''
        return
      }

      clearTimeout(this.keywordTimer)
      this.keywordTimer = setTimeout(() => {
        if (value.length > 2) this.keyword = value
      }, this.keywordInputDelay)
    }
  },
  computed: {
    keyword: {
      get () {
        return this.$store.state.selectedFilters.keyword
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'keyword', val })
      }
    },
    selectedFrom: {
      get () {
        return this.$store.state.selectedFilters.from
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'date', val: 'since' })
        this.$store.commit('updateSelectedFilter', { filter: 'from', val })
      }
    },
    selectedDate: {
      get () {
        return this.$store.state.selectedFilters.date
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'date', val })
      }
    },
    selectedBy: {
      get () {
        return this.$store.state.selectedFilters.by
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'by', val })
      }
    },
    selectedOrder: {
      get () {
        return this.$store.state.selectedFilters.order
      },
      set (val) {
        this.$store.commit('updateSelectedFilter', { filter: 'order', val })
      }
    }
  }
}
</script>

<style lang="scss">
  .input-keyword {
    [data-theme="dark"] & {
      color: #e3e6e6;
    }
  }

  .from-input {
    background: transparent;
    border: none;
    height: 20px;
    font-family: 'Ubuntu Light', 'Ubuntu', sans-serif;
    font-size: 14px;
    vertical-align: middle;
    max-width: 140px;

    [data-theme="dark"] & {
      color: #e3e6e6;
    }
  }

  .back-drop-splash {
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    background: #fff;
    transition: 0.15s ease-out;
    pointer-events: none;

    [data-theme="dark"] & {
      background: #1a1c1d;
    }
  }

  .query-row {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  .query-item {
    position: relative;
    font-size: 16px;
    display: inline-flex;
    margin-right: 24px;
    background: rgba(0,0,0, 0.025);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 7px 0px rgba(0,0,0, .025) inset;
    overflow: hidden;

    [data-theme="dark"] & {
      border: 1px solid #555e65;
    }

    &:last-child {
      margin-right: 0;

      @media screen and (max-width: 768px) {
        margin-bottom: 0;
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

    & input[type="text"] {
      background: transparent;
      border: none;
      font-weight: 400;
      max-width: 100px;
    }

    @media screen and (max-width: 768px) {
      justify-content: space-between;
      margin-right: 0;
      margin-bottom: 10px;

      &.query-item_date {
        overflow: auto;
        overflow-x: scroll;
      }
    }
  }

  .query-keyword {
    & > .query-item-box {
      color: #777;
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
    display: flex;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    transition: 0.2s ease;
    padding: 0 12px;
    cursor: pointer;
    white-space: nowrap;
    align-items: center;
    height: 34px;

    [data-theme="dark"] & {
      color: #e3e6e6;
    }

    & > span {
      display: inline-block;
      vertical-align: middle;
    }

    &.marked {
      margin: 0;
      padding: 0 16px;

      &._active {
        opacity: 1;
        color: #111;
        background-color: #fff;

        [data-theme="dark"] & {
          background: #1a1c1d;
          color: #f1f1f1;
        }
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
    // cursor: pointer;
    // margin: 0 3px 0 0;
    // padding: 0;
    // height: 32px;
    display: none;
  }
</style>
