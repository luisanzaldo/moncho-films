import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Initialize Lenis for smooth scrolling
const lenis = new Lenis()

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
