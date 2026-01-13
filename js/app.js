// NFL Stats Dashboard - Main Application
// Uses ESPN's public API endpoints

const API_BASE = 'https://site.api.espn.com/apis';

// API Endpoints
const ENDPOINTS = {
    scoreboard: `${API_BASE}/site/v2/sports/football/nfl/scoreboard`,
    standings: `${API_BASE}/v2/sports/football/nfl/standings`,
    leaders: `${API_BASE}/site/v2/sports/football/nfl/leaders`
};

// Chart instances
let charts = {
    passing: null,
    rushing: null,
    receiving: null
};

// Chart colors
const CHART_COLORS = [
    '#013369', '#d50a0a', '#1a4a8a', '#ff6b6b', '#4ecdc4',
    '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#74b9ff'
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupTabListeners();
});

async function initDashboard() {
    updateLastUpdated();

    // Fetch all data in parallel
    await Promise.all([
        fetchAndDisplayGames(),
        fetchAndDisplayStandings(),
        fetchAndDisplayLeaders()
    ]);
}

function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent =
        `Last updated: ${now.toLocaleString()}`;
}

// ============================================
// RECENT GAMES
// ============================================

async function fetchAndDisplayGames() {
    const container = document.getElementById('gamesContainer');

    try {
        const response = await fetch(ENDPOINTS.scoreboard);
        const data = await response.json();

        if (!data.events || data.events.length === 0) {
            container.innerHTML = '<p class="error">No games available</p>';
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
// STANDINGS
// ============================================

async function fetchAndDisplayStandings() {
    const afcContainer = document.getElementById('afcStandings');
    const nfcContainer = document.getElementById('nfcStandings');

    try {
        const response = await fetch(ENDPOINTS.standings);
        const data = await response.json();

        if (!data.children || data.children.length === 0) {
            afcContainer.innerHTML = '<p class="error">No standings available</p>';
            nfcContainer.innerHTML = '<p class="error">No standings available</p>';
            return;
        }

        // ESPN returns conferences, each with divisions
        data.children.forEach(conference => {
            const isAFC = conference.name.includes('AFC') || conference.abbreviation === 'AFC';
            const container = isAFC ? afcContainer : nfcContainer;
            container.innerHTML = renderConferenceStandings(conference);
        });
    } catch (error) {
        console.error('Error fetching standings:', error);
        afcContainer.innerHTML = '<p class="error">Failed to load standings</p>';
        nfcContainer.innerHTML = '<p class="error">Failed to load standings</p>';
    }
}

function renderConferenceStandings(conference) {
    if (!conference.children) {
        return '<p class="error">No division data available</p>';
    }

    return conference.children.map(division => `
        <div class="division">
            <h4>${division.name.replace('AFC ', '').replace('NFC ', '')}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>W</th>
                        <th>L</th>
                        <th>T</th>
                        <th>PCT</th>
                    </tr>
                </thead>
                <tbody>
                    ${division.standings.entries.map(entry => renderStandingsRow(entry)).join('')}
                </tbody>
            </table>
        </div>
    `).join('');
}

function renderStandingsRow(entry) {
    const team = entry.team;
    const stats = {};

    // Parse stats from the entry
    entry.stats.forEach(stat => {
        stats[stat.name] = stat.value;
    });

    const wins = stats.wins || 0;
    const losses = stats.losses || 0;
    const ties = stats.ties || 0;
    const pct = stats.winPercent ? stats.winPercent.toFixed(3) : '.000';

    return `
        <tr>
            <td>
                <div class="team-cell">
                    <img class="team-logo" src="${team.logos?.[0]?.href || ''}" alt="${team.displayName}" onerror="this.style.display='none'">
                    <span>${team.abbreviation}</span>
                </div>
            </td>
            <td>${wins}</td>
            <td>${losses}</td>
            <td>${ties}</td>
            <td>${pct}</td>
        </tr>
    `;
}

// ============================================
// PLAYER LEADERS
// ============================================

async function fetchAndDisplayLeaders() {
    try {
        const response = await fetch(ENDPOINTS.leaders);
        const data = await response.json();

        if (!data.leaders || data.leaders.length === 0) {
            displayLeadersError();
            return;
        }

        // Find the relevant leader categories
        const passingData = findLeaderCategory(data.leaders, 'passingYards');
        const rushingData = findLeaderCategory(data.leaders, 'rushingYards');
        const receivingData = findLeaderCategory(data.leaders, 'receivingYards');

        // Update tables
        updateLeadersTable('passingLeaders', passingData);
        updateLeadersTable('rushingLeaders', rushingData);
        updateLeadersTable('receivingLeaders', receivingData);

        // Create charts
        createLeaderChart('passingCanvas', 'passing', passingData, 'Passing Yards');
        createLeaderChart('rushingCanvas', 'rushing', rushingData, 'Rushing Yards');
        createLeaderChart('receivingCanvas', 'receiving', receivingData, 'Receiving Yards');

    } catch (error) {
        console.error('Error fetching leaders:', error);
        displayLeadersError();
    }
}

function findLeaderCategory(leaders, statName) {
    const category = leaders.find(l =>
        l.name === statName ||
        l.displayName?.toLowerCase().includes(statName.toLowerCase().replace('yards', ''))
    );

    if (!category || !category.leaders) {
        return [];
    }

    return category.leaders.slice(0, 10).map(leader => ({
        name: leader.athlete.displayName,
        team: leader.athlete.team?.abbreviation || 'N/A',
        value: parseFloat(leader.value) || 0,
        displayValue: leader.displayValue || leader.value
    }));
}

function updateLeadersTable(tableId, data) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="error">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = data.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.team}</td>
            <td>${player.displayValue}</td>
        </tr>
    `).join('');
}

function createLeaderChart(canvasId, chartKey, data, label) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (charts[chartKey]) {
        charts[chartKey].destroy();
    }

    if (!data || data.length === 0) {
        return;
    }

    charts[chartKey] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(p => p.name.split(' ').pop()), // Last name only for space
            datasets: [{
                label: label,
                data: data.map(p => p.value),
                backgroundColor: CHART_COLORS,
                borderColor: CHART_COLORS.map(c => c),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: (items) => data[items[0].dataIndex].name,
                        label: (item) => `${label}: ${item.raw.toLocaleString()}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => value.toLocaleString()
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function displayLeadersError() {
    ['passingLeaders', 'rushingLeaders', 'receivingLeaders'].forEach(id => {
        const tbody = document.getElementById(id).querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="4" class="error">Failed to load data</td></tr>';
    });
}

// ============================================
// TAB FUNCTIONALITY
// ============================================

function setupTabListeners() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding chart
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.chart-wrapper').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            document.getElementById(`${tabName}Chart`).classList.add('active');
        });
    });
}

// ============================================
// AUTO REFRESH (optional - every 5 minutes)
// ============================================

// Uncomment to enable auto-refresh
// setInterval(() => {
//     initDashboard();
// }, 5 * 60 * 1000);
