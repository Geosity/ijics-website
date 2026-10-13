import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const MQ = '(max-width: 760px)'
const INTERVAL = 8000
const COUNT = 4

export function useFeatureCarousel(slide) {
  const carouselRef = ref(null)
  const trackRef = ref(null)
  let timer = 0
  let raf = 0
  let observer
  let mq
  let paused = false
  let hover = false
  let focused = false

  const getSlides = () => {
    const track = trackRef.value
    return track ? Array.from(track.querySelectorAll('.feature-slide')) : []
  }

  const applyHeight = () => {
    const track = trackRef.value
    const el = getSlides()[slide.value]
    if (track && el) track.style.height = `${el.scrollHeight}px`
  }

  const scheduleHeight = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      raf = 0
      applyHeight()
    })
  }

  const blocked = () => paused || hover || focused || !!(mq && mq.matches)

  const stop = () => {
    if (!timer) return
    clearInterval(timer)
    timer = 0
  }

  const start = () => {
    stop()
    if (blocked()) return
    timer = setInterval(() => {
      if (!blocked()) slide.value = (slide.value + 1) % COUNT
    }, INTERVAL)
  }

  const pause = () => {
    paused = true
    stop()
  }

  const resume = () => {
    paused = false
    start()
  }

  const onPointerEnter = () => { hover = true; stop() }
  const onPointerLeave = () => { hover = false; start() }
  const onFocusIn = () => { focused = true; stop() }
  const onFocusOut = (e) => {
    const root = carouselRef.value
    if (root && e.relatedTarget && root.contains(e.relatedTarget)) return
    focused = false
    start()
  }
  const onResize = () => { scheduleHeight(); start() }

  const eachImg = (fn) => {
    getSlides().forEach((s) => s.querySelectorAll('img').forEach(fn))
  }

  const bindRoot = (on) => {
    const el = carouselRef.value
    if (!el) return
    const m = on ? 'addEventListener' : 'removeEventListener'
    el[m]('pointerenter', onPointerEnter)
    el[m]('pointerleave', onPointerLeave)
    el[m]('focusin', onFocusIn)
    el[m]('focusout', onFocusOut)
  }

  watch(slide, () => nextTick(applyHeight))

  onMounted(() => {
    mq = window.matchMedia(MQ)
    if (mq.addEventListener) mq.addEventListener('change', onResize)
    else mq.addListener(onResize)
    window.addEventListener('resize', onResize)
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleHeight)
      getSlides().forEach((el) => observer.observe(el))
    }
    eachImg((img) => img.addEventListener('load', scheduleHeight))
    bindRoot(true)
    nextTick(applyHeight)
    start()
  })

  onUnmounted(() => {
    stop()
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    window.removeEventListener('resize', onResize)
    if (mq) {
      if (mq.removeEventListener) mq.removeEventListener('change', onResize)
      else mq.removeListener(onResize)
    }
    if (observer) observer.disconnect()
    eachImg((img) => img.removeEventListener('load', scheduleHeight))
    bindRoot(false)
  })

  return { carouselRef, trackRef, pause, resume }
}
