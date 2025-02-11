export const portfolioSummary = {
    totalValue: 329242,
    monthlyReturns: 4483,
    riskScore: 72,
    goalProgress: 42.3,
    monthlyChange: 12.5,
    returnsChange: 8.2,
};

export const monthlyData = [
    { name: "Jan", value: 4000, expenses: 2800, savings: 1200 },
    { name: "Feb", value: 3000, expenses: 2600, savings: 400 },
    { name: "Mar", value: 5000, expenses: 2900, savings: 2100 },
    { name: "Apr", value: 2780, expenses: 2500, savings: 280 },
    { name: "May", value: 1890, expenses: 2400, savings: -510 },
    { name: "Jun", value: 2390, expenses: 2200, savings: 190 },
];

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

export const performanceData = [
    { month: "Jan", portfolio: 1000000, benchmark: 980000, risk: 950000 },
    { month: "Feb", portfolio: 1050000, benchmark: 1000000, risk: 980000 },
    { month: "Mar", portfolio: 1150000, benchmark: 1100000, risk: 1050000 },
    { month: "Apr", portfolio: 1200000, benchmark: 1150000, risk: 1100000 },
    { month: "May", portfolio: 1250000, benchmark: 1200000, risk: 1150000 },
    { month: "Jun", portfolio: 1300000, benchmark: 1250000, risk: 1200000 },
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