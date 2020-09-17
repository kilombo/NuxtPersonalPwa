import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _41d9ae22 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _1fec7e74 = () => interopDefault(import('../pages/my-components.vue' /* webpackChunkName: "pages/my-components" */))
const _0114603e = () => interopDefault(import('../pages/my-components.unit.js' /* webpackChunkName: "pages/my-components.unit" */))
const _5413422e = () => interopDefault(import('../pages/docs/_slug.vue' /* webpackChunkName: "pages/docs/_slug" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'exact-active-link',
  scrollBehavior,

  routes: [{
    path: "/es",
    component: _41d9ae22,
    name: "index___es"
  }, {
    path: "/my-components",
    component: _1fec7e74,
    name: "my-components___en"
  }, {
    path: "/my-components.unit",
    component: _0114603e,
    name: "my-components.unit___en"
  }, {
    path: "/es/my-components",
    component: _1fec7e74,
    name: "my-components___es"
  }, {
    path: "/es/my-components.unit",
    component: _0114603e,
    name: "my-components.unit___es"
  }, {
    path: "/es/docs/:slug?",
    component: _5413422e,
    name: "docs-slug___es"
  }, {
    path: "/docs/:slug?",
    component: _5413422e,
    name: "docs-slug___en"
  }, {
    path: "/",
    component: _41d9ae22,
    name: "index___en"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
