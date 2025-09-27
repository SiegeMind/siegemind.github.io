class I18n {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en-US'; // Default fallback
        this.supportedLanguages = ['pt-BR', 'en-US', 'es-ES'];
        this.fallbackLanguage = 'en-US';

        this.init();
    }

    async init() {
        try {
            // Load translations
            await this.loadTranslations();

            // Detect browser language
            this.detectLanguage();

            // Apply translations
            this.applyTranslations();

            // Setup language selector
            this.setupLanguageSelector();

        } catch (error) {
            console.error('I18n initialization failed:', error);
            // Fallback to English if something goes wrong
            this.currentLanguage = this.fallbackLanguage;
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch('./i18n/translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            throw error;
        }
    }

    detectLanguage() {
        // Check localStorage first
        const savedLanguage = localStorage.getItem('siegemind-language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
            return;
        }

        // Detect from browser
        const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];

        for (const lang of browserLanguages) {
            // Check for exact match
            if (this.supportedLanguages.includes(lang)) {
                this.currentLanguage = lang;
                return;
            }

            // Check for language prefix match (e.g., 'pt' matches 'pt-BR')
            const langPrefix = lang.split('-')[0];
            const matchedLang = this.supportedLanguages.find(supported =>
                supported.startsWith(langPrefix)
            );

            if (matchedLang) {
                this.currentLanguage = matchedLang;
                return;
            }
        }

        // Default to fallback
        this.currentLanguage = this.fallbackLanguage;
    }

    translate(key, fallbackText = '') {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        // Navigate through nested keys
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                translation = null;
                break;
            }
        }

        // If translation found, return it
        if (translation && typeof translation === 'string') {
            return translation;
        }

        // Try fallback language
        if (this.currentLanguage !== this.fallbackLanguage) {
            let fallbackTranslation = this.translations[this.fallbackLanguage];

            for (const k of keys) {
                if (fallbackTranslation && typeof fallbackTranslation === 'object' && k in fallbackTranslation) {
                    fallbackTranslation = fallbackTranslation[k];
                } else {
                    fallbackTranslation = null;
                    break;
                }
            }

            if (fallbackTranslation && typeof fallbackTranslation === 'string') {
                return fallbackTranslation;
            }
        }

        // Return fallback text or key as last resort
        return fallbackText || key;
    }

    applyTranslations() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Update meta tags
        this.updateMetaTags();

        // Update navigation
        this.updateNavigation();

        // Update hero section
        this.updateHeroSection();

        // Update how it works section
        this.updateHowItWorksSection();

        // Update testimonials section
        this.updateTestimonialsSection();

        // Update roadmap section
        this.updateRoadmapSection();

        // Update download section
        this.updateDownloadSection();

        // Update footer
        this.updateFooter();
    }

    updateMetaTags() {
        // Update title
        document.title = this.translate('meta.title');

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', this.translate('meta.description'));
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', this.translate('meta.keywords'));
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', this.translate('meta.title'));
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', this.translate('meta.description'));
        }

        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', this.translate('meta.title'));
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', this.translate('meta.description'));
        }
    }

    updateNavigation() {
        const navLinks = {
            'nav-link[href="#home"]': 'nav.home',
            'nav-link[href="#how-it-works"]': 'nav.howItWorks',
            'nav-link[href="#roadmap"]': 'nav.roadmap',
            '.nav-cta': 'nav.joinBeta'
        };

        Object.entries(navLinks).forEach(([selector, key]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = this.translate(key);
            }
        });
    }

    updateHeroSection() {
        // Hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = this.translate('hero.title');
        }

        // Hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.innerHTML = this.translate('hero.subtitle');
        }

        // Hero button
        const heroButton = document.querySelector('.hero-buttons .btn-primary');
        if (heroButton) {
            heroButton.textContent = this.translate('hero.joinBeta');
        }

        // Hero features
        const featureItems = document.querySelectorAll('.hero-features .feature-item span');
        const featureKeys = ['personalizedInsights', 'performanceDashboard', 'veteranProfessionals'];

        featureItems.forEach((item, index) => {
            if (featureKeys[index]) {
                item.textContent = this.translate(`hero.features.${featureKeys[index]}`);
            }
        });

        // Hero stats
        const statLabels = document.querySelectorAll('.stat-label');
        const statKeys = ['currentUsers', 'matchesStudied', 'insightsGenerated'];

        statLabels.forEach((label, index) => {
            if (statKeys[index]) {
                label.textContent = this.translate(`hero.stats.${statKeys[index]}`);
            }
        });
    }

    updateHowItWorksSection() {
        // Section title
        const sectionTitle = document.querySelector('#how-it-works .section-title');
        if (sectionTitle) {
            sectionTitle.textContent = this.translate('howItWorks.title');
        }

        // Section subtitle
        const sectionSubtitle = document.querySelector('#how-it-works .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = this.translate('howItWorks.subtitle');
        }

        // Step cards
        const stepCards = document.querySelectorAll('.step-card');
        const stepKeys = ['dataCollection', 'dataProcessing', 'aiAnalysis', 'actionableInsights'];

        stepCards.forEach((card, index) => {
            if (stepKeys[index]) {
                const title = card.querySelector('.step-title');
                const description = card.querySelector('.step-description');

                if (title) {
                    title.textContent = this.translate(`howItWorks.steps.${stepKeys[index]}.title`);
                }
                if (description) {
                    description.textContent = this.translate(`howItWorks.steps.${stepKeys[index]}.description`);
                }
            }
        });
    }

    updateTestimonialsSection() {
        // Section title
        const sectionTitle = document.querySelector('.testimonials .section-title');
        if (sectionTitle) {
            sectionTitle.textContent = this.translate('testimonials.title');
        }

        // Section subtitle
        const sectionSubtitle = document.querySelector('.testimonials .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = this.translate('testimonials.subtitle');
        }

        // Testimonial texts
        const testimonialTexts = document.querySelectorAll('.testimonial-text');
        const reviewKeys = ['alex', 'mike', 'sarah'];

        testimonialTexts.forEach((text, index) => {
            if (reviewKeys[index]) {
                text.textContent = this.translate(`testimonials.reviews.${reviewKeys[index]}`);
            }
        });
    }

    updateRoadmapSection() {
        // Section title
        const sectionTitle = document.querySelector('#roadmap .section-title');
        if (sectionTitle) {
            sectionTitle.innerHTML = this.translate('roadmap.title');
        }

        // Section subtitle
        const sectionSubtitle = document.querySelector('#roadmap .section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = this.translate('roadmap.subtitle');
        }

        // Roadmap statuses
        const roadmapStatuses = document.querySelectorAll('.roadmap-status');
        const statusKeys = ['current', 'next', 'future', 'future'];

        roadmapStatuses.forEach((status, index) => {
            if (statusKeys[index]) {
                status.textContent = this.translate(`roadmap.status.${statusKeys[index]}`);
            }
        });

        // Roadmap titles
        const roadmapTitles = document.querySelectorAll('.roadmap-title');
        const phaseKeys = ['core', 'enhanced', 'team', 'advanced'];

        roadmapTitles.forEach((title, index) => {
            if (phaseKeys[index]) {
                title.textContent = this.translate(`roadmap.phases.${phaseKeys[index]}.title`);
            }
        });
    }

    updateDownloadSection() {
        // Section title
        const sectionTitle = document.querySelector('.download-title');
        if (sectionTitle) {
            sectionTitle.innerHTML = this.translate('download.title');
        }

        // Section subtitle
        const sectionSubtitle = document.querySelector('.download-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = this.translate('download.subtitle');
        }

        // System requirements title
        const requirementsTitle = document.querySelector('.download-info h3');
        if (requirementsTitle) {
            requirementsTitle.textContent = this.translate('download.systemRequirements');
        }

        // Requirements list
        const requirementsList = document.querySelectorAll('.requirements-list li');
        requirementsList.forEach((item, index) => {
            const icon = item.querySelector('i');
            const requirement = this.translate(`download.requirements.${index}`, '');
            if (requirement) {
                item.innerHTML = '';
                if (icon) {
                    item.appendChild(icon.cloneNode(true));
                }
                item.appendChild(document.createTextNode(' ' + requirement));
            }
        });

        // What's included title
        const includedTitle = document.querySelectorAll('.download-info h3')[1];
        if (includedTitle) {
            includedTitle.textContent = this.translate('download.whatsIncluded');
        }

        // Included list
        const includedList = document.querySelectorAll('.included-list li');
        includedList.forEach((item, index) => {
            const icon = item.querySelector('i');
            const included = this.translate(`download.included.${index}`, '');
            if (included) {
                item.innerHTML = '';
                if (icon) {
                    item.appendChild(icon.cloneNode(true));
                }
                item.appendChild(document.createTextNode(' ' + included));
            }
        });

        // Download button
        const downloadButton = document.querySelector('.download .btn-primary');
        if (downloadButton) {
            const icon = downloadButton.querySelector('i');
            downloadButton.innerHTML = '';
            if (icon) {
                downloadButton.appendChild(icon.cloneNode(true));
            }
            downloadButton.appendChild(document.createTextNode(' ' + this.translate('download.downloadButton')));
        }
    }

    updateFooter() {
        // Footer description
        const footerDescription = document.querySelector('.footer-description');
        if (footerDescription) {
            footerDescription.textContent = this.translate('footer.description');
        }

        // Footer column headers
        const columnHeaders = document.querySelectorAll('.footer-column h4');
        const headerKeys = ['product', 'support'];

        columnHeaders.forEach((header, index) => {
            if (headerKeys[index]) {
                header.textContent = this.translate(`footer.${headerKeys[index]}`);
            }
        });

        // Footer links
        const footerLinks = {
            'a[href="#how-it-works"]': 'footer.links.howItWorks',
            'a[href="#roadmap"]': 'footer.links.roadmap',
            'a[href="#download"]': 'footer.links.download'
        };

        Object.entries(footerLinks).forEach(([selector, key]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.closest('.footer')) {
                    element.textContent = this.translate(key);
                }
            });
        });

        // Footer copyright
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.textContent = this.translate('footer.copyright');
        }
    }

    setupLanguageSelector() {
        // Create language selector if it doesn't exist
        let languageSelector = document.querySelector('.language-selector');

        if (!languageSelector) {
            languageSelector = this.createLanguageSelector();

            // Add to nav-right container
            const navRight = document.querySelector('.nav-right');
            if (navRight) {
                navRight.appendChild(languageSelector);
            }
        }

        // Update current selection
        this.updateLanguageSelector();
    }

    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';

        const languageNames = {
            'pt-BR': 'PT',
            'en-US': 'EN',
            'es-ES': 'ES'
        };

        const currentButton = document.createElement('button');
        currentButton.className = 'language-current';
        currentButton.innerHTML = `
            <span class="language-text">${languageNames[this.currentLanguage]}</span>
            <i class="fas fa-chevron-down"></i>
        `;

        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';

        this.supportedLanguages.forEach(lang => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.dataset.lang = lang;
            option.textContent = languageNames[lang];

            if (lang === this.currentLanguage) {
                option.classList.add('active');
            }

            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeLanguage(lang);
            });

            dropdown.appendChild(option);
        });

        currentButton.addEventListener('click', (e) => {
            e.preventDefault();
            selector.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('open');
            }
        });

        selector.appendChild(currentButton);
        selector.appendChild(dropdown);

        return selector;
    }

    updateLanguageSelector() {
        const languageNames = {
            'pt-BR': 'PT',
            'en-US': 'EN',
            'es-ES': 'ES'
        };

        const currentText = document.querySelector('.language-current .language-text');
        if (currentText) {
            currentText.textContent = languageNames[this.currentLanguage];
        }

        // Update active option
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLanguage);
        });
    }

    changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Language ${language} is not supported`);
            return;
        }

        this.currentLanguage = language;

        // Save to localStorage
        localStorage.setItem('siegemind-language', language);

        // Apply translations
        this.applyTranslations();

        // Update selector
        this.updateLanguageSelector();

        // Close dropdown
        const selector = document.querySelector('.language-selector');
        if (selector) {
            selector.classList.remove('open');
        }

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language }
        }));
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}