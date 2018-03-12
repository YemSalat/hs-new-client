<template>
  <div
  :class="{
    'popup': true,
    'popup-settings': true,
    '_visible': this.show
  }"
  >
    <span class="close-popup" @click="close">&#xd7;</span>
    <ul class="popup-tabs __unselectable">
      <li @click="openTab" data-tab="settings" :class="{ _active: this.tab === 'settings' }">
        Настройки
      </li>
      <li @click="openTab" data-tab="posts" :class="{ _active: this.tab === 'posts' }">
        Посты
      </li>
      <li @click="openTab" data-tab="authors" :class="{ _active: this.tab === 'authors' }">
        Авторы
      </li>
      <li @click="openTab" data-tab="favorites" :class="{ _active: this.tab === 'favorites' }">
        Закладки
      </li>
      <li @click="openTab" data-tab="about" :class="{ _active: this.tab === 'about' }">
        О программе
      </li>
    </ul>
    <div class="popup-content-wrapper __unselectable">
      <div
        :class="{
          'popup-content': true,
          _active: this.tab === 'settings'
        }"
        data-tab="settings"
      >
        <label>
          <span>Сохранять фильтры после закрытия</span>
          <input type="checkbox" v-model="saveFilters" />
        </label>
        <label>
          <span>Показывать удаленные посты</span>
          <input type="checkbox" v-model="showRemovedPosts" />
        </label>
        <label>
          <span>Dark theme</span>
          <input type="checkbox" v-model="darkTheme" />
        </label>
        <label>
          Текущие настройки:
          <a class="setting" :download="settingsDownloadFileName" :href="`data:text/plain;charset=utf-8,${encodeURIComponent(encodedSettings)}`">экспорт</a>
          <input id="importFile" type="file" accept=".json" style="display: none" @change.prevent="importSettings">
          &nbsp;/&nbsp;
          <a class="setting" onclick="openFileDialog">импорт</a>
        </label>
        <label>
          <a class="setting" @click.prevent="clearPostCache">Очистить кэш постов</a>
        </label>
      </div>
      <div
        :class="{
          'popup-content': true,
          _active: this.tab === 'posts'
        }"
        data-tab="posts"
      >
        <p v-if="!settings.ignoredPosts.length">У вас нет заблокированных постов</p>
        <ul v-else class="popup-list">
          <li v-for="ignoredPost in settings.ignoredPosts" :key="ignoredPost.id">
            <div class="popup-list-item-content">
              <span
                :title="ignoredPost.domain"
                :class="{
                  'post-logo': true,
                  'habrahabr': ignoredPost.domain === 'habrahabr.ru',
                  'geektimes': ignoredPost.domain === 'geektimes.ru'
                }"
              />
              <a target="_blank" :title="ignoredPost.author" :href="postUrl(ignoredPost)" rel="noopener">{{ ignoredPost.title }}</a>
            </div>
            <span class="list-remove-ignored" @click="removeIgnoredPost(ignoredPost)">удалить</span>
          </li>
        </ul>
      </div>
      <div
        :class="{
          'popup-content': true,
          _active: this.tab === 'authors'
        }"
        data-tab="authors"
      >
        <p v-if="!settings.ignoredAuthors.length">У вас нет заблокированных авторов</p>
        <ul v-else class="popup-list">
          <li v-for="ignoredPost in settings.ignoredAuthors" :key="ignoredPost.author">
            <div class="popup-list-item-content">
              <span class="post-author icon icon-child __italic">
                <a
                  target="_blank"
                  :title="ignoredPost.author"
                  :href="'https://' + ignoredPost.domain + '/users/' + ignoredPost.author"
                  rel="noopener"
                >{{ ignoredPost.author }}</a>
              </span> :
              <a target="_blank" :title="ignoredPost.author" :href="postUrl(ignoredPost)" rel="noopener">{{ ignoredPost.title }}</a>
            </div>
            <span class="list-remove-ignored" @click="removeIgnoredAuthor(ignoredPost)">удалить</span>
          </li>
        </ul>
      </div>
      <div
        :class="{
          'popup-content': true,
          _active: this.tab === 'favorites'
        }"
        data-tab="favorites"
      >
        <p v-if="!settings.favoritePosts.length">У вас нет закладок</p>
        <ul v-else class="popup-list">
          <li v-for="favoritePost in settings.favoritePosts" :key="favoritePost.id">
            <div class="popup-list-item-content">
              <span
                :title="favoritePost.domain"
                :class="{
                  'post-logo': true,
                  'habrahabr': favoritePost.domain === 'habrahabr.ru',
                  'geektimes': favoritePost.domain === 'geektimes.ru'
                }"
              />
              <a target="_blank" :title="favoritePost.author" :href="postUrl(favoritePost)" rel="noopener">{{ favoritePost.title }}</a>
            </div>
            <span class="list-remove-ignored" @click="removeFavoritePost(favoritePost)">удалить</span>
          </li>
        </ul>
      </div>
      <div
        :class="{
          'popup-content': true,
          _active: this.tab === 'about'
        }"
        data-tab="about"
      >
        <p>
          Парсит хабр и предоставляет интерфейс для сортировки постов
        </p>
        <p>
          Habrascanner v%HS_APP_VERSION% : %HS_GIT_HASH% : 1873<br />
          %HS_BUILD_DATE%
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const STORAGE_PREFIX = '$hs_'

const reader = new FileReader()

