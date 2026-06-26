# The Bauphiloné — Luxury Hotel Website

A static luxury hotel website project built with HTML, CSS, and JavaScript.

## Project Overview

This project is a multi-page luxury hotel landing site for "The Bauphiloné". It includes:

- `index.html` — Home page with hero section, quick booking card, featured hotel experience, and calls to action.
- `about.html` — About page detailing the hotel story, values, and service highlights.
- `rooms.html` — Rooms & Suites page presenting premium accommodation options.
- `gallery.html` — Image gallery page showcasing hotel spaces.
- `contact.html` — Contact page with inquiry form and property information.

## File Structure

- `index.html`
- `about.html`
- `rooms.html`
- `gallery.html`
- `contact.html`
- `css/style.css` — Main site stylesheet with navigation, layout, buttons, typography, and responsive styles.
- `js/main.js` — Main JavaScript file for site interactions.
- `images/` — Image assets used throughout the pages.

## Key Features

- Responsive navigation with mobile hamburger menu
- Sticky header that changes styling on scroll
- Multi-page layout with consistent branding and navigation
- Booking form validation and feedback
- Gallery with category-style layout and lightbox interaction
- Testimonials slider with auto-play and touch/swipe support
- Scroll reveal animations for polished page entrance effects
- Login modal demo and newsletter subscription toast messages
- Scroll-to-top button support

## Usage

### Open locally

1. Open `index.html` in your browser directly.
2. Navigate between pages using the main menu links.

### Run with a local server (recommended)

If you want cleaner local file behavior, serve the folder from a simple HTTP server.

Example using Python:

```bash
cd "e:\Web dev"
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Notes

- The site uses external resources for fonts and icons:
  - Google Fonts (`Playfair Display`, `Poppins`)
  - Font Awesome icons
- The booking form is currently client-side only and does not submit to a backend.
- The login modal and newsletter subscription are demo interactions handled in JavaScript.

## Development

To update the site:

- Edit HTML pages for content changes
- Update `css/style.css` for styling
- Update `js/main.js` for interactive behavior

## License

No license is specified in this repository.
