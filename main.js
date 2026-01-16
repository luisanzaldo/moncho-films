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
    // Parallax for Pan's Labyrinth and Sunrise
    const standardSections = document.querySelectorAll('.parallax-one, .parallax-two')

    standardSections.forEach((section) => {
        const img = section.querySelector('.parallax-img')

        if (img) {
            gsap.fromTo(img,
                {
                    yPercent: -40
                },
                {
                    yPercent: 40,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.3,
                    }
                }
            )
        }
    })

    // Special parallax for The Truman Show - starts lower to show actor's face
    const trumanSection = document.querySelector('.parallax-three')
    if (trumanSection) {
        const img = trumanSection.querySelector('.parallax-img')

        if (img) {
            gsap.fromTo(img,
                {
                    yPercent: -20 // Starts higher (image shifted less up) to show face
                },
                {
                    yPercent: 50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: trumanSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.3,
                    }
                }
            )
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupParallax)

// Also run on window load to ensure images are ready
window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})