export default {
  name: 'PopupSettings',
  data () {
    return {
      tab: 'settings'
    }
  },
  computed: {
    settingsDownloadFileName () {
      return `HS-settings-${(new Date()).toDateString()}_${('' + Date.now()).slice(-2)}.json`
    },
    encodedSettings () {
      return JSON.stringify(this.settings)
    },
    show () {
      return this.$store.state.showSettingsPopup
    },
    saveFilters: {
      get () {
        return this.settings.saveFilters
      },
      set (val) {
        this.$store.commit('updateUserSetting', { set: 'saveFilters', val })
      }
    },
    showRemovedPosts: {
      get () {
        return this.settings.showRemovedPosts
      },
      set (val) {
        this.$store.commit('updateUserSetting', { set: 'showRemovedPosts', val })
      }
    },
    darkTheme: {
      get () {
        return this.settings.darkTheme
      },
      set (val) {
        this.$store.commit('updateUserSetting', { set: 'darkTheme', val })
        this.$store.dispatch('setTheme')
      }
    },
    ...mapGetters(['settings', 'postUrl'])
  },
  methods: {
    openFileDialog () {
      const importFile = document.getElementById('importFile')
      if (importFile) importFile.click()
    },
    importSettings (evt) {
      reader.onload = () => {
        const text = reader.result
        debugger
        this.$store.commit('updateSettings', JSON.parse(text))
        this.$store.dispatch('setTheme')
      }

      reader.readAsText(evt.target.files[0], 'utf-8')
    },
    close () {
      this.$store.commit('toggleSettingsPopup', false)
    },
    openTab (evt) {
      this.tab = evt.target.dataset.tab
    },
    removeIgnoredPost (post) {
      this.$store.commit('removeIgnoredPost', post)
    },
    removeIgnoredAuthor (post) {
      this.$store.commit('removeIgnoredAuthor', post)
    },
    removeFavoritePost (post) {
      this.$store.commit('removeFavoritePost', post)
    },
    clearPostCache (evt) {
      evt.target.classList.add('_done')
      this.$nextTick(() => evt.target.classList.remove('_done'))
      localStorage.removeItem(`${STORAGE_PREFIX}posts`)
    }
  }
}
</script>

<style lang="scss">
.color-gray {
  color: #555;
}

.close-popup {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  color: #777;

  &:hover {
    color: #000;
  }
}

.list-remove-ignored {
  position: absolute;
  right: 0;
  z-index: 100;
  visibility: hidden;
  opacity: 0;
  transition: 0.2s ease;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #ccc;
  padding: 2px 4px;
  top: 7px;
  color: #777;
  min-width: 60px;
  text-align: center;

  &:hover {
    color: #111;
    border-color: #777;
  }

  li:hover > & {
    opacity: 1;
    visibility: visible;
  }
}

.popup-list {
  list-style: none;
  padding: 0;
  margin: 0;

  & > li {
    position: relative;

    & > .popup-list-item-content {
      padding: 8px 0;
      white-space: nowrap;
      max-width: 87%;
      position: relative;
      overflow: hidden;

      & > .post-logo {
        display: inline-block;
        vertical-align: middle;
      }

      & > a {
        display: inline-block;
        vertical-align: middle;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 48px;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);

          [data-theme="dark"] & {
            background: linear-gradient(to right, transparent 0%,#40484e 100%);
          }
        }
      }
    }

    &:nth-child(even) {
      // background-color: #f1f1f1;
    }
  }
}

.popup {
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: top;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
  min-width: 700px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 24px;
  transition: 0.25s ease;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  [data-theme="dark"] & {
    background: #40484e;
    border: 1px solid #22252a;
  }

  &._visible {
    pointer-events: auto;
    opacity: 1;
    visibility: visible;
    transform: none;
    transform: translate(-50%, -45%);
  }

  .popup-tabs {
    display: block;
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;

    & > li {
      display: inline-block;
      margin-right: 12px;
      color: #777;
      cursor: pointer;
      padding-bottom: 4px;

      [data-theme="dark"] & {
        color: #b8bdbd;
      }

      &:hover,
      &._active {
        color: #000;
        border-bottom: 1px solid #ccc;

        [data-theme="dark"] & {
          color: #def9f9;
        }
      }
    }
  }

  .popup-content-wrapper {
    min-height: 200px;
    position: relative;
  }

  .popup-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
    transition: 0.2s ease;
    opacity: 0;
    visibility: hidden;
    height: 100%;
    overflow-y: auto;

    &._active {
      opacity: 1;
      visibility: visible;
    }

    & .post-logo {
      margin-right: 12px;
    }

    & a.setting {
      color: #3498db;
      cursor: pointer;
      position: relative;

      [data-theme="dark"] & {
        color: #63b9f3;
      }

      &::after {
        content: 'готово';
        color: #555;
        position: absolute;
        right: -58px;
        transition: 1.3s ease;
        opacity: 0;

        [data-theme="dark"] & {
          color: #e3e6e6;
        }
      }

      &._done {
        &::after {
          transition-duration: 0s;
          opacity: 1;
        }
      }

      &:hover {
        border-bottom: 1px dashed;
      }
    }

    & p {
      margin: 0 0 12px;
      line-height: 1.4;
    }

    & label {
      display: block;
      padding: 8px 0;

      & > span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
      }
      & > input {
        display: inline-block;
        vertical-align: middle;
        height: auto;
      }
    }
  }
}
</style>
