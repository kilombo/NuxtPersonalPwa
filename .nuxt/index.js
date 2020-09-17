import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '../layouts/error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'

/* Plugins */

import nuxt_plugin_plugin_e89cef8e from 'nuxt_plugin_plugin_e89cef8e' // Source: ./components/plugin.js (mode: 'all')
import nuxt_plugin_workbox_3b6efe2b from 'nuxt_plugin_workbox_3b6efe2b' // Source: ./workbox.js (mode: 'client')
import nuxt_plugin_nuxticons_2faad1d9 from 'nuxt_plugin_nuxticons_2faad1d9' // Source: ./nuxt-icons.js (mode: 'all')
import nuxt_plugin_pluginclient_4f5ae196 from 'nuxt_plugin_pluginclient_4f5ae196' // Source: ./content/plugin.client.js (mode: 'client')
import nuxt_plugin_pluginserver_3e0c00bd from 'nuxt_plugin_pluginserver_3e0c00bd' // Source: ./content/plugin.server.js (mode: 'server')
import nuxt_plugin_pluginrouting_c2d5a0d2 from 'nuxt_plugin_pluginrouting_c2d5a0d2' // Source: ./nuxt-i18n/plugin.routing.js (mode: 'all')
import nuxt_plugin_pluginmain_0b88bb38 from 'nuxt_plugin_pluginmain_0b88bb38' // Source: ./nuxt-i18n/plugin.main.js (mode: 'all')
import nuxt_plugin_axios_6a7b80cf from 'nuxt_plugin_axios_6a7b80cf' // Source: ./axios.js (mode: 'all')
import nuxt_plugin_vuecarousel_0d4d0f1e from 'nuxt_plugin_vuecarousel_0d4d0f1e' // Source: ../plugins/vue-carousel (mode: 'client')
import nuxt_plugin_lazyloadimages_1441dc9b from 'nuxt_plugin_lazyloadimages_1441dc9b' // Source: ../plugins/lazy-load-images.js (mode: 'all')
import nuxt_plugin_filters_2dd71012 from 'nuxt_plugin_filters_2dd71012' // Source: ../plugins/filters.js (mode: 'all')
import nuxt_plugin_currency_37da79e0 from 'nuxt_plugin_currency_37da79e0' // Source: ../plugins/currency.js (mode: 'all')
import nuxt_plugin_vuelidate_4be431c8 from 'nuxt_plugin_vuelidate_4be431c8' // Source: ../plugins/vuelidate.js (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext)

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"nuxt-personal-pwa","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Mi web personal"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"nuxt-personal-pwa"},{"hid":"author","name":"author","content":"Enrique Querol Garcés"},{"hid":"theme-color","name":"theme-color","content":"#fff"},{"hid":"og:type","name":"og:type","property":"og:type","content":"website"},{"hid":"og:title","name":"og:title","property":"og:title","content":"nuxt-personal-pwa"},{"hid":"og:site_name","name":"og:site_name","property":"og:site_name","content":"nuxt-personal-pwa"},{"hid":"og:description","name":"og:description","property":"og:description","content":"Mi web personal"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.5d232738.json"},{"rel":"shortcut icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_64.46472c.png"},{"rel":"apple-touch-icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_512.46472c.png","sizes":"512x512"}],"style":[],"script":[],"htmlAttrs":{"lang":"en"}},

    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_plugin_e89cef8e === 'function') {
    await nuxt_plugin_plugin_e89cef8e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_workbox_3b6efe2b === 'function') {
    await nuxt_plugin_workbox_3b6efe2b(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxticons_2faad1d9 === 'function') {
    await nuxt_plugin_nuxticons_2faad1d9(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_pluginclient_4f5ae196 === 'function') {
    await nuxt_plugin_pluginclient_4f5ae196(app.context, inject)
  }

  if (process.server && typeof nuxt_plugin_pluginserver_3e0c00bd === 'function') {
    await nuxt_plugin_pluginserver_3e0c00bd(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginrouting_c2d5a0d2 === 'function') {
    await nuxt_plugin_pluginrouting_c2d5a0d2(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginmain_0b88bb38 === 'function') {
    await nuxt_plugin_pluginmain_0b88bb38(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_6a7b80cf === 'function') {
    await nuxt_plugin_axios_6a7b80cf(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuecarousel_0d4d0f1e === 'function') {
    await nuxt_plugin_vuecarousel_0d4d0f1e(app.context, inject)
  }

  if (typeof nuxt_plugin_lazyloadimages_1441dc9b === 'function') {
    await nuxt_plugin_lazyloadimages_1441dc9b(app.context, inject)
  }

  if (typeof nuxt_plugin_filters_2dd71012 === 'function') {
    await nuxt_plugin_filters_2dd71012(app.context, inject)
  }

  if (typeof nuxt_plugin_currency_37da79e0 === 'function') {
    await nuxt_plugin_currency_37da79e0(app.context, inject)
  }

  if (typeof nuxt_plugin_vuelidate_4be431c8 === 'function') {
    await nuxt_plugin_vuelidate_4be431c8(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, () => {
        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from, next) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    app,
    router
  }
}

export { createApp, NuxtError }
