import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { marked } from 'marked'
// Removed gray-matter to avoid Buffer issues in browser

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

// Lightweight frontmatter parser
function parseFrontmatter(text) {
    const pattern = /^---[\s\S]*?---/;
    const match = text.match(pattern);

    if (!match) return { data: {}, content: text };

    const frontmatterBlock = match[0];
    const content = text.replace(pattern, '').trim();
    const data = {};

    const lines = frontmatterBlock.split('\n');
    lines.forEach(line => {
        if (line.trim() === '---') return;
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove quotes if preserved
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            data[key.trim()] = value;
        }
    });

    return { data, content };
}

// Function to load article based on URL
async function loadArticle() {
    const container = document.querySelector('.article-content');
    if (!container) return false;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        container.innerHTML = '<div class="block"><p>Artículo no especificado.</p></div>';
        return true;
    }

    try {
        // Dynamic import of markdown content
        const modules = import.meta.glob('/content/*.md', { query: '?raw', eager: true });
        const key = `/content/${slug}.md`;

        if (!modules[key]) {
            throw new Error('Artículo no encontrado');
        }

        const rawContent = modules[key].default;
        // Use custom parser instead of gray-matter
        const { data, content } = parseFrontmatter(rawContent);
        const htmlContent = marked(content);

        // Render Article Structure
        const imgPath = data.heroImage ? data.heroImage.replace('../../', './') : '';

        const html = `
            <section id="inicio">
                <div class="title">
                    <h1>${data.title}</h1>
                    <h3 class="author-name">${data.author || ''}</h3>
                </div>
            </section>

            <section>
                <div class="parallax-one parallax-section">
                    <img src="${imgPath}" alt="${data.title}" class="parallax-img">
                </div>
            </section>

            <section>
                <div class="block">
                    ${htmlContent}
                </div>
            </section>
        `;

        container.innerHTML = html;
        return true;

    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="block"><p>Error cargando el artículo: ${error.message}</p></div>`;
        return true;
    }
}

// Setup parallax effect
function setupParallax() {
    // Standard parallax
    const standardSections = document.querySelectorAll('.parallax-one, .parallax-two');
    standardSections.forEach((section) => {
        const img = section.querySelector('.parallax-img');
        if (img) {
            gsap.fromTo(img,
                { yPercent: -40 },
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
            );
        }
    });

    // Special parallax for Truman Show (or similar layouts)
    const trumanSection = document.querySelector('.parallax-three');
    if (trumanSection) {
        const img = trumanSection.querySelector('.parallax-img');
        if (img) {
            gsap.fromTo(img,
                { yPercent: -20 },
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
            );
        }
    }
}

// Setup intro animation
function setupIntro() {
    // 1. Force initial state immediately
    gsap.set('.navbar', { y: -100, opacity: 0 });
    gsap.set('#parallax-world-of-ugg .title h1', { y: 20, opacity: 0 });
    gsap.set('#parallax-world-of-ugg .title h3', { y: 15, opacity: 0 });
    gsap.set('.quote-title', { y: 20, opacity: 0 });
    gsap.set('.separator', { scaleX: 0, opacity: 0 });
    gsap.set('.author-name', { y: 15, opacity: 0 });
    gsap.set('.parallax-section, .block', { y: 20, opacity: 0 });
    gsap.set('.review-card', { y: 30, opacity: 0 });

    // 2. Reveal body
    document.body.classList.add('loaded');

    // 3. Start Animation Timeline
    const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        delay: 0.2
    });

    tl.to('.navbar', { y: 0, opacity: 1, duration: 1 })
        .to('#parallax-world-of-ugg .title h1', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .to('#parallax-world-of-ugg .title h3', { y: 0, opacity: 1, duration: 0.8 }, '-=0.8')
        .to('.quote-title', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
        .to('.separator', { scaleX: 1, opacity: 1, duration: 0.8 }, '-=0.8')
        .to('.author-name', { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
        .to('.parallax-section, .block', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1
        }, '-=0.6')
        .to('.review-card', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1
        }, '-=0.6');
}

// Global initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Try to load article content if on article page
    const isArticle = await loadArticle();

    // Initialize animations
    setupParallax();
    setupIntro();

    // Refresh ScrollTrigger if content changed height
    if (isArticle) {
        ScrollTrigger.refresh();
    }
});

// Extra refresh on window load to be safe with images
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
