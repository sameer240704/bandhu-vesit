export const portfolioSummary = {
    totalValue: 1827,
    monthlyReturns: 234,
    riskScore: 72,
    goalProgress: 42.3,
    monthlyChange: 12.5,
    returnsChange: 4.2,
};

export const barChartGameData = [
    { name: "Level 1", wins: 15, losses: 5, abandonments: 2 },
    { name: "Level 2", wins: 12, losses: 8, abandonments: 3 },
    { name: "Level 3", wins: 10, losses: 10, abandonments: 4 },
    { name: "Level 4", wins: 8, losses: 12, abandonments: 2 },
    { name: "Level 5", wins: 6, losses: 14, abandonments: 1 },
    { name: "Level 6", wins: 4, losses: 16, abandonments: 0 },
];

export const gameAnalysisMetrics = {
    strategySkill: 75,
    reflexSpeed: 60,
    coordination: 80,
    knowledge: 50,
    riskScore: 65,
};

export const assetAllocation = (() => {
    const initialData = [
        { name: "AAPL", amount: 23600, color: "#4F46E5" },
        { name: "TCS", amount: 203657.5, color: "#10B981" },
        { name: "NVDA", amount: 4922.87, color: "#F59E0B" },
        { name: "AMZN", amount: 47060.64, color: "#EF4444" },
        { name: "Others", amount: 50000, color: "#6B7280" },
    ];

    // Calculate total amount
    const totalAmount = initialData.reduce((acc, asset) => acc + asset.amount, 0);

    // Calculate value as a percentage of total amount
    const calculatedData = initialData.map((asset) => ({
        ...asset,
        value: parseFloat(((asset.amount / totalAmount) * 100).toFixed(2)),
    }));

    return calculatedData;
})();

export const mostPlayedGamesData = (() => {
    const initialData = [
        { name: "Cognitive Development", game: "Chess", plays: 520, color: "#4F46E5" }, // Purple
        { name: "Emotional Well-being", game: "Mindfulness Meditation App", plays: 450, color: "#10B981" }, // Green
        { name: "Social Games", game: "Codenames", plays: 380, color: "#F59E0B" }, // Yellow/Orange
        { name: "Motor Skills", game: "Just Dance", plays: 400, color: "#EF4444" }, // Red
        { name: "Others", game: "Sudoku", plays: 300, color: "#6B7280" }, // Gray
    ];

    // Calculate total number of plays
    const totalPlays = initialData.reduce((acc, game) => acc + game.plays, 0);

    // Calculate value as a percentage of total plays
    const calculatedData = initialData.map((game) => ({
        ...game,
        value: parseFloat(((game.plays / totalPlays) * 100).toFixed(2)),
    }));

    return calculatedData;
})();

export const performanceData = [
    { month: "Jan", score: 50, sessions: 10, avgTime: 25 },
    { month: "Feb", score: 75, sessions: 12, avgTime: 30 },
    { month: "Mar", score: 60, sessions: 15, avgTime: 28 },
    { month: "Apr", score: 80, sessions: 18, avgTime: 32 },
    { month: "May", score: 70, sessions: 20, avgTime: 35 },
    { month: "Jun", score: 90, sessions: 22, avgTime: 40 },
];

export const incomeStreams = [
    { source: "Primary Salary", amount: 8500, percentage: 70 },
    { source: "Investments", amount: 2000, percentage: 16 },
    { source: "Side Business", amount: 1200, percentage: 10 },
    { source: "Rental Income", amount: 500, percentage: 4 },
];

export const expenseCategories = [
    { category: "Housing", amount: 2500, percentage: 35 },
    { category: "Transportation", amount: 800, percentage: 11 },
    { category: "Food", amount: 1000, percentage: 14 },
    { category: "Utilities", amount: 400, percentage: 6 },
    { category: "Insurance", amount: 300, percentage: 4 },
    { category: "Entertainment", amount: 600, percentage: 8 },
    { category: "Savings", amount: 1500, percentage: 21 },
];

export const liabilities = [
    {
        type: "Home Loan",
        amount: 5000000,
        monthlyPayment: 42000,
        interestRate: 8.5,
        paid: 1500000,
        isSecured: true,
        description: "Home loan from SBI",
    },
    {
        type: "Car Loan",
        amount: 800000,
        monthlyPayment: 15000,
        interestRate: 9.5,
        paid: 300000,
        isSecured: true,
        description: "Car loan from HDFC",
    },
];

export const gameProgress = [
    {
        type: "Main Campaign",
        totalLevels: 20,
        levelsCompleted: 12,
        completionReward: "Epic Sword",
        isBonus: false,
        description: "The primary storyline",
    },
    {
        type: "Side Quests",
        totalLevels: 30,
        levelsCompleted: 15,
        completionReward: "Legendary Armor",
        isBonus: true,
        description: "Additional missions",
    },
];

export const recentActivity = [
    {
        type: "Stock Purchase",
        amount: "+ ₹50,000",
        date: "2024-01-25",
        status: "Completed",
        category: "HDFC Bank",
        balance: "₹4,50,000",
    },
    {
        type: "SIP Investment",
        amount: "+ ₹25,000",
        date: "2024-01-20",
        status: "Completed",
        category: "Mutual Funds",
        balance: "₹4,00,000",
    },
];

export const investmentGoals = [
    {
        name: "Retirement",
        target: 2000000,
        current: 847293,
        timeline: "20 years",
    },
    {
        name: "House Down Payment",
        target: 100000,
        current: 45000,
        timeline: "3 years",
    },
    { name: "Emergency Fund", target: 50000, current: 35000, timeline: "1 year" },
    {
        name: "Children Education",
        target: 150000,
        current: 25000,
        timeline: "10 years",
    },
];

export const riskMetrics = {
    volatility: 12.5,
    sharpeRatio: 1.8,
    maxDrawdown: -15.2,
    beta: 0.85,
    alpha: 2.3,
};

export const marketIndicators = [
    { name: "NIFTY 50", value: "₹22,378.40", trend: "up" },
    { name: "SENSEX", value: "₹73,745.35", trend: "up" },
    { name: "BANK NIFTY", value: "₹46,875.20", trend: "down" },
    { name: "NIFTY IT", value: "₹33,456.80", trend: "up" },
    { name: "TCS", value: "₹4,130.00", trend: "down" },
    { name: "NVIDIA", value: "₹10409.03", trend: "down" },
    { name: "AMAZON", value: "₹20604.80", trend: "up" },
    { name: "APPLE", value: "₹20459.16", trend: "down" },
];