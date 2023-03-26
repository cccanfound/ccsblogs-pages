import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // NProgress.done()
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          NProgress.done()
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    }
    //现在不开放注册
    // else if (to.path === '/' +
    //   'register') {
    //   // if is logged in, redirect to the home page
    //   next()
    //   NProgress.done()
    // }
    /**
     * 曾经版本的处理方式，现在引入新的主页了
     */
    // //查看首页放行
    // else if (to.path === '/dashboard' ) {
    //   // in the free login whitelist, go directly
    //   next()
    // }
    // //查看文章放行
    // else if (to.path === '/essay/essayContent' ) {
    //   // in the free login whitelist, go directly
    //   next()
    // }else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   next(`/login?redirect=${to.path}`)
    //   NProgress.done()
    // }
    else if (to.path === '/indexForCustomer' ) {
      // in the free login whitelist, go directly
      next()
    }
    else if (to.path === '/contentForCustomer' ) {
      // in the free login whitelist, go directly
      next()
    }
    else{
      next(`/indexForCustomer`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
