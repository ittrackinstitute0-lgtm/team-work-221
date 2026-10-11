/**
 * Roof Yard - Admin Management Dashboard Logic
 * Integrates directly with RoofYardDB (LocalStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Authentication State
    const loginWrapper = document.getElementById('login-screen');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout-btn');

    // Navigation & Tabs
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mobileMenuToggle = document.getElementById('admin-mobile-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Modals
    const addDishModal = document.getElementById('add-dish-modal');
    const editDishModal = document.getElementById('edit-dish-modal');
    const orderDetailModal = document.getElementById('order-detail-modal');

    // Forms
    const addDishForm = document.getElementById('add-dish-form');
    const editDishForm = document.getElementById('edit-dish-form');
    const settingsForm = document.getElementById('restaurant-settings-form');

    // Filter & Search states
    let resFilter = 'all';
    let resSearch = '';
    let menuCategoryFilter = 'all';
    let menuSearch = '';
    let orderFilter = 'all';

    // =========================================================================
    // AUTHENTICATION LOGIC
    // =========================================================================
    function checkAuth() {
        const isAuth = localStorage.getItem('roofyard_admin_auth');
        if (isAuth === 'true') {
            if (loginWrapper) loginWrapper.style.display = 'none';
            initDashboard();
        } else {
            if (loginWrapper) loginWrapper.style.display = 'flex';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value.trim();

            // Default credentials or demo credentials
            if ((email === 'admin@roofyard.com' && pass === 'admin123') || (email === 'admin' && pass === '1234')) {
                localStorage.setItem('roofyard_admin_auth', 'true');
                if (loginWrapper) loginWrapper.style.display = 'none';
                initDashboard();
                showAdminToast('Welcome back, Roof Yard Manager!', 'success');
            } else {
                showAdminToast('Invalid email or password. Use: admin@roofyard.com / admin123', 'error');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out of the Roof Yard Admin Panel?')) {
                localStorage.removeItem('roofyard_admin_auth');
                if (loginWrapper) loginWrapper.style.display = 'flex';
                showAdminToast('Logged out successfully.', 'info');
            }
        });
    }

    // =========================================================================
    // DASHBOARD INITIALIZATION
    // =========================================================================
    function initDashboard() {
        updateStatsMetrics();
        renderReservationsTable();
        renderMenuTable();
        renderOrdersTable();
        renderReviewsList();
        loadSettingsForm();
    }

    // Tab Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            if (!tabId) return;

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `tab-${tabId}`) {
                    pane.classList.add('active');
                }
            });

            // Update topbar title
            const topbarTitle = document.getElementById('active-tab-title');
            if (topbarTitle) {
                topbarTitle.textContent = item.querySelector('span').textContent;
            }

            // Close mobile sidebar if open
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        });
    });

    // Mobile Sidebar toggle
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // =========================================================================
    // METRICS & KPIS
    // =========================================================================
    function updateStatsMetrics() {
        const reservations = RoofYardDB.getReservations();
        const orders = RoofYardDB.getOrders();
        const menu = RoofYardDB.getMenu();
        const reviews = RoofYardDB.getReviews();

        // Pending Reservations
        const pendingCount = reservations.filter(r => r.status === 'pending').length;
        const totalBookingsEl = document.getElementById('stat-total-bookings');
        const pendingBadgeEl = document.getElementById('stat-pending-badge');
        const sidebarResBadge = document.getElementById('sidebar-res-count');

        if (totalBookingsEl) totalBookingsEl.textContent = reservations.length;
        if (pendingBadgeEl) pendingBadgeEl.textContent = `${pendingCount} Pending`;
        if (sidebarResBadge) {
            sidebarResBadge.textContent = pendingCount;
            sidebarResBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        }

        // Orders & Revenue
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalOrdersEl = document.getElementById('stat-total-orders');
        const totalRevenueEl = document.getElementById('stat-total-revenue');
        if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
        if (totalRevenueEl) totalRevenueEl.textContent = `Rs. ${totalRevenue.toLocaleString()}`;

        // Menu items
        const inStockCount = menu.filter(m => m.isAvailable).length;
        const totalMenuEl = document.getElementById('stat-total-menu');
        if (totalMenuEl) totalMenuEl.textContent = `${inStockCount} / ${menu.length} Active`;

        // Reviews Rating
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '5.0';
        const avgRatingEl = document.getElementById('stat-avg-rating');
        if (avgRatingEl) avgRatingEl.textContent = `${avgRating} ★ (${reviews.length})`;

        // Populate Dashboard Overview Recent Tables
        renderOverviewRecentTables(reservations, orders);
    }

    function renderOverviewRecentTables(reservations, orders) {
        const recentResEl = document.getElementById('overview-recent-reservations');
        if (recentResEl) {
            const recents = reservations.slice(0, 4);
            if (recents.length === 0) {
                recentResEl.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No bookings yet</td></tr>`;
            } else {
                recentResEl.innerHTML = recents.map(r => `
                    <tr>
                        <td><strong>${escapeHtml(r.id)}</strong></td>
                        <td>${escapeHtml(r.name)}</td>
                        <td>${escapeHtml(r.date)} at ${escapeHtml(r.time)}</td>
                        <td><span class="badge-status badge-${r.status}">${escapeHtml(r.status)}</span></td>
                        <td>
                            <div class="table-actions">
                                ${r.status === 'pending' ? `
                                    <button class="action-icon-btn confirm" title="Confirm" onclick="AdminApp.updateResStatus('${r.id}', 'confirmed')"><i class="fa-solid fa-check"></i></button>
                                ` : ''}
                                <button class="action-icon-btn whatsapp" title="WhatsApp Guest" onclick="AdminApp.whatsappGuest('${r.phone}', '${r.name}')"><i class="fa-brands fa-whatsapp"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    // =========================================================================
    // RESERVATIONS MANAGEMENT
    // =========================================================================
    function renderReservationsTable() {
        const tableBody = document.getElementById('reservations-table-body');
        if (!tableBody) return;

        let list = RoofYardDB.getReservations();

        // Filter status
        if (resFilter !== 'all') {
            list = list.filter(r => r.status === resFilter);
        }

        // Filter search
        if (resSearch.trim() !== '') {
            const q = resSearch.toLowerCase().trim();
            list = list.filter(r => 
                r.name.toLowerCase().includes(q) || 
                r.phone.includes(q) || 
                r.id.toLowerCase().includes(q)
            );
        }

        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No reservations found matching filter.</td></tr>`;
            return;
        }

        tableBody.innerHTML = list.map(r => {
            const cleanPhone = r.phone.replace(/[^0-9+]/g, '');
            return `
                <tr>
                    <td><strong style="color: var(--gold-light);">${escapeHtml(r.id)}</strong></td>
                    <td>
                        <div style="font-weight: 600; color: #fff;">${escapeHtml(r.name)}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(r.phone)}</div>
                    </td>
                    <td>
                        <div><i class="fa-regular fa-calendar"></i> ${escapeHtml(r.date)}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${escapeHtml(r.time)}</div>
                    </td>
                    <td>
                        <div><i class="fa-solid fa-users"></i> ${r.guests} Guests</div>
                        <div style="font-size: 0.78rem; color: var(--gold-primary);">${escapeHtml(r.area)}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.85rem;">${escapeHtml(r.occasion || 'Dining')}</div>
                        ${r.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted); max-width: 180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(r.notes)}">${escapeHtml(r.notes)}</div>` : ''}
                    </td>
                    <td><span class="badge-status badge-${r.status}">${escapeHtml(r.status)}</span></td>
                    <td>
                        <div class="table-actions">
                            ${r.status === 'pending' ? `
                                <button class="action-icon-btn confirm" title="Approve & Confirm" onclick="AdminApp.updateResStatus('${r.id}', 'confirmed')">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            ` : ''}
                            ${r.status !== 'cancelled' ? `
                                <button class="action-icon-btn cancel" title="Mark Cancelled" onclick="AdminApp.updateResStatus('${r.id}', 'cancelled')">
                                    <i class="fa-solid fa-ban"></i>
                                </button>
                            ` : ''}
                            <button class="action-icon-btn whatsapp" title="Message on WhatsApp" onclick="AdminApp.whatsappGuest('${cleanPhone}', '${escapeHtml(r.name)}')">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <button class="action-icon-btn delete" title="Delete record" onclick="AdminApp.deleteReservation('${r.id}')">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Reservation Filters & Search
    document.querySelectorAll('.res-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.res-filter-btn').forEach(b => b.classList.remove('btn-adm-gold'));
            document.querySelectorAll('.res-filter-btn').forEach(b => b.classList.add('btn-adm-secondary'));
            btn.classList.remove('btn-adm-secondary');
            btn.classList.add('btn-adm-gold');
            resFilter = btn.getAttribute('data-status');
            renderReservationsTable();
        });
    });

    const resSearchInput = document.getElementById('res-search-input');
    if (resSearchInput) {
        resSearchInput.addEventListener('input', (e) => {
            resSearch = e.target.value;
            renderReservationsTable();
        });
    }

    // =========================================================================
    // MENU CRUD MANAGEMENT
    // =========================================================================
    function renderMenuTable() {
        const tableBody = document.getElementById('menu-table-body');
        if (!tableBody) return;

        let items = RoofYardDB.getMenu();

        if (menuCategoryFilter !== 'all') {
            items = items.filter(i => i.category === menuCategoryFilter);
        }

        if (menuSearch.trim() !== '') {
            const q = menuSearch.toLowerCase().trim();
            items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
        }

        if (items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No menu items found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = items.map(item => `
            <tr>
                <td>
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover; border: 1px solid var(--adm-border);" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80'">
                </td>
                <td>
                    <div style="font-weight: 600; color: #fff;">${escapeHtml(item.name)}</div>
                    ${item.badge ? `<span style="font-size: 0.7rem; color: var(--gold-primary); text-transform:uppercase;">${escapeHtml(item.badge)}</span>` : ''}
                </td>
                <td><span style="text-transform: capitalize;">${escapeHtml(item.category)}</span></td>
                <td><strong>Rs. ${item.price.toLocaleString()}</strong></td>
                <td>
                    <span class="badge-status ${item.dietary === 'veg' ? 'badge-confirmed' : 'badge-soldout'}">
                        ${item.dietary === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                    </span>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${item.isAvailable ? 'checked' : ''} onchange="AdminApp.toggleDishStatus('${item.id}')">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-icon-btn" title="Edit Dish" onclick="AdminApp.openEditDish('${item.id}')">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="action-icon-btn delete" title="Delete Dish" onclick="AdminApp.deleteDish('${item.id}')">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Menu category filter
    const menuCategorySelect = document.getElementById('menu-cat-filter');
    if (menuCategorySelect) {
        menuCategorySelect.addEventListener('change', (e) => {
            menuCategoryFilter = e.target.value;
            renderMenuTable();
        });
    }

    const menuSearchInput = document.getElementById('menu-admin-search');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            menuSearch = e.target.value;
            renderMenuTable();
        });
    }

    // Add Dish Form Submit
    if (addDishForm) {
        addDishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('add-dish-name').value.trim();
            const category = document.getElementById('add-dish-cat').value;
            const price = parseFloat(document.getElementById('add-dish-price').value);
            const dietary = document.getElementById('add-dish-dietary').value;
            const badge = document.getElementById('add-dish-badge').value.trim();
            const image = document.getElementById('add-dish-img').value.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80';
            const description = document.getElementById('add-dish-desc').value.trim();

            if (!name || !price) {
                showAdminToast('Please fill all required dish fields.', 'error');
                return;
            }

            RoofYardDB.addMenuItem({
                name,
                category,
                price,
                dietary,
                badge,
                image,
                description,
                isAvailable: true,
                rating: 5.0
            });

            closeAdminModal(addDishModal);
            addDishForm.reset();
            renderMenuTable();
            updateStatsMetrics();
            showAdminToast(`"${name}" added successfully to Roof Yard menu!`, 'success');
        });
    }

    // Edit Dish Form Submit
    if (editDishForm) {
        editDishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-dish-id').value;
            const name = document.getElementById('edit-dish-name').value.trim();
            const category = document.getElementById('edit-dish-cat').value;
            const price = parseFloat(document.getElementById('edit-dish-price').value);
            const dietary = document.getElementById('edit-dish-dietary').value;
            const badge = document.getElementById('edit-dish-badge').value.trim();
            const image = document.getElementById('edit-dish-img').value.trim();
            const description = document.getElementById('edit-dish-desc').value.trim();

            RoofYardDB.updateMenuItem({
                id,
                name,
                category,
                price,
                dietary,
                badge,
                image,
                description
            });

            closeAdminModal(editDishModal);
            renderMenuTable();
            updateStatsMetrics();
            showAdminToast(`Updated "${name}" details!`, 'success');
        });
    }

    // =========================================================================
    // ORDERS MANAGEMENT
    // =========================================================================
    function renderOrdersTable() {
        const tableBody = document.getElementById('orders-table-body');
        if (!tableBody) return;

        let orders = RoofYardDB.getOrders();

        if (orderFilter !== 'all') {
            orders = orders.filter(o => o.status === orderFilter);
        }

        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No orders in this status.</td></tr>`;
            return;
        }

        tableBody.innerHTML = orders.map(ord => {
            const itemsSummary = (ord.items || []).map(i => `${i.qty}x ${escapeHtml(i.name)}`).join(', ');
            return `
                <tr>
                    <td><strong style="color: var(--gold-light);">${escapeHtml(ord.id)}</strong></td>
                    <td>
                        <div style="font-weight: 600; color: #fff;">${escapeHtml(ord.customerName)}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(ord.phone)}</div>
                    </td>
                    <td>
                        <span style="text-transform: capitalize; font-weight: 600;">${escapeHtml(ord.type)}</span>
                        ${ord.tableNo ? `<div style="font-size: 0.75rem; color: var(--gold-primary);">${escapeHtml(ord.tableNo)}</div>` : ''}
                    </td>
                    <td style="max-width: 250px;">
                        <div style="font-size: 0.85rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">
                            ${itemsSummary}
                        </div>
                    </td>
                    <td><strong>Rs. ${ord.total.toLocaleString()}</strong></td>
                    <td>
                        <select onchange="AdminApp.changeOrderStatus('${ord.id}', this.value)" style="padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--adm-border); border-radius: 6px; color: #fff; font-size: 0.8rem;">
                            <option value="received" ${ord.status === 'received' ? 'selected' : ''}>Received</option>
                            <option value="preparing" ${ord.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                            <option value="ready" ${ord.status === 'ready' ? 'selected' : ''}>Ready</option>
                            <option value="completed" ${ord.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </td>
                    <td>
                        <button class="action-icon-btn" title="View Bill & Details" onclick="AdminApp.viewOrderBill('${ord.id}')">
                            <i class="fa-solid fa-receipt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Order status filter buttons
    document.querySelectorAll('.order-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('btn-adm-gold'));
            document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.add('btn-adm-secondary'));
            btn.classList.remove('btn-adm-secondary');
            btn.classList.add('btn-adm-gold');
            orderFilter = btn.getAttribute('data-status');
            renderOrdersTable();
        });
    });

    // =========================================================================
    // CUSTOMER REVIEWS MANAGEMENT
    // =========================================================================
    function renderReviewsList() {
        const container = document.getElementById('admin-reviews-table-body');
        if (!container) return;

        const reviews = RoofYardDB.getReviews();

        if (reviews.length === 0) {
            container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No reviews found.</td></tr>`;
            return;
        }

        container.innerHTML = reviews.map(rev => `
            <tr>
                <td><strong>${escapeHtml(rev.name)}</strong></td>
                <td><span style="color: var(--gold-primary);">${'★'.repeat(rev.rating)}</span> (${rev.rating}/5)</td>
                <td style="max-width: 320px;">"${escapeHtml(rev.comment)}"</td>
                <td>${escapeHtml(rev.date || 'Recent')}</td>
                <td>
                    <button class="action-icon-btn delete" title="Delete Review" onclick="AdminApp.deleteReview('${rev.id}')">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // =========================================================================
    // RESTAURANT SETTINGS
    // =========================================================================
    function loadSettingsForm() {
        if (!settingsForm) return;
        const settings = RoofYardDB.getSettings();

        document.getElementById('set-restaurant-name').value = settings.restaurantName || 'Roof Yard';
        document.getElementById('set-tagline').value = settings.tagline || '';
        document.getElementById('set-phone').value = settings.phone || '';
        document.getElementById('set-email').value = settings.email || '';
        document.getElementById('set-hours').value = settings.openHours || '';
        document.getElementById('set-address').value = settings.address || '';
        document.getElementById('set-announcement').value = settings.announcement || '';
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const current = RoofYardDB.getSettings();
            const updated = {
                ...current,
                restaurantName: document.getElementById('set-restaurant-name').value.trim(),
                tagline: document.getElementById('set-tagline').value.trim(),
                phone: document.getElementById('set-phone').value.trim(),
                email: document.getElementById('set-email').value.trim(),
                openHours: document.getElementById('set-hours').value.trim(),
                address: document.getElementById('set-address').value.trim(),
                announcement: document.getElementById('set-announcement').value.trim()
            };
            RoofYardDB.setSettings(updated);
            showAdminToast('Restaurant settings updated and live on customer website!', 'success');
        });
    }

    // =========================================================================
    // MODAL CONTROLS & UTILS
    // =========================================================================
    function openAdminModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeAdminModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    document.querySelectorAll('.adm-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.adm-modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    document.querySelectorAll('.adm-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    function showAdminToast(msg, type = 'info') {
        let container = document.getElementById('adm-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'adm-toast-container';
            container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column; gap:10px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const color = type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#d4af37';
        toast.style.cssText = `background:#151b26; border:1px solid ${color}; padding:12px 20px; border-radius:10px; color:#fff; font-size:0.88rem; box-shadow:0 10px 30px rgba(0,0,0,0.5); display:flex; align-items:center; gap:10px;`;
        toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:${color};"></i> <span>${escapeHtml(msg)}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Export Global API
    window.AdminApp = {
        updateResStatus(id, newStatus) {
            RoofYardDB.updateReservationStatus(id, newStatus);
            renderReservationsTable();
            updateStatsMetrics();
            showAdminToast(`Reservation ${id} marked as ${newStatus}!`, 'success');
        },
        deleteReservation(id) {
            if (confirm(`Are you sure you want to delete reservation ${id}?`)) {
                RoofYardDB.deleteReservation(id);
                renderReservationsTable();
                updateStatsMetrics();
                showAdminToast(`Reservation ${id} deleted.`, 'info');
            }
        },
        whatsappGuest(phone, name) {
            const clean = phone.replace(/[^0-9]/g, '');
            const message = encodeURIComponent(`Hello ${name}! ✨ This is Roof Yard Restaurant reaching out regarding your rooftop dining reservation. We are delighted to host you!`);
            window.open(`https://wa.me/${clean}?text=${message}`, '_blank');
        },
        toggleDishStatus(id) {
            RoofYardDB.toggleMenuItemStatus(id);
            renderMenuTable();
            updateStatsMetrics();
            showAdminToast('Dish availability status toggled live!', 'info');
        },
        openAddDishModal() {
            openAdminModal(addDishModal);
        },
        openEditDish(id) {
            const menu = RoofYardDB.getMenu();
            const item = menu.find(i => i.id === id);
            if (!item) return;

            document.getElementById('edit-dish-id').value = item.id;
            document.getElementById('edit-dish-name').value = item.name;
            document.getElementById('edit-dish-cat').value = item.category;
            document.getElementById('edit-dish-price').value = item.price;
            document.getElementById('edit-dish-dietary').value = item.dietary || 'veg';
            document.getElementById('edit-dish-badge').value = item.badge || '';
            document.getElementById('edit-dish-img').value = item.image;
            document.getElementById('edit-dish-desc').value = item.description;

            openAdminModal(editDishModal);
        },
        deleteDish(id) {
            if (confirm('Are you sure you want to delete this menu dish permanently?')) {
                RoofYardDB.deleteMenuItem(id);
                renderMenuTable();
                updateStatsMetrics();
                showAdminToast('Dish removed from menu.', 'info');
            }
        },
        changeOrderStatus(id, newStatus) {
            RoofYardDB.updateOrderStatus(id, newStatus);
            renderOrdersTable();
            updateStatsMetrics();
            showAdminToast(`Order ${id} marked as ${newStatus}.`, 'success');
        },
        viewOrderBill(id) {
            const orders = RoofYardDB.getOrders();
            const ord = orders.find(o => o.id === id);
            if (!ord) return;

            const billContainer = document.getElementById('order-bill-content');
            if (billContainer) {
                billContainer.innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px dashed var(--adm-border); padding-bottom: 16px;">
                        <h4 style="font-family: var(--font-heading); color: var(--gold-light); font-size: 1.4rem;">Roof Yard Rooftop Dining</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Boulevard Skyview Tower, Lahore</p>
                        <h5 style="margin-top: 8px; color: #fff;">Order Token: ${ord.id}</h5>
                    </div>
                    <div style="font-size: 0.85rem; margin-bottom: 16px; line-height: 1.6;">
                        <div><strong>Customer:</strong> ${escapeHtml(ord.customerName)} (${escapeHtml(ord.phone)})</div>
                        <div><strong>Dining Type:</strong> ${escapeHtml(ord.type)} ${ord.tableNo ? `(${escapeHtml(ord.tableNo)})` : ''}</div>
                        <div><strong>Status:</strong> <span class="badge-status badge-${ord.status}">${escapeHtml(ord.status)}</span></div>
                    </div>
                    <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 16px;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--adm-border); text-align: left;">
                                <th style="padding: 6px 0;">Item</th>
                                <th style="padding: 6px 0; text-align: center;">Qty</th>
                                <th style="padding: 6px 0; text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(ord.items || []).map(i => `
                                <tr>
                                    <td style="padding: 8px 0;">${escapeHtml(i.name)}</td>
                                    <td style="padding: 8px 0; text-align: center;">${i.qty}</td>
                                    <td style="padding: 8px 0; text-align: right;">Rs. ${(i.price * i.qty).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="border-top: 1px dashed var(--adm-border); padding-top: 12px; font-size: 0.9rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>Subtotal:</span>
                            <span>Rs. ${(ord.subtotal || 0).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>Tax (10%):</span>
                            <span>Rs. ${(ord.tax || 0).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; color: var(--gold-light);">
                            <span>Total Payable:</span>
                            <span>Rs. ${(ord.total || 0).toLocaleString()}</span>
                        </div>
                    </div>
                `;
            }
            openAdminModal(orderDetailModal);
        },
        deleteReview(id) {
            if (confirm('Delete this customer review?')) {
                RoofYardDB.deleteReview(id);
                renderReviewsList();
                updateStatsMetrics();
                showAdminToast('Review removed.', 'info');
            }
        },
        resetAllDemoData() {
            if (confirm('Reset all Roof Yard database to initial default demo data?')) {
                RoofYardDB.resetDemoData();
                initDashboard();
                showAdminToast('Database reset to fresh demo state.', 'success');
            }
        }
    };

    // Check auth on load
    checkAuth();
});
