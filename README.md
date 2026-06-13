# DevFolio Dashboard

A professional portfolio-ready web application for an **Entry-Level Web Developer** position. The project demonstrates practical frontend development skills with semantic HTML5, modern CSS3, and modular JavaScript.

## Features

- **Authentication:** Register, login, logout, and persist a local demo session.
- **Dashboard:** Dynamic metrics for total projects, completed work, in-progress work, and loaded API posts.
- **REST API Integration:** Fetches learning-resource posts from JSONPlaceholder with async/await and error handling.
- **CRUD Operations:** Create, read, update, and delete portfolio projects.
- **Search and Filtering:** Search project content and filter by project status.
- **Form Validation:** Validates auth and project forms before saving data.
- **Dark Mode:** Persistent light/dark theme toggle.
- **Responsive Design:** Mobile-friendly layouts using CSS Grid, Flexbox, fluid type, and adaptive navigation.
- **Clean Code:** Organized source files, reusable rendering functions, local state management, and HTML escaping.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite
- JSONPlaceholder REST API
- LocalStorage for demo persistence

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) version 18 or newer.

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## Demo Usage

1. Open the app and select **Register**.
2. Create an account with a valid email and a password of at least 8 characters.
3. Add a new portfolio project with a title, tech stack, status, and description.
4. Search, filter, edit, and delete projects.
5. Toggle dark mode and refresh API data.

## Project Structure

```text
.
├── index.html          # Main HTML document and app layout
├── package.json        # Vite scripts and project metadata
├── README.md           # Project documentation
└── src
    ├── main.js         # Authentication, CRUD, API, rendering, validation
    └── styles.css      # Responsive design system and UI components
```

## Portfolio Talking Points

- Built a complete responsive single-page application without a heavyweight framework.
- Integrated a remote REST API with loading and failure states.
- Implemented CRUD workflows using JavaScript state and LocalStorage persistence.
- Practiced secure rendering habits by escaping dynamic HTML content.
- Designed reusable UI patterns suitable for real product dashboards.

## Notes

Authentication is intentionally local-only for portfolio demonstration. A production application should use a secure backend, hashed passwords, protected API routes, HTTPS, and server-side session or token management.
