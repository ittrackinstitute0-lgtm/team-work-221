/**
 * Roof Yard - Main Application JavaScript
 * Connects UI with LocalStorage Data Layer (RoofYardDB)
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let cart = JSON.parse(localStorage.getItem('roofyard_cart') || '[]');
    let currentCategory = 'all';
    let currentDietary = 'all';
    let searchQuery = '';

    // Elements
    const menuContainer = document.getElementById('menu-items-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const dietaryBtns = document.querySelectorAll('.dietary-btn');
    const searchInput = document.getElementById('menu-search-input');
    
    // Cart Elements
    const cartBtn = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartBadge = document.getElementById('cart-badge-count');
    const cartList = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-trigger-btn');

    // Modals
    const checkoutModal = document.getElementById('checkout-modal');
    const reservationModal = document.getElementById('reservation-success-modal');
    const reviewModal = document.getElementById('review-modal');

    // Forms
    const reservationForm = document.getElementById('table-reservation-form');
    const checkoutForm = document.getElementById('checkout-order-form');
    const reviewForm = document.getElementById('submit-review-form');

    // Load Dynamic Settings (e.g. Announcement banner & phone)
    loadRestaurantSettings();

    // Render initial sections
    renderMenu();
    updateCartUI();
    renderReviews();

    // =========================================================================
    // RESTAURANT SETTINGS SYNC
    // =========================================================================
    function loadRestaurantSettings() {
        const settings = RoofYardDB.getSettings();
        const bannerEl = document.getElementById('announcement-banner-text');
        if (bannerEl && settings.announcement) {
            bannerEl.textContent = settings.announcement;
        }
        const phoneEl = document.getElementById('header-phone-link');
        if (phoneEl && settings.phone) {
            phoneEl.textContent = settings.phone;
            phoneEl.href = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
        }
    }

    // =========================================================================
    // MENU RENDERING & FILTERS
    // =========================================================================
    function renderMenu() {
        if (!menuContainer) return;
        const allItems = RoofYardDB.getMenu();

        // Filter by category
        let filtered = allItems;
        if (currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCategory);
        }

        // Filter by dietary
        if (currentDietary !== 'all') {
            filtered = filtered.filter(item => item.dietary === currentDietary);
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            menuContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fa-solid fa-utensils" style="font-size: 2.5rem; color: var(--gold-dark); margin-bottom: 12px; display: block;"></i>
                    <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 6px;">No dishes found</h3>
                    <p>Try searching for a different item or category.</p>
                </div>
            `;
            return;
        }

        menuContainer.innerHTML = filtered.map(item => {
            const isVeg = item.dietary === 'veg';
            const dietaryDotClass = isVeg ? 'dot-veg' : 'dot-nonveg';
            const dietaryTitle = isVeg ? 'Vegetarian' : 'Non-Vegetarian';
            const badgeHtml = item.badge ? `<span class="menu-badge">${escapeHtml(item.badge)}</span>` : '';
            
            const btnHtml = item.isAvailable 
                ? `<button class="add-cart-btn" onclick="RoofYardApp.addToCart('${item.id}')">
                     <i class="fa-solid fa-plus"></i> Add
                   </button>`
                : `<span class="out-of-stock-pill">Sold Out</span>`;

            return `
                <div class="menu-card" data-id="${item.id}">
                    <div class="menu-img-wrap">
                        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80'">
                        ${badgeHtml}
                        <div class="menu-dietary-icon" title="${dietaryTitle}">
                            <span class="dietary-dot ${dietaryDotClass}"></span>
                        </div>
                    </div>
                    <div class="menu-details">
                        <div class="menu-card-header">
                            <h3 class="menu-title">${escapeHtml(item.name)}</h3>
                            <span class="menu-price">Rs. ${item.price.toLocaleString()}</span>
                        </div>
                        <p class="menu-desc">${escapeHtml(item.description)}</p>
                        <div class="menu-card-footer">
                            <div class="menu-rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${item.rating || 4.9}</span>
                            </div>
                            ${btnHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Category button clicks
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderMenu();
        });
    });

    // Dietary filter clicks
    dietaryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dietaryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDietary = btn.getAttribute('data-dietary');
            renderMenu();
        });
    });

    // Search bar input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderMenu();
        });
    }

    // =========================================================================
    // SHOPPING CART SYSTEM
    // =========================================================================
    function saveCart() {
        localStorage.setItem('roofyard_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        if (!cartList) return;

        if (cart.length === 0) {
            cartList.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <h4>Your Tray is Empty</h4>
                    <p style="font-size: 0.85rem; margin-top: 6px;">Select delicious rooftop delicacies from our menu to begin.</p>
                </div>
            `;
            if (cartSubtotalEl) cartSubtotalEl.textContent = 'Rs. 0';
            if (cartTaxEl) cartTaxEl.textContent = 'Rs. 0';
            if (cartTotalEl) cartTotalEl.textContent = 'Rs. 0';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        cartList.innerHTML = cart.map(item => `
            <div class="cart-item-card">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapeHtml(item.name)}</div>
                    <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
                    <div class="cart-qty-ctrls">
                        <button class="qty-btn" onclick="RoofYardApp.changeCartQty('${item.id}', -1)">-</button>
                        <span class="cart-qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="RoofYardApp.changeCartQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-remove-item" onclick="RoofYardApp.removeCartItem('${item.id}')" title="Remove">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = Math.round(subtotal * 0.10); // 10% tax / service
        const total = subtotal + tax;

        if (cartSubtotalEl) cartSubtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
        if (cartTaxEl) cartTaxEl.textContent = `Rs. ${tax.toLocaleString()}`;
        if (cartTotalEl) cartTotalEl.textContent = `Rs. ${total.toLocaleString()}`;
    }

    // Toggle Drawer
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }

    function closeCart() {
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
    }

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // =========================================================================
    // CHECKOUT & ORDER SUBMISSION
    // =========================================================================
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            closeCart();
            openModal(checkoutModal);
            
            // Populate summary in checkout modal
            const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const total = subtotal + Math.round(subtotal * 0.10);
            const summaryEl = document.getElementById('modal-checkout-summary');
            if (summaryEl) {
                summaryEl.innerHTML = `
                    <div style="background: rgba(255,255,255,0.04); padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size: 0.9rem;">
                            <span>Total Items:</span>
                            <span style="font-weight:600; color:var(--text-primary);">${cart.reduce((s,i) => s + i.qty, 0)} items</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size: 1rem; font-weight: 700; color:var(--gold-light);">
                            <span>Grand Total:</span>
                            <span>Rs. ${total.toLocaleString()}</span>
                        </div>
                    </div>
                `;
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerName = document.getElementById('order-cust-name').value.trim();
            const customerPhone = document.getElementById('order-cust-phone').value.trim();
            const orderType = document.getElementById('order-type-select').value;
            const tableOrAddress = document.getElementById('order-table-note').value.trim();

            if (!customerName || !customerPhone) {
                showToast('Please provide your name and phone number.', 'error');
                return;
            }

            const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const tax = Math.round(subtotal * 0.10);
            const total = subtotal + tax;

            const newOrder = {
                customerName,
                phone: customerPhone,
                items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
                subtotal,
                tax,
                total,
                type: orderType,
                tableNo: tableOrAddress || (orderType === 'dine-in' ? 'Rooftop Table' : 'Takeaway Counter')
            };

            const createdOrder = RoofYardDB.addOrder(newOrder);

            // Clear cart
            cart = [];
            saveCart();
            closeModal(checkoutModal);
            checkoutForm.reset();

            // Show confirmation
            showToast(`Order Placed! Order ID: ${createdOrder.id}`, 'success');

            // Show custom alert modal
            alert(`🎉 Thank you, ${createdOrder.customerName}!\n\nYour order (${createdOrder.id}) has been sent directly to the Roof Yard Kitchen!\nTotal: Rs. ${createdOrder.total.toLocaleString()}\nWe are preparing your culinary experience with utmost care.`);
        });
    }

    // =========================================================================
    // TABLE RESERVATION FORM
    // =========================================================================
    if (reservationForm) {
        // Set min date to today
        const dateInput = document.getElementById('res-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.value = today;
        }

        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('res-name').value.trim();
            const phone = document.getElementById('res-phone').value.trim();
            const email = document.getElementById('res-email').value.trim();
            const guests = parseInt(document.getElementById('res-guests').value, 10);
            const date = document.getElementById('res-date').value;
            const time = document.getElementById('res-time').value;
            const area = document.getElementById('res-area').value;
            const occasion = document.getElementById('res-occasion').value;
            const notes = document.getElementById('res-notes').value.trim();

            if (!name || !phone || !date || !time) {
                showToast('Please fill all required reservation fields.', 'error');
                return;
            }

            const newBooking = RoofYardDB.addReservation({
                name,
                phone,
                email,
                guests,
                date,
                time,
                area,
                occasion,
                notes
            });

            // Display success modal
            const bookingIdEl = document.getElementById('success-booking-id');
            const bookingDetailsEl = document.getElementById('success-booking-details');
            if (bookingIdEl) bookingIdEl.textContent = newBooking.id;
            if (bookingDetailsEl) {
                bookingDetailsEl.innerHTML = `
                    <strong>Guest:</strong> ${escapeHtml(name)} (${guests} Guests)<br>
                    <strong>Date & Time:</strong> ${date} at ${time}<br>
                    <strong>Seating:</strong> ${escapeHtml(area)}
                `;
            }

            openModal(reservationModal);
            reservationForm.reset();
            showToast('Table reservation submitted successfully!', 'success');
        });
    }

    // =========================================================================
    // REVIEWS & TESTIMONIALS
    // =========================================================================
    function renderReviews() {
        const reviewsContainer = document.getElementById('reviews-container-grid');
        if (!reviewsContainer) return;

        const reviews = RoofYardDB.getReviews();
        reviewsContainer.innerHTML = reviews.map(rev => {
            const starsHtml = Array.from({ length: rev.rating || 5 })
                .map(() => '<i class="fa-solid fa-star"></i>')
                .join('');
            const avatarUrl = rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

            return `
                <div class="review-card">
                    <div>
                        <div class="review-header">
                            <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(rev.name)}" class="review-avatar">
                            <div class="reviewer-meta">
                                <h4>${escapeHtml(rev.name)}</h4>
                                <span>${escapeHtml(rev.tag || 'Verified Guest')}</span>
                            </div>
                        </div>
                        <div class="review-stars">${starsHtml}</div>
                        <p class="review-text">"${escapeHtml(rev.comment)}"</p>
                    </div>
                    <div class="review-date">${escapeHtml(rev.date || 'Recent')}</div>
                </div>
            `;
        }).join('');
    }

    // Submit Review Form
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-author-name').value.trim();
            const rating = parseInt(document.getElementById('review-rating-val').value, 10);
            const comment = document.getElementById('review-comment-text').value.trim();

            if (!name || !comment) {
                showToast('Please provide your name and review message.', 'error');
                return;
            }

            RoofYardDB.addReview({
                name,
                rating,
                comment,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            });

            closeModal(reviewModal);
            reviewForm.reset();
            renderReviews();
            showToast('Thank you for sharing your experience!', 'success');
        });
    }

    // =========================================================================
    // MODAL HELPERS & GENERAL INTERACTION
    // =========================================================================
    function openModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    document.querySelectorAll('.modal-close, .modal-close-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('primary-nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // Sticky Navbar blur on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('main-navbar');
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Seating Card Quick Selection
    document.querySelectorAll('.seating-card').forEach(card => {
        card.addEventListener('click', () => {
            const areaName = card.getAttribute('data-area');
            const areaSelect = document.getElementById('res-area');
            if (areaSelect && areaName) {
                areaSelect.value = areaName;
                showToast(`Selected "${areaName}" for your reservation!`, 'info');
                document.getElementById('table-reservation-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Toast Notifications
    function showToast(message, type = 'info') {
        let container = document.getElementById('toast-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-notification-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const iconMap = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i>
            <span>${escapeHtml(message)}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Helper: Escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Export Globally for inline handlers
    window.RoofYardApp = {
        addToCart(itemId) {
            const menu = RoofYardDB.getMenu();
            const item = menu.find(i => i.id === itemId);
            if (!item) return;

            const existing = cart.find(i => i.id === itemId);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    qty: 1
                });
            }
            saveCart();
            showToast(`Added "${item.name}" to tray!`, 'success');
        },
        changeCartQty(itemId, delta) {
            const index = cart.findIndex(i => i.id === itemId);
            if (index > -1) {
                cart[index].qty += delta;
                if (cart[index].qty <= 0) {
                    cart.splice(index, 1);
                }
                saveCart();
            }
        },
        removeCartItem(itemId) {
            cart = cart.filter(i => i.id !== itemId);
            saveCart();
            showToast('Item removed from tray.', 'info');
        },
        openReviewModal() {
            openModal(reviewModal);
        },
        openCart() {
            if (cartDrawer) cartDrawer.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        }
    };
});
