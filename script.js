/*
 * Digital Assets Dashboard JavaScript
 *
 * This script powers the interactive elements of the dashboard. It draws
 * charts using Chart.js, constructs a simple timeline from an array of
 * events, and applies scroll‑triggered animations to bring timeline
 * entries into view. The code executes once the DOM content has loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* Market Chart: Top cryptocurrencies by market cap
     * Data extracted from Forbes Digital Assets page:
     * Bitcoin ($2.24T), Ethereum ($408.41B), Tether ($163.85B),
     * XRP ($163.44B), BNB ($102.61B), Solana ($84.29B),
     * USDC ($64.20B), Lido stETH ($30.25B), TRON ($30.21B), Dogecoin ($28.68B)
     * Values converted to billions for scaling (Bitcoin 2.24T → 2240B).
     */
    const marketLabels = [
        'Bitcoin',
        'Ethereum',
        'Tether',
        'XRP',
        'BNB',
        'Solana',
        'USDC',
        'Lido stETH',
        'TRON',
        'Dogecoin'
    ];
    const marketData = [
        2240.0,
        408.41,
        163.85,
        163.44,
        102.61,
        84.29,
        64.20,
        30.25,
        30.21,
        28.68
    ];

    // Create bar chart with gradient fill
    const marketCtx = document.getElementById('marketChart').getContext('2d');
    const gradient = marketCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#00bfa6');
    gradient.addColorStop(1, '#64ffda');
    new Chart(marketCtx, {
        type: 'bar',
        data: {
            labels: marketLabels,
            datasets: [
                {
                    label: 'Market Cap (Billions USD)',
                    data: marketData,
                    backgroundColor: gradient,
                    borderColor: '#00bfa6',
                    borderWidth: 1,
                    hoverBackgroundColor: '#64ffda',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#8892b0', font: { size: 12 } },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#8892b0',
                        font: { size: 12 },
                        callback: (value) => value + 'B'
                    },
                    grid: { color: 'rgba(136, 146, 176, 0.2)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ccd6f6', boxWidth: 12 },
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 2})}B`;
                        }
                    }
                }
            }
        }
    });

    /* Stablecoins Chart: Doughnut chart comparing stablecoins to the rest
     * We sum the market caps of major stablecoins (Tether, USDC, USDe) to
     * represent the stablecoin share. The remaining portion of the total
     * market cap (3.69T → 3690B) is considered other crypto assets. */
    const stableTotal = 163.85 + 64.20 + 8.67; // billions
    const totalMarket = 3690; // billions (3.69T)
    const otherTotal = totalMarket - stableTotal;
    const stableCtx = document.getElementById('stableChart').getContext('2d');
    new Chart(stableCtx, {
        type: 'doughnut',
        data: {
            labels: ['Stablecoins', 'Other Crypto Assets'],
            datasets: [
                {
                    data: [stableTotal, otherTotal],
                    backgroundColor: ['#00bfa6', '#112e51'],
                    borderColor: ['#00bfa6', '#112e51'],
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            cutout: '60%',
            plugins: {
                legend: {
                    labels: { color: '#ccd6f6', boxWidth: 12 },
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label;
                            const value = context.parsed;
                            const percent = ((value / totalMarket) * 100).toFixed(2);
                            return `${label}: ${value.toLocaleString()}B (${percent}%)`;
                        }
                    }
                }
            }
        }
    });

    /* Timeline Construction */
    const timelineData = [
        {
            year: '2009',
            title: 'Bitcoin Genesis',
            description: 'Launch of Bitcoin, the first blockchain‑based digital currency.'
        },
        {
            year: '2014',
            title: 'Public Mining & DeFi',
            description: 'Public mining companies emerge and DeFi ecosystems begin to expand.'
        },
        {
            year: '2021',
            title: 'NFTs & Alt L1s',
            description: 'Non‑fungible tokens and alternative layer‑1 blockchains gain mainstream attention.'
        },
        {
            year: '2022–2023',
            title: 'Market Turmoil',
            description: 'Collapse of Terra/Luna and FTX causes contagion across the sector, leading to bankruptcies【1230†L1-L6】.'
        },
        {
            year: '2024',
            title: 'Spot Bitcoin ETFs',
            description: 'The SEC approves multiple spot Bitcoin ETFs after years of legal challenges【1380†L4-L8】.'
        },
        {
            year: '2025',
            title: 'Stablecoin Innovation',
            description: 'U.S. dollar‑backed stablecoins are seen as the next wave of payment innovation【880†L10-L13】.'
        }
    ];
    const timelineContainer = document.getElementById('timelineContainer');
    timelineData.forEach(event => {
        const item = document.createElement('div');
        item.classList.add('timeline-item');
        item.innerHTML = `
            <h4>${event.year}</h4>
            <span>${event.title}</span>
            <p>${event.description}</p>
        `;
        timelineContainer.appendChild(item);
    });

    // Scroll-trigger animation for timeline
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
});