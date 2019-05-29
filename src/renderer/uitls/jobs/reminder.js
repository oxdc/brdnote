export default function reminder (duration, remindingTime) {
  setInterval(() => {
    var openingTime = window.vueStore.getters.openingTime
    var now = new Date().getTime()
    var distance = now - openingTime
    var lastStoredTime = window.vueStore.getters.lastSavedTime
    var newTime = lastStoredTime + distance
    window.vueStore.commit('updateTotalTime', {
      newTime: newTime
    })
    var hours = Math.floor(distance / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)
    window.vueStore.commit('setTimer', {
      h: hours,
      m: minutes,
      s: seconds
    })
    var timer = hours + 'h ' + minutes + 'm ' + seconds + 's'
    if (distance % remindingTime === 0) {
      window.vueRoot.$Message.info({
        content: 'You have been working for ' + timer + ', you\'d better take a break.',
        duration: 15
      })
    }
  }, duration)
}
