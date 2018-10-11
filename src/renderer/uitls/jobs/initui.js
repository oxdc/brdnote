export default function initui () {
  window.vueStore.commit('initOpeningTime', {
    openingTime: new Date().getTime()
  })

  function changeMargins () {
    var notice = document.getElementsByClassName('ivu-notice')
    var toolbar = document.getElementById('toolbar-plane')
    if (notice) {
      Array.from(notice).forEach((e) => {
        e.style.marginTop = toolbar.clientHeight + 'px'
      })
    }
    var message = document.getElementsByClassName('ivu-message')
    if (message) {
      Array.from(message).forEach((e) => {
        e.style.marginTop = toolbar.clientHeight + 'px'
      })
    }
  }

  changeMargins()
  window.addEventListener('resize', changeMargins, true)

  var targetNode = document.body
  var config = {
    childList: true
  }
  var callback = () => {
    changeMargins()
  }

  var observer = new MutationObserver(callback)
  observer.observe(targetNode, config)
}
