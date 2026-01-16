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

// Setup intro animation
function setupIntro() {
    document.body.classList.add('loaded')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.navbar',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    )
        .fromTo('#parallax-world-of-ugg .title h1',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            '-=0.6'
        )
        .fromTo('#parallax-world-of-ugg .title h3',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            '-=0.8'
        )
        // Support for criticas page titles too
        .fromTo('.quote-title',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            '-=1'
        )
        .fromTo('.separator',
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.8 },
            '-=0.8'
        )
        .fromTo('.author-name',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            '-=0.6'
        )
        // Animate main content gracefully
        .fromTo('.parallax-section, .block, .reviews-container',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
            '-=0.4'
        )
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupParallax()
    setupIntro()
})

// Also run on window load to ensure images are ready
window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})
