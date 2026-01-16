import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
})

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Setup parallax effect for all parallax sections
function setupParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-one, .parallax-two, .parallax-three')

    parallaxSections.forEach((section) => {
        const img = section.querySelector('.parallax-img')

        if (img) {
            // Create intense parallax effect - large movement range
            gsap.fromTo(img,
                {
                    yPercent: -40 // Start: image shifted significantly up
                },
                {
                    yPercent: 40, // End: image shifted significantly down
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.3, // Faster response for more dramatic effect
                    }
                }
            )
        }
    })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupParallax)

// Also run on window load to ensure images are ready
window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})
