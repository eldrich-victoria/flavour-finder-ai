// ===============================
// MAIN JAVASCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // 1. NAVBAR SCROLL EFFECT
    // ===============================
    const navbar = document.getElementById('mainNav');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    // ===============================
    // 2. IMAGE CAROUSEL
    // ===============================
    const carousel = document.getElementById('heroCarousel');
    const dots = document.querySelectorAll('.carousel-dot');

    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        let carouselInterval = null;
        let isPaused = false;

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        function startCarousel() {
            if (carouselInterval) clearInterval(carouselInterval);
            carouselInterval = setInterval(() => {
                if (!isPaused) nextSlide();
            }, 4000);
        }

        // Dot click
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                goToSlide(parseInt(this.dataset.index));
                startCarousel(); // Reset timer on manual click
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { isPaused = false; });

        // Start
        startCarousel();
    }


    // ===============================
    // 3. FORM SUBMIT — LOADING STATE
    // ===============================
    const form = document.getElementById('recommendForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form && submitBtn) {
        form.addEventListener('submit', function (e) {
            const restaurantSelect = document.getElementById('restaurantSelect');

            if (restaurantSelect && restaurantSelect.value === '') {
                e.preventDefault();
                restaurantSelect.focus();
                restaurantSelect.style.borderColor = '#ef4444';
                restaurantSelect.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.25)';
                setTimeout(() => {
                    restaurantSelect.style.borderColor = '';
                    restaurantSelect.style.boxShadow = '';
                }, 2000);
                return;
            }

            // Show loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.textContent = 'Finding restaurants...';
            submitBtn.disabled = true;
        });
    }


    // ===============================
    // 4. FADE-IN ON SCROLL (IntersectionObserver)
    // ===============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe step cards
    document.querySelectorAll('.step-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });


    // ===============================
    // 5. SMOOTH SCROLL FOR ANCHOR LINKS
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ===============================
    // 6. SEARCHABLE SELECT (for restaurant dropdown)
    // ===============================
    const restaurantSelect = document.getElementById('restaurantSelect');

    if (restaurantSelect && restaurantSelect.options.length > 100) {
        // Create a searchable wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'searchable-select-wrapper';
        wrapper.style.cssText = 'position: relative; width: 100%;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-select';
        searchInput.placeholder = '🔍 Type to search restaurants...';
        searchInput.id = 'restaurantSearch';
        searchInput.autocomplete = 'off';

        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 240px;
            overflow-y: auto;
            background: #1a1a24;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 0 0 12px 12px;
            z-index: 100;
            display: none;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        `;

        // If there's a pre-selected value, show it
        if (restaurantSelect.value) {
            searchInput.value = restaurantSelect.value;
        }

        restaurantSelect.style.display = 'none';
        restaurantSelect.parentElement.appendChild(wrapper);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(dropdown);

        const allOptions = Array.from(restaurantSelect.options)
            .filter(o => o.value !== '')
            .map(o => o.value);

        function renderDropdown(filter) {
            const matches = filter.length < 2
                ? []
                : allOptions.filter(name => name.toLowerCase().includes(filter.toLowerCase())).slice(0, 30);

            dropdown.innerHTML = '';

            if (filter.length < 2 && filter.length > 0) {
                dropdown.innerHTML = '<div style="padding: 12px 16px; color: #6b6b80; font-size: 13px;">Type at least 2 characters...</div>';
                dropdown.style.display = 'block';
                return;
            }

            if (matches.length === 0 && filter.length >= 2) {
                dropdown.innerHTML = '<div style="padding: 12px 16px; color: #6b6b80; font-size: 13px;">No restaurants found</div>';
                dropdown.style.display = 'block';
                return;
            }

            matches.forEach(name => {
                const item = document.createElement('div');
                item.textContent = name;
                item.style.cssText = `
                    padding: 10px 16px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #f0f0f5;
                    transition: background 0.15s;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                `;
                item.addEventListener('mouseenter', () => {
                    item.style.background = 'rgba(245, 158, 11, 0.15)';
                    item.style.color = '#fbbf24';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                    item.style.color = '#f0f0f5';
                });
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    searchInput.value = name;
                    restaurantSelect.value = name;
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(item);
            });

            dropdown.style.display = matches.length > 0 ? 'block' : 'none';
        }

        searchInput.addEventListener('input', () => {
            renderDropdown(searchInput.value);
            // Reset the hidden select if user changes text
            restaurantSelect.value = '';
            // Check if the text exactly matches an option
            const exactMatch = allOptions.find(n => n.toLowerCase() === searchInput.value.toLowerCase());
            if (exactMatch) {
                restaurantSelect.value = exactMatch;
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length >= 2) {
                renderDropdown(searchInput.value);
            }
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });
    }

});