# NFL Stats Dashboard

A simple, real-time NFL statistics dashboard built with vanilla JavaScript and Chart.js. Displays current season data including team standings, player leaders, and recent game scores.

## Features

- **Recent Games**: Live scores and game results from the current week
- **Team Standings**: AFC and NFC standings organized by division
- **Player Leaders**: Top 10 players by passing, rushing, and receiving yards
- **Interactive Charts**: Visual bar charts for player statistics using Chart.js
- **Responsive Design**: Works on desktop and mobile devices

## Demo

Deploy to GitHub Pages and access your dashboard at: `https://<username>.github.io/nfl-stats-dashboard/`

## Quick Start

### Option 1: Open Locally
Simply open `index.html` in your browser. The dashboard will fetch live data from ESPN's public API.

### Option 2: Deploy to GitHub Pages
1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)` folder
5. Click Save - your site will be live in a few minutes

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, responsive design
- **JavaScript (ES6+)**: Async/await, Fetch API, DOM manipulation
- **Chart.js**: Data visualization (loaded via CDN)
- **ESPN API**: Public NFL data endpoints (no API key required)

## Project Structure

```
nfl-stats-dashboard/
├── index.html          # Main dashboard page
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # API calls and rendering logic
└── README.md
```

## API Endpoints Used

This dashboard uses ESPN's public API:
- Scoreboard: `site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
- Standings: `site.api.espn.com/apis/v2/sports/football/nfl/standings`
- Leaders: `site.api.espn.com/apis/site/v2/sports/football/nfl/leaders`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Add player search functionality
- Include more statistical categories (touchdowns, interceptions, etc.)
- Add team detail pages
- Historical season comparison
- Dark mode toggle

## License

MIT License - feel free to use and modify for your own projects.