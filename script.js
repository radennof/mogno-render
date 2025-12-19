import { translations, portfolioData, faqData } from './data.js';

let currentLang = 'es';
let isManifestoPlaying = false;
let portfolioLimit = 6;
let currentFilter = 'all';

const init = () => {
    lucide.createIcons();
    setupHeader();
    setupLanguage();
    renderPortfolio();
    renderFAQ();
    setupFilters();
    setupScrollReveal();
    setupManifestoPlayer();
    setupWhatsAppFab();
    setupShowMore();
};

const setupHeader = () => {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

const setupLanguage = () => {
    window.setLanguage = (lang) => {
        currentLang = lang;
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        document.querySelectorAll('.lang-flag-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${lang}`).classList.add('active');

        renderFAQ();
        const manifestoAudio = document.getElementById('manifesto-audio');
        manifestoAudio.src = translations[lang].manifesto_audio;
        if (isManifestoPlaying) stopManifesto();
        

        renderPortfolio();
    };
};

const renderPortfolio = () => {
    const grid = document.getElementById('portfolio-grid');
    const showMoreBtn = document.getElementById('show-more-portfolio');
    grid.innerHTML = '';

    const filteredItems = currentFilter === 'all' 
        ? portfolioData 
        : portfolioData.filter(i => i.category === currentFilter);

    const visibleItems = filteredItems.slice(0, portfolioLimit);

    visibleItems.forEach(item => {
        const article = document.createElement('article');
        article.className = 'portfolio-item reveal active group';
        
        const mediaHtml = item.type === 'video' 
            ? `<video autoplay muted loop playsinline class="w-full h-full object-cover"><source src="${item.src}" type="video/mp4"></video>`
            : `<img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover">`;

        article.innerHTML = `
            ${mediaHtml}
            <div class="portfolio-item-overlay absolute inset-0 flex flex-col justify-end p-8 text-white">
                <p class="font-mono text-[9px] tracking-[0.4em] uppercase text-bronze mb-3">${item.location}</p>
                <h3 class="text-xl font-bold tracking-tight uppercase">${item.title}</h3>
            </div>
        `;
        grid.appendChild(article);
    });

    if (filteredItems.length <= portfolioLimit) {
        showMoreBtn.parentElement.classList.add('hidden');
    } else {
        showMoreBtn.parentElement.classList.remove('hidden');
    }
};

const setupFilters = () => {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            portfolioLimit = 6; // Reset limit on filter change
            renderPortfolio();
        });
    });
};

const setupShowMore = () => {
    const btn = document.getElementById('show-more-portfolio');
    btn.addEventListener('click', () => {
        portfolioLimit = 999; // Show all
        renderPortfolio();
    });
};

const renderFAQ = () => {
    const container = document.getElementById('faq-container');
    container.innerHTML = faqData.map((item, i) => `
        <div class="faq-item bg-white border border-mogno-earth/5 rounded-sm transition-all duration-300">
            <button class="w-full px-8 py-6 text-left flex justify-between items-center group" onclick="this.parentElement.classList.toggle('active')">
                <h3 class="font-bold uppercase tracking-widest text-xs transition-colors group-hover:text-bronze">${currentLang === 'es' ? item.q_es : item.q_en}</h3>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-500"></i>
            </button>
            <div class="faq-answer px-8">
                <p class="pb-6 text-sm text-mogno-earth/60 leading-relaxed font-light">${currentLang === 'es' ? item.a_es : item.a_en}</p>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
};

const setupScrollReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

const setupManifestoPlayer = () => {
    const audio = document.getElementById('manifesto-audio');
    const btn = document.getElementById('manifesto-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const soundwave = document.getElementById('soundwave');
    const statusText = document.getElementById('manifesto-status');
    const manifestoBox = document.querySelector('.manifesto-box');

    audio.src = translations[currentLang].manifesto_audio;

    for(let i=0; i<30; i++) {
        const bar = document.createElement('div');
        bar.className = 'v-bar';
        bar.style.height = `${Math.random() * 20 + 5}px`;
        bar.style.animationDelay = `${i * 0.05}s`;
        soundwave.appendChild(bar);
    }

    const startManifesto = () => {
        audio.play();
        isManifestoPlaying = true;
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        manifestoBox.classList.add('audio-playing');
        statusText.innerText = translations[currentLang].manifesto_playing;
    };

    const stopManifesto = () => {
        audio.pause();
        isManifestoPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        manifestoBox.classList.remove('audio-playing');
        statusText.innerText = translations[currentLang].manifesto_cta;
    };

    window.stopManifesto = stopManifesto;

    btn.addEventListener('click', () => {
        if (isManifestoPlaying) stopManifesto();
        else startManifesto();
    });

    audio.onended = stopManifesto;
};

const setupWhatsAppFab = () => {
    const fab = document.getElementById('whatsapp-fab');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            fab.classList.remove('translate-y-20', 'opacity-0');
        } else {
            fab.classList.add('translate-y-20', 'opacity-0');
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
