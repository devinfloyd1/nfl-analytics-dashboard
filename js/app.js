// NFL Stats Dashboard - Main Application
// 2025-26 NFL Playoffs Season
// Uses ESPN's public API endpoints

const API_BASE = 'https://site.api.espn.com/apis';

// API Endpoints
const ENDPOINTS = {
    scoreboard: `${API_BASE}/site/v2/sports/football/nfl/scoreboard`,
    leaders: `${API_BASE}/site/v2/sports/football/nfl/leaders`,
    news: `${API_BASE}/site/v2/sports/football/nfl/news`
};

// ============================================
// 2025-26 NFL FINAL STANDINGS DATA
// ============================================

const NFL_STANDINGS_2025 = {
    AFC: {
        East: [
            { team: 'New England Patriots', abbr: 'NE', wins: 14, losses: 3, ties: 0, divRecord: '5-1', playoff: 'division' },
            { team: 'Buffalo Bills', abbr: 'BUF', wins: 12, losses: 5, ties: 0, divRecord: '4-2', playoff: 'wildcard' },
            { team: 'Miami Dolphins', abbr: 'MIA', wins: 7, losses: 10, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'New York Jets', abbr: 'NYJ', wins: 3, losses: 14, ties: 0, divRecord: '0-6', playoff: null }
        ],
        North: [
            { team: 'Pittsburgh Steelers', abbr: 'PIT', wins: 10, losses: 7, ties: 0, divRecord: '4-2', playoff: 'division' },
            { team: 'Baltimore Ravens', abbr: 'BAL', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'Cincinnati Bengals', abbr: 'CIN', wins: 6, losses: 11, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'Cleveland Browns', abbr: 'CLE', wins: 5, losses: 12, ties: 0, divRecord: '2-4', playoff: null }
        ],
        South: [
            { team: 'Jacksonville Jaguars', abbr: 'JAX', wins: 13, losses: 4, ties: 0, divRecord: '5-1', playoff: 'division' },
            { team: 'Houston Texans', abbr: 'HOU', wins: 12, losses: 5, ties: 0, divRecord: '4-2', playoff: 'wildcard' },
            { team: 'Indianapolis Colts', abbr: 'IND', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'Tennessee Titans', abbr: 'TEN', wins: 3, losses: 14, ties: 0, divRecord: '0-6', playoff: null }
        ],
        West: [
            { team: 'Denver Broncos', abbr: 'DEN', wins: 14, losses: 3, ties: 0, divRecord: '5-1', playoff: 'division' },
            { team: 'Los Angeles Chargers', abbr: 'LAC', wins: 11, losses: 6, ties: 0, divRecord: '4-2', playoff: 'wildcard' },
            { team: 'Kansas City Chiefs', abbr: 'KC', wins: 6, losses: 11, ties: 0, divRecord: '1-5', playoff: null },
            { team: 'Las Vegas Raiders', abbr: 'LV', wins: 3, losses: 14, ties: 0, divRecord: '2-4', playoff: null }
        ]
    },
    NFC: {
        East: [
            { team: 'Philadelphia Eagles', abbr: 'PHI', wins: 11, losses: 6, ties: 0, divRecord: '4-2', playoff: 'division' },
            { team: 'Dallas Cowboys', abbr: 'DAL', wins: 7, losses: 9, ties: 1, divRecord: '3-3', playoff: null },
            { team: 'Washington Commanders', abbr: 'WAS', wins: 5, losses: 12, ties: 0, divRecord: '2-4', playoff: null },
            { team: 'New York Giants', abbr: 'NYG', wins: 4, losses: 13, ties: 0, divRecord: '2-4', playoff: null }
        ],
        North: [
            { team: 'Chicago Bears', abbr: 'CHI', wins: 11, losses: 6, ties: 0, divRecord: '5-1', playoff: 'division' },
            { team: 'Green Bay Packers', abbr: 'GB', wins: 9, losses: 8, ties: 0, divRecord: '3-3', playoff: 'wildcard' },
            { team: 'Minnesota Vikings', abbr: 'MIN', wins: 9, losses: 8, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'Detroit Lions', abbr: 'DET', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: null }
        ],
        South: [
            { team: 'Carolina Panthers', abbr: 'CAR', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: 'division' },
            { team: 'Tampa Bay Buccaneers', abbr: 'TB', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'Atlanta Falcons', abbr: 'ATL', wins: 8, losses: 9, ties: 0, divRecord: '3-3', playoff: null },
            { team: 'New Orleans Saints', abbr: 'NO', wins: 7, losses: 10, ties: 0, divRecord: '3-3', playoff: null }
        ],
        West: [
            { team: 'Seattle Seahawks', abbr: 'SEA', wins: 14, losses: 3, ties: 0, divRecord: '6-0', playoff: 'division' },
            { team: 'Los Angeles Rams', abbr: 'LAR', wins: 12, losses: 5, ties: 0, divRecord: '4-2', playoff: 'wildcard' },
            { team: 'San Francisco 49ers', abbr: 'SF', wins: 12, losses: 5, ties: 0, divRecord: '3-3', playoff: 'wildcard' },
            { team: 'Arizona Cardinals', abbr: 'ARI', wins: 5, losses: 12, ties: 0, divRecord: '1-5', playoff: null }
        ]
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    updateLastUpdated();

    // Render hardcoded standings (closed by default)
    renderStandings();

    // Fetch live data
    fetchAndDisplayGames();
    fetchAndDisplayTopPlayers();
    fetchAndDisplayNews();
}

function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent =
        `Last updated: ${now.toLocaleString()}`;
}

