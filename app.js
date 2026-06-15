const init = () => {

    // ==========================================================================
    // 1. MOBILE MENU TOGGLER
    // ==========================================================================
    const menuToggler = document.getElementById('menu-toggler');
    const navbarNav = document.getElementById('navbar-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggler && navbarNav) {
        menuToggler.addEventListener('click', () => {
            navbarNav.classList.toggle('open');
            menuToggler.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('open');
            if (menuToggler) menuToggler.classList.remove('active');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ==========================================================================
    // 2. REAL-TIME SHOP STATUS (OPEN/CLOSED) - MADRID TIME ZONE
    // ==========================================================================
    const checkShopStatus = () => {
        const badge = document.getElementById('status-badge');
        if (!badge) return;

        const textSpan = badge.querySelector('.badge-text');
        
        try {
            // Get date and time in Madrid timezone
            const now = new Date();
            
            const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short' });
            const madridDay = dayFormatter.format(now);
            
            const timeFormatter = new Intl.DateTimeFormat('en-US', { 
                timeZone: 'Europe/Madrid', 
                hour: 'numeric', 
                minute: 'numeric', 
                hour12: false 
            });
            const madridTimeStr = timeFormatter.format(now);
            const [madridHour, madridMinute] = madridTimeStr.split(':').map(Number);
            
            let isOpen = false;
            let statusText = '';

            if (madridDay === 'Sun') {
                isOpen = false;
                statusText = 'Cerrado por descanso';
            } else {
                // Monday to Saturday: 08:00 to 23:00
                const currentMinutes = madridHour * 60 + madridMinute;
                const openMinutes = 8 * 60; // 08:00
                const closeMinutes = 23 * 60; // 23:00
                
                if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
                    isOpen = true;
                    statusText = 'Abierto ahora';
                } else {
                    isOpen = false;
                    statusText = 'Cerrado ahora';
                }
            }

            textSpan.textContent = statusText;
            if (isOpen) {
                badge.classList.remove('closed');
                badge.classList.add('open');
            } else {
                badge.classList.remove('open');
                badge.classList.add('closed');
            }
        } catch (error) {
            console.error('Error formatting Madrid time:', error);
            // Fallback basic check
            const localHour = new Date().getHours();
            const localDay = new Date().getDay();
            
            if (localDay === 0) {
                textSpan.textContent = 'Cerrado por descanso';
                badge.className = 'status-badge closed';
            } else if (localHour >= 8 && localHour < 23) {
                textSpan.textContent = 'Abierto ahora';
                badge.className = 'status-badge open';
            } else {
                textSpan.textContent = 'Cerrado ahora';
                badge.className = 'status-badge closed';
            }
        }
    };

    checkShopStatus();
    setInterval(checkShopStatus, 60000); // Check every minute

    // ==========================================================================
    // 3. MENU TABS FILTERING
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCategory = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                
                setTimeout(() => {
                    if (selectedCategory === 'todos' || cardCategory === selectedCategory) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // ==========================================================================
    // 4. INTERACTIVE SHOPPING CART & WHATSAPP ORDERS
    // ==========================================================================
    let cart = [];
    const WHATSAPP_NUMBER = '34910269580'; // Country prefix 34 + Fixed phone number

    const btnAdds = document.querySelectorAll('.btn-add');
    const cartItemsList = document.getElementById('cart-items');
    const cartEmptyState = document.getElementById('cart-empty');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const cartBadgeCount = document.getElementById('cart-badge-count');
    const cartTotalPrice = document.getElementById('total-price');

    // Floating button elements
    const floatingBasketBtn = document.getElementById('floating-basket-btn');
    const floatingBasketCount = document.getElementById('floating-basket-count');

    // Add Item Action
    btnAdds.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
            
            // Visual feedback on the button
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
            this.style.backgroundColor = '#25D366';
            this.style.borderColor = '#25D366';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 1000);
        });
    });

    const addToCart = (id, name, price) => {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }
        updateCartUI();
    };

    const changeQuantity = (id, delta) => {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCartUI();
    };

    const updateCartUI = () => {
        cartItemsList.innerHTML = '';
        
        if (cart.length === 0) {
            cartEmptyState.style.display = 'block';
            cartItemsList.style.display = 'none';
            cartSummaryContainer.style.display = 'none';
            if (floatingBasketBtn) floatingBasketBtn.style.display = 'none';
            
            cartBadgeCount.textContent = '0 platos';
        } else {
            cartEmptyState.style.display = 'none';
            cartItemsList.style.display = 'flex';
            cartSummaryContainer.style.display = 'block';
            if (floatingBasketBtn) floatingBasketBtn.style.display = 'flex';

            let totalCount = 0;
            let totalPriceVal = 0;

            cart.forEach(item => {
                totalCount += item.qty;
                totalPriceVal += item.price * item.qty;

                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price-each">${item.price.toFixed(2).replace('.', ',')} € / ud</span>
                    </div>
                    <div class="cart-item-qty-controls">
                        <button class="btn-qty btn-minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="btn-qty btn-plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <span class="cart-item-price-sub">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
                `;
                cartItemsList.appendChild(li);
            });

            // Re-assign listeners for quantity buttons
            cartItemsList.querySelectorAll('.btn-minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    changeQuantity(this.getAttribute('data-id'), -1);
                });
            });

            cartItemsList.querySelectorAll('.btn-plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    changeQuantity(this.getAttribute('data-id'), 1);
                });
            });

            // Update DOM badges and totals
            cartBadgeCount.textContent = `${totalCount} ${totalCount === 1 ? 'plato' : 'platos'}`;
            if (floatingBasketCount) floatingBasketCount.textContent = totalCount;
            cartTotalPrice.textContent = `${totalPriceVal.toFixed(2).replace('.', ',')} €`;
        }
    };

    // Send order via WhatsApp link
    const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');
    const inputOrderName = document.getElementById('order-name');
    const inputOrderTime = document.getElementById('order-time');

    if (btnSendWhatsapp) {
        btnSendWhatsapp.addEventListener('click', () => {
            const clientName = inputOrderName.value.trim();
            const pickupTime = inputOrderTime.value.trim();

            if (!clientName) {
                alert('Por favor, indica tu nombre para preparar el encargo.');
                inputOrderName.focus();
                return;
            }

            if (!pickupTime) {
                alert('Por favor, selecciona una hora de recogida.');
                inputOrderTime.focus();
                return;
            }

            // Construct text message
            let messageText = `¡Hola Deborah! Me gustaría realizar un pedido para recoger:\n\n`;
            messageText += `👤 *Cliente:* ${clientName}\n`;
            messageText += `⏰ *Recogida:* ${pickupTime} h\n\n`;
            messageText += `📦 *Detalle del pedido:*\n`;

            let grandTotal = 0;
            cart.forEach(item => {
                const sub = item.price * item.qty;
                grandTotal += sub;
                messageText += `• ${item.qty}x ${item.name} (${sub.toFixed(2).replace('.', ',')} €)\n`;
            });

            messageText += `\n💵 *Total estimado:* ${grandTotal.toFixed(2).replace('.', ',')} €\n\n`;
            messageText += `_Por favor, confírmame que has recibido el pedido indicando la hora a la que estará listo. ¡Muchas gracias!_`;

            // Open WhatsApp link in new window
            const encodedText = encodeURIComponent(messageText);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
            window.open(waUrl, '_blank');
        });
    }

    // ==========================================================================
    // 5. TESTIMONIALS SLIDER / CAROUSEL
    // ==========================================================================
    const sliderContainer = document.getElementById('slider-container');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const dotsContainer = document.getElementById('slider-dots');

    let slideIndex = 0;
    let autoPlayTimer;

    if (sliderContainer && slides.length > 0) {
        const totalSlides = slides.length;

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot-indicator');
            dots.forEach((dot, idx) => {
                if (idx === slideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const showSlide = (idx) => {
            if (idx < 0) {
                slideIndex = totalSlides - 1;
            } else if (idx >= totalSlides) {
                slideIndex = 0;
            } else {
                slideIndex = idx;
            }

            sliderContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
            
            slides.forEach((slide, sIdx) => {
                if (sIdx === slideIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            updateDots();
        };

        // Prev and Next controllers
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(slideIndex + 1);
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(slideIndex - 1);
                resetAutoPlay();
            });
        }

        // Indicator dots actions
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot-indicator').forEach(dot => {
                dot.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-slide-index'));
                    showSlide(idx);
                    resetAutoPlay();
                });
            });
        }

        // AutoPlay timers
        const startAutoPlay = () => {
            autoPlayTimer = setInterval(() => {
                showSlide(slideIndex + 1);
            }, 6000); // 6 seconds auto-transition
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        };

        startAutoPlay();

        // Pause autoplay on mouse enter
        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(autoPlayTimer);
            });
            sliderWrapper.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        }
    }

    // Scroll shrink effect for large header logo
    const navbarHeader = document.getElementById('navbar-header');
    if (navbarHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbarHeader.classList.add('scrolled');
            } else {
                navbarHeader.classList.remove('scrolled');
            }
        });
    }
};

// Start initialization on window load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
