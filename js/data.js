/**
 * Roof Yard - Central Data Store & LocalStorage Manager
 * Handles Menu Items, Table Reservations, Orders, Reviews, and Restaurant Settings.
 */

const STORAGE_KEYS = {
    MENU: 'roofyard_menu_v1',
    RESERVATIONS: 'roofyard_reservations_v1',
    ORDERS: 'roofyard_orders_v1',
    REVIEWS: 'roofyard_reviews_v1',
    SETTINGS: 'roofyard_settings_v1',
    AUTH: 'roofyard_admin_auth'
};

// Initial Pre-seeded Menu for Roof Yard Aesthetic Dining
const DEFAULT_MENU = [
    {
        id: 'item-1',
        name: 'Truffle Parmesan Artisan Fries',
        category: 'starters',
        price: 850,
        dietary: 'veg',
        badge: 'Popular',
        description: 'Crispy hand-cut russet potatoes tossed with black truffle oil, freshly grated aged parmesan, and micro parsley served with roasted garlic aioli.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    },
    {
        id: 'item-2',
        name: 'Burrata Di Puglia & Heirloom Medley',
        category: 'starters',
        price: 1650,
        dietary: 'veg',
        badge: "Chef's Pick",
        description: 'Imported artisanal burrata pouch, sweet heirloom cherry tomatoes, cold-pressed olive oil, basil reduction, balsamic caviar, and charred sourdough crisps.',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.8
    },
    {
        id: 'item-3',
        name: 'Crispy Calamari with Citrus Aioli',
        category: 'starters',
        price: 1450,
        dietary: 'non-veg',
        badge: '',
        description: 'Tender baby squid dusted with spiced semolina and sea salt, quick-fried golden, served with grilled Meyer lemon and smoked chili citrus mayo.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.7
    },
    {
        id: 'item-4',
        name: 'Smoked Wild Truffle & Wild Mushroom Pizza',
        category: 'pizza',
        price: 2150,
        dietary: 'veg',
        badge: 'Bestseller',
        description: '72-hour fermented sourdough crust, creamy fontina & smoked scamorza, roasted foraged mushrooms, thyme, white truffle cream drizzle, and fresh rocket leaves.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 5.0
    },
    {
        id: 'item-5',
        name: 'Artisanal Spicy Pepperoni Rustica',
        category: 'pizza',
        price: 2350,
        dietary: 'non-veg',
        badge: 'Must Try',
        description: 'Woodfired thin crust, San Marzano tomato sauce, imported beef pepperoni crisps, creamy mozzarella, hot honey drizzle, and fresh oregano leaves.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    },
    {
        id: 'item-6',
        name: 'Margherita Fior Di Latte',
        category: 'pizza',
        price: 1750,
        dietary: 'veg',
        badge: 'Classic',
        description: 'Neapolitan style wood-fired pizza with San Marzano tomatoes, fresh cow milk Fior Di Latte mozzarella, fresh basil, and extra virgin Tuscan olive oil.',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.8
    },
    {
        id: 'item-7',
        name: 'Charred Australian Ribeye Steak',
        category: 'grill',
        price: 3850,
        dietary: 'non-veg',
        badge: 'Signature',
        description: '300g Prime grass-fed ribeye flame-grilled over fruitwood embers, accompanied by roasted bone marrow butter, garlic mashed potatoes, and green peppercorn jus.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 5.0
    },
    {
        id: 'item-8',
        name: 'Norwegian Herb-Crusted Grilled Salmon',
        category: 'grill',
        price: 3450,
        dietary: 'non-veg',
        badge: "Chef's Special",
        description: 'Pan-seared Atlantic salmon fillet with dill and pistachios crust, served over velvety saffron cauliflower puree, charred asparagus, and lemon caper emulsion.',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    },
    {
        id: 'item-9',
        name: 'Smokey Peri-Peri Jumbo Tiger Prawns',
        category: 'grill',
        price: 2950,
        dietary: 'non-veg',
        badge: 'Spicy',
        description: 'Charred open-flame jumbo king prawns tossed in homemade citrus peri-peri marinade, served with herb-infused jasmine rice and grilled pineapple relish.',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.8
    },
    {
        id: 'item-10',
        name: 'Creamy Black Truffle Fettuccine',
        category: 'mains',
        price: 2250,
        dietary: 'veg',
        badge: 'Popular',
        description: 'Handcrafted fresh egg pasta ribbons tossed in aged Parmigiano-Reggiano emulsion, wild porcini mushrooms, black summer truffle carpaccio, and crushed walnuts.',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    },
    {
        id: 'item-11',
        name: 'Smoked Chimichurri Lamb Chops',
        category: 'grill',
        price: 3600,
        dietary: 'non-veg',
        badge: 'Signature',
        description: 'New Zealand lamb cutlets charcoal grilled to tender perfection, served with authentic Argentine herbaceous chimichurri, spiced baby potatoes, and grilled lemon.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    },
    {
        id: 'item-12',
        name: 'Sunset Skyline Berry Sangria (Zero Proof)',
        category: 'drinks',
        price: 950,
        dietary: 'veg',
        badge: 'Signature',
        description: 'Muddled wild forest blackberries, raspberries, blood orange reduction, infused cold-brew sparkling white tea, garnished with fresh mint & edible orchids.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 5.0
    },
    {
        id: 'item-13',
        name: 'Smoked Rosemary Citrus Sparkler',
        category: 'drinks',
        price: 850,
        dietary: 'veg',
        badge: '',
        description: 'Charred fresh garden rosemary aroma, freshly squeezed grapefruit juice, yuzu tonic, clarified agave nectar, served over hand-carved crystal ice spheres.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.7
    },
    {
        id: 'item-14',
        name: 'Golden Hour Cold Brew Float',
        category: 'drinks',
        price: 900,
        dietary: 'veg',
        badge: '',
        description: '18-hour single origin Ethiopian cold brew coffee topped with Madagascar vanilla bean gelato, salted caramel rim, and 24k edible gold dust flakes.',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.8
    },
    {
        id: 'item-15',
        name: 'Molten Belgian Dark Chocolate Dome',
        category: 'desserts',
        price: 1250,
        dietary: 'veg',
        badge: 'Bestseller',
        description: '70% Valrhona dark chocolate warm lava cake, wild berry compote, crumble soil, and artisanal Madagascar vanilla bean ice cream.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 5.0
    },
    {
        id: 'item-16',
        name: 'Pistachio Saffron Burnt Basque Cheesecake',
        category: 'desserts',
        price: 1150,
        dietary: 'veg',
        badge: "Chef's Secret",
        description: 'Caramelized rustic Spanish burnt cheesecake infused with Bronte pistachio paste, saffron cardamom cream, and crushed Iranian green pistachios.',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80',
        isAvailable: true,
        rating: 4.9
    }
];

// Pre-seeded Reservations
const DEFAULT_RESERVATIONS = [
    {
        id: 'RY-8921',
        name: 'Hamza Khan',
        phone: '+92 300 1234567',
        email: 'hamza.khan@gmail.com',
        guests: 4,
        date: '2026-10-12',
        time: '20:00',
        area: 'Skyline Terrace Deck',
        occasion: 'Birthday Celebration',
        notes: 'Preferred seating near the edge for city lights view and rooftop photo session.',
        status: 'confirmed',
        createdAt: '2026-10-11T10:15:00.000Z'
    },
    {
        id: 'RY-8922',
        name: 'Ayesha Siddiqui',
        phone: '+92 321 9876543',
        email: 'ayesha.s@outlook.com',
        guests: 2,
        date: '2026-10-12',
        time: '19:30',
        area: 'Sunset Cabana VIP',
        occasion: 'Anniversary Dinner',
        notes: 'Candlelight setup with complimentary welcome sparkler drinks please.',
        status: 'pending',
        createdAt: '2026-10-11T11:45:00.000Z'
    },
    {
        id: 'RY-8923',
        name: 'Bilal Farooq',
        phone: '+92 333 4567890',
        email: 'bilal.farooq@corp.com',
        guests: 8,
        date: '2026-10-13',
        time: '21:00',
        area: 'Greenhouse Pergola Lounge',
        occasion: 'Business Dinner',
        notes: 'Quiet ambient corner with round table arrangement.',
        status: 'pending',
        createdAt: '2026-10-11T13:20:00.000Z'
    },
    {
        id: 'RY-8924',
        name: 'Zainab Tariq',
        phone: '+92 345 6789012',
        email: 'zainab.t@gmail.com',
        guests: 3,
        date: '2026-10-11',
        time: '21:30',
        area: 'Fireplace Cozy Corner',
        occasion: 'Casual Dining',
        notes: 'Need one baby chair / high chair.',
        status: 'confirmed',
        createdAt: '2026-10-10T18:00:00.000Z'
    }
];

// Pre-seeded Orders
const DEFAULT_ORDERS = [
    {
        id: 'ORD-5401',
        customerName: 'Zubair Ahmed',
        phone: '+92 312 8899001',
        items: [
            { id: 'item-4', name: 'Smoked Wild Truffle Pizza', price: 2150, qty: 1 },
            { id: 'item-12', name: 'Sunset Skyline Berry Sangria', price: 950, qty: 2 }
        ],
        subtotal: 4050,
        tax: 405,
        total: 4455,
        type: 'dine-in',
        tableNo: 'Table Deck #4',
        status: 'preparing',
        createdAt: '2026-10-11T14:10:00.000Z'
    },
    {
        id: 'ORD-5402',
        customerName: 'Fatima Noor',
        phone: '+92 322 7711223',
        items: [
            { id: 'item-7', name: 'Charred Australian Ribeye Steak', price: 3850, qty: 1 },
            { id: 'item-1', name: 'Truffle Parmesan Artisan Fries', price: 850, qty: 1 },
            { id: 'item-15', name: 'Molten Belgian Chocolate Dome', price: 1250, qty: 1 }
        ],
        subtotal: 5950,
        tax: 595,
        total: 6545,
        type: 'takeaway',
        status: 'ready',
        createdAt: '2026-10-11T13:30:00.000Z'
    }
];

// Pre-seeded Reviews
const DEFAULT_REVIEWS = [
    {
        id: 'rev-1',
        name: 'Sarah Sheikh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Roof Yard is pure magic! The golden hour skyline view combined with their Truffle Sourdough Pizza made our anniversary unforgettable. Ambiance 10/10, live acoustic music was mesmerizing!',
        date: 'October 8, 2026',
        tag: 'Verified Diner'
    },
    {
        id: 'rev-2',
        name: 'Omer Rasheed',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Best rooftop dining in town hands down. The Ribeye steak was charred to absolute perfection with that smoky herb butter. Outstanding hospitality and warm aesthetic decor.',
        date: 'October 5, 2026',
        tag: 'Food Critic'
    },
    {
        id: 'rev-3',
        name: 'Mahnoor Asif',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'The vibes under the fairy lights and open sky are incredible. Do NOT miss their signature Sangria mocktail and the Basque cheesecake. Perfect spot for photography and date nights!',
        date: 'September 29, 2026',
        tag: 'Verified Diner'
    }
];

// Default Restaurant Settings
const DEFAULT_SETTINGS = {
    restaurantName: 'Roof Yard',
    tagline: 'Aesthetic Rooftop Dining & Sunset Lounge',
    address: '7th Floor Rooftop Terrace, Boulevard Skyview Tower, Gulberg III',
    phone: '+92 300 ROOFYARD / +92 300 7663927',
    email: 'reservations@roofyard.com',
    openHours: 'Tuesday - Sunday: 4:30 PM - 2:00 AM (Monday Closed)',
    announcement: '✨ Golden Hour Sunset Session starts 5:30 PM. Live Acoustic Performance this Friday & Saturday!',
    isAcceptingReservations: true,
    currencySymbol: 'Rs. '
};

// Data Layer Object
const RoofYardDB = {
    // Menu Operations
    getMenu() {
        const data = localStorage.getItem(STORAGE_KEYS.MENU);
        if (!data) {
            this.setMenu(DEFAULT_MENU);
            return DEFAULT_MENU;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_MENU;
        }
    },
    setMenu(items) {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    },
    addMenuItem(item) {
        const items = this.getMenu();
        item.id = 'item-' + Date.now();
        items.unshift(item);
        this.setMenu(items);
        return item;
    },
    updateMenuItem(updatedItem) {
        let items = this.getMenu();
        items = items.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item);
        this.setMenu(items);
        return updatedItem;
    },
    deleteMenuItem(id) {
        let items = this.getMenu();
        items = items.filter(item => item.id !== id);
        this.setMenu(items);
    },
    toggleMenuItemStatus(id) {
        let items = this.getMenu();
        items = items.map(item => {
            if (item.id === id) {
                return { ...item, isAvailable: !item.isAvailable };
            }
            return item;
        });
        this.setMenu(items);
    },

    // Reservation Operations
    getReservations() {
        const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
        if (!data) {
            this.setReservations(DEFAULT_RESERVATIONS);
            return DEFAULT_RESERVATIONS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_RESERVATIONS;
        }
    },
    setReservations(reservations) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    },
    addReservation(booking) {
        const reservations = this.getReservations();
        booking.id = 'RY-' + Math.floor(1000 + Math.random() * 9000);
        booking.status = 'pending';
        booking.createdAt = new Date().toISOString();
        reservations.unshift(booking);
        this.setReservations(reservations);
        return booking;
    },
    updateReservationStatus(id, newStatus) {
        let reservations = this.getReservations();
        reservations = reservations.map(res => res.id === id ? { ...res, status: newStatus } : res);
        this.setReservations(reservations);
    },
    deleteReservation(id) {
        let reservations = this.getReservations();
        reservations = reservations.filter(res => res.id !== id);
        this.setReservations(reservations);
    },

    // Order Operations
    getOrders() {
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (!data) {
            this.setOrders(DEFAULT_ORDERS);
            return DEFAULT_ORDERS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_ORDERS;
        }
    },
    setOrders(orders) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    },
    addOrder(order) {
        const orders = this.getOrders();
        order.id = 'ORD-' + Math.floor(5000 + Math.random() * 5000);
        order.status = 'received';
        order.createdAt = new Date().toISOString();
        orders.unshift(order);
        this.setOrders(orders);
        return order;
    },
    updateOrderStatus(id, newStatus) {
        let orders = this.getOrders();
        orders = orders.map(ord => ord.id === id ? { ...ord, status: newStatus } : ord);
        this.setOrders(orders);
    },

    // Review Operations
    getReviews() {
        const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        if (!data) {
            this.setReviews(DEFAULT_REVIEWS);
            return DEFAULT_REVIEWS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_REVIEWS;
        }
    },
    setReviews(reviews) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    },
    addReview(review) {
        const reviews = this.getReviews();
        review.id = 'rev-' + Date.now();
        review.date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        review.tag = 'Diner Feedback';
        reviews.unshift(review);
        this.setReviews(reviews);
        return review;
    },
    deleteReview(id) {
        let reviews = this.getReviews();
        reviews = reviews.filter(rev => rev.id !== id);
        this.setReviews(reviews);
    },

    // Settings Operations
    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!data) {
            this.setSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    },
    setSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Reset Data Helper
    resetDemoData() {
        this.setMenu(DEFAULT_MENU);
        this.setReservations(DEFAULT_RESERVATIONS);
        this.setOrders(DEFAULT_ORDERS);
        this.setReviews(DEFAULT_REVIEWS);
        this.setSettings(DEFAULT_SETTINGS);
    }
};

// Auto-initialize defaults on script load if missing
RoofYardDB.getMenu();
RoofYardDB.getReservations();
RoofYardDB.getOrders();
RoofYardDB.getReviews();
RoofYardDB.getSettings();