// ============================================
// STANDINGS (Hardcoded 2025-26 Data)
// Accordions start CLOSED by default
// ============================================

function renderStandings() {
    renderConferenceStandings('afcStandings', NFL_STANDINGS_2025.AFC);
    renderConferenceStandings('nfcStandings', NFL_STANDINGS_2025.NFC);
}

function renderConferenceStandings(containerId, conferenceData) {
    const container = document.getElementById(containerId);

    const divisionsHTML = Object.entries(conferenceData).map(([divisionName, teams]) => {
        return createDivisionAccordion(divisionName, teams);
    }).join('');

    container.innerHTML = divisionsHTML;
}

function createDivisionAccordion(divisionName, teams) {
    const teamsHTML = teams.map((team, index) => {
        const record = team.ties > 0
            ? `${team.wins}-${team.losses}-${team.ties}`
            : `${team.wins}-${team.losses}`;

        let playoffBadge = '';
        if (team.playoff === 'division') {
            playoffBadge = '<span class="playoff-indicator division-winner">DIV</span>';
        } else if (team.playoff === 'wildcard') {
            playoffBadge = '<span class="playoff-indicator wildcard">WC</span>';
        }

        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <span class="team-name">${team.abbr}</span>
                    ${playoffBadge}
                </td>
                <td class="record-cell">${record}</td>
                <td class="div-record">${team.divRecord}</td>
            </tr>
        `;
    }).join('');

    // Note: No 'open' class = closed by default
    return `
        <div class="division-item">
            <div class="division-header" onclick="toggleDivision(this)">
                <span>${divisionName}</span>
                <span class="arrow">▼</span>
            </div>
            <div class="division-content">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>Record</th>
                            <th>Div</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teamsHTML}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function toggleDivision(header) {
    const divisionItem = header.parentElement;
    divisionItem.classList.toggle('open');
}

// ============================================
// RECENT GAMES (Playoffs)
// ============================================

async function fetchAndDisplayGames() {
    const container = document.getElementById('gamesContainer');

    try {
        const response = await fetch(ENDPOINTS.scoreboard);
        const data = await response.json();

        if (!data.events || data.events.length === 0) {
            container.innerHTML = '<p class="error">No playoff games scheduled - check back soon</p>';
            return;
        }

        container.innerHTML = data.events.map(game => createGameCard(game)).join('');
    } catch (error) {
        console.error('Error fetching games:', error);
        container.innerHTML = '<p class="error">Failed to load games. Please try again later.</p>';
    }
}

function createGameCard(game) {
    const competition = game.competitions[0];
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

    const status = game.status.type.description;
    const isLive = game.status.type.state === 'in';
    const isComplete = game.status.type.completed;

    const homeWinner = isComplete && parseInt(homeTeam.score) > parseInt(awayTeam.score);
    const awayWinner = isComplete && parseInt(awayTeam.score) > parseInt(homeTeam.score);

    return `
        <div class="game-card">
            <div class="game-status ${isLive ? 'live' : ''}">${status}</div>
            <div class="teams">
                <div class="team-row ${awayWinner ? 'winner' : ''}">
                    <div class="team-info">
                        <img class="team-logo" src="${awayTeam.team.logo}" alt="${awayTeam.team.displayName}" onerror="this.style.display='none'">
                        <span>${awayTeam.team.abbreviation}</span>
                    </div>
                    <span class="score">${awayTeam.score || '-'}</span>
                </div>
                <div class="team-row ${homeWinner ? 'winner' : ''}">
                    <div class="team-info">
                        <img class="team-logo" src="${homeTeam.team.logo}" alt="${homeTeam.team.displayName}" onerror="this.style.display='none'">
                        <span>${homeTeam.team.abbreviation}</span>
                    </div>
                    <span class="score">${homeTeam.score || '-'}</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// TOP 3 PLAYERS OF THE WEEK
// ============================================

async function fetchAndDisplayTopPlayers() {
    const container = document.getElementById('topPlayersContainer');

    try {
        const response = await fetch(ENDPOINTS.leaders);
        const data = await response.json();

        if (!data.leaders || data.leaders.length === 0) {
            container.innerHTML = '<p class="error">No player stats available</p>';
            return;
        }

        // Get top player from each category
        const passingLeader = getTopPlayer(data.leaders, 'passingYards', 'Passing');
        const rushingLeader = getTopPlayer(data.leaders, 'rushingYards', 'Rushing');
        const receivingLeader = getTopPlayer(data.leaders, 'receivingYards', 'Receiving');

        const players = [passingLeader, rushingLeader, receivingLeader].filter(p => p !== null);

        if (players.length === 0) {
            container.innerHTML = '<p class="error">No player stats available</p>';
            return;
        }

        container.innerHTML = players.map(player => createPlayerCard(player)).join('');

    } catch (error) {
        console.error('Error fetching player stats:', error);
        container.innerHTML = '<p class="error">Failed to load player stats</p>';
    }
}

function getTopPlayer(leaders, statName, category) {
    const categoryData = leaders.find(l =>
        l.name === statName ||
        l.displayName?.toLowerCase().includes(statName.toLowerCase().replace('yards', ''))
    );

    if (!categoryData || !categoryData.leaders || categoryData.leaders.length === 0) {
        return null;
    }

    const leader = categoryData.leaders[0];
    const athlete = leader.athlete;

    return {
        name: athlete.displayName,
        team: athlete.team?.abbreviation || 'N/A',
        teamName: athlete.team?.displayName || '',
        headshot: athlete.headshot?.href || `https://a.espncdn.com/i/headshots/nfl/players/full/${athlete.id}.png`,
        category: category,
        stat: leader.displayValue || leader.value,
        statLabel: `${category} Yards`
    };
}

function createPlayerCard(player) {
    const categoryColors = {
        'Passing': '#013369',
        'Rushing': '#d50a0a',
        'Receiving': '#1a4a8a'
    };

    const color = categoryColors[player.category] || '#013369';

    return `
        <div class="player-card">
            <div class="player-category" style="background: ${color}">${player.category} Leader</div>
            <div class="player-photo">
                <img src="${player.headshot}" alt="${player.name}" onerror="this.src='https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=200&h=146'">
            </div>
            <div class="player-info">
                <h3 class="player-name">${player.name}</h3>
                <p class="player-team">${player.team}</p>
                <div class="player-stat">
                    <span class="stat-value">${player.stat}</span>
                    <span class="stat-label">${player.statLabel}</span>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// NFL NEWS SECTION
// ============================================

async function fetchAndDisplayNews() {
    const container = document.getElementById('newsContainer');

    try {
        const response = await fetch(ENDPOINTS.news);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = '<p class="error">No news available</p>';
            return;
        }

        // Get top 3 articles
        const articles = data.articles.slice(0, 3);
        container.innerHTML = articles.map(article => createNewsCard(article)).join('');

    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = '<p class="error">Failed to load news</p>';
    }
}

function createNewsCard(article) {
    const image = article.images?.[0]?.url || 'https://a.espncdn.com/combiner/i?img=/i/espn/misc_logos/500/nfl.png&w=200';
    const description = article.description || article.headline || '';
    const truncatedDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;
    const link = article.links?.web?.href || article.links?.api?.news?.href || '#';

    return `
        <a href="${link}" target="_blank" rel="noopener" class="news-card">
            <div class="news-image">
                <img src="${image}" alt="${article.headline}" onerror="this.src='https://a.espncdn.com/combiner/i?img=/i/espn/misc_logos/500/nfl.png&w=200'">
            </div>
            <div class="news-content">
                <h3 class="news-headline">${article.headline}</h3>
                <p class="news-excerpt">${truncatedDesc}</p>
                <span class="news-link">Read More →</span>
            </div>
        </a>
    `;
}