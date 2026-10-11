# Roof Yard - Aesthetic Rooftop Dining & Lounge Website with Admin Panel

A luxury, aesthetic, and fully interactive website for **Roof Yard** (Rooftop Dining & Lounge) built with modern **HTML5, CSS3, and Vanilla JavaScript**.

Features a live **Management Admin Panel** with full CRUD capabilities, table reservations management, real-time menu toggles, order tracking, and customer reviews synchronization powered by `localStorage`.

---

## 🌟 Key Features

### 🍸 1. Public Customer Website (`index.html`)
- **Luxury Aesthetic Design**:
  - Warm twilight & champagne gold color palette (`Playfair Display` + `Plus Jakarta Sans`).
  - Glassmorphism effects with subtle glows and ambient typography.
  - Fully mobile-responsive layout for smartphones, tablets, laptops, and ultra-wide screens.
- **Top Announcement Bar**:
  - Live announcement notice, opening hours, direct phone link, and staff login portal.
- **Hero Section**:
  - Atmospheric rooftop photography, animated badge, headline, call-to-actions, and live highlights bar (Sunset Skyline, Woodfire & Charcoal, Live Music, 4.9★ Rating).
- **The Roof Yard Story & Experience**:
  - About section highlighting sourdough stone ovens, zero-proof mixology bar, cozy firepits, and botanical gardens.
- **Dynamic Digital Menu**:
  - Real-time synchronization with the Admin Panel via `localStorage`.
  - Category filters: *All, Starters & Tapas, Woodfire Pizza, Rooftop Grills, Gourmet Mains, Artisan Drinks, Decadent Desserts*.
  - Dietary filters: *Vegetarian (Green) & Non-Veg (Red)*.
  - Live search bar filtering dishes and ingredients in real time.
- **Interactive Order Tray & Slide-out Cart**:
  - Add dishes to tray, adjust quantities (+/-), automatic subtotal, 10% tax/service charge, and grand total.
  - Checkout modal allowing customers to place Dine-in or Takeaway orders directly.
- **Table Reservation System**:
  - Interactive booking form with guest count selector, date picker (disables past dates), time slot chips, seating zones (*Skyline Terrace Deck, Sunset Cabana VIP, Pergola Lounge, Fireplace Corner*), and occasion options.
  - Generates instant booking confirmation modal with unique Booking Reference (e.g. `RY-8925`).
- **Visual Vibes Gallery**:
  - Aesthetic masonry grid with hover overlays.
- **Customer Reviews & Testimonials**:
  - Verified diner ratings and quotes.
  - Interactive "Leave Your Review" modal that instantly adds feedback to the website and Admin Panel.
- **Contact & Location**:
  - Operating hours, hotline, direct WhatsApp concierge link, and styled Google Maps container.

---

### 🛡️ 2. Management Admin Panel (`admin.html`)
- **Secure Management Login**:
  - Default Credentials:
    - **Email**: `admin@roofyard.com`
    - **Password**: `admin123`
- **Dashboard Overview (KPIs)**:
  - Total Bookings & Pending Approvals counter.
  - Live Order Count & Revenue calculations.
  - Active vs Sold-Out Menu count.
  - Average Customer Rating calculation.
  - Recent Bookings overview table.
- **Table Reservations Hub**:
  - Filter by: *All, Pending, Confirmed, Cancelled*.
  - Search reservations by guest name, phone, or Booking ID.
  - **Approve / Confirm** or **Cancel** bookings in one click.
  - **1-Click WhatsApp Guest**: Automatically opens WhatsApp chat with pre-filled greeting message confirming their reservation!
  - Delete reservation records.
- **Menu Management (Full CRUD)**:
  - Search by dish name and filter by category.
  - **In-Stock / Sold-Out Toggle Switch**: Instantly updates dish availability on the public customer menu!
  - **Add New Dish Modal**: Title, category, price, dietary type, badge tag, image URL, and description.
  - **Edit Dish Modal**: Pre-fills existing dish data and updates it immediately.
  - **Delete Dish**: Permanently remove items with confirmation.
- **Live Kitchen Orders**:
  - View orders placed by customers through the website cart.
  - Status management dropdown: *Received ➔ Preparing ➔ Ready ➔ Completed*.
  - **Printable Bill Receipt Modal**: Generates official formatted bill tokens with subtotal, tax, and itemized list.
- **Guest Reviews Management**:
  - View all user-submitted reviews and delete inappropriate reviews.
- **Restaurant Settings**:
  - Update announcement banner, operating hours, hotline, email, and address.
  - Changes instantly update across the public website!
- **Data Reset**:
  - "Reset Demo Data" button to restore default pre-seeded menu, sample bookings, and reviews anytime.

---

## 📁 File Structure

```
team work/
├── index.html              # Main customer-facing aesthetic restaurant website
├── admin.html              # Full-featured management admin panel
├── css/
│   ├── style.css           # Luxury rooftop aesthetic styles & animations
│   ├── admin.css           # Modern dark SaaS admin dashboard styling
│   └── responsive.css      # Comprehensive responsive styling (mobile & tablet)
├── js/
│   ├── data.js             # LocalStorage database engine & pre-seeded defaults
│   ├── app.js              # Customer website interactions (cart, booking, reviews)
│   └── admin.js            # Admin CRUD, KPIs, status management, WhatsApp link
└── assets/
    └── images/             # Asset folder
```

---

## 🚀 How to Run the Website

No installation or build tools required! Everything runs out of the box in any web browser:

1. **Open Customer Website**:
   - Double-click `index.html` or open it with Google Chrome, Microsoft Edge, or Firefox.
2. **Open Admin Panel**:
   - Click the **"Staff Login"** link in the top bar of `index.html` (or **"Management Admin Panel"** in the footer), or directly double-click `admin.html`.
   - Log in with:
     - **Email:** `admin@roofyard.com`
     - **Password:** `admin123`
