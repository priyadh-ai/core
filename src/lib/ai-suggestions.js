const CATEGORY_KEYWORDS = {
  'Eating Out': ['restaurant', 'pizza', 'burger', 'dominos', 'mcdonalds', 'kfc', 'cafe', 'coffee', 'food', 'meal', 'lunch', 'dinner', 'breakfast'],
  'Groceries': ['grocery', 'supermarket', 'vegetables', 'fruits', 'milk', 'bread', 'store', 'mart'],
  'Transport': ['uber', 'ola', 'taxi', 'bus', 'metro', 'train', 'auto', 'rickshaw', 'fare'],
  'Petrol': ['petrol', 'fuel', 'gas', 'diesel', 'pump'],
  'Movie': ['movie', 'cinema', 'theatre', 'film', 'pvr', 'inox', 'ticket'],
  'Bills': ['electricity', 'water', 'internet', 'phone', 'mobile', 'recharge', 'bill', 'rent', 'emi'],
  'Misc': [],
};

export function suggestCategory(description) {
  if (!description) return null;

  const lowerDesc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }

  return null;
}

export function generateInsights(expenses) {
  if (!expenses || expenses.length === 0) return [];

  const insights = [];
  const categoryTotals = {};

  expenses.forEach(expense => {
    const cat = expense.category_name || 'Misc';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(expense.amount);
  });

  if (categoryTotals['Eating Out'] >= 1000) {
    const potential = Math.floor(categoryTotals['Eating Out'] * 0.33);
    insights.push({
      type: 'savings',
      category: 'Eating Out',
      message: `You spent ₹${categoryTotals['Eating Out'].toFixed(0)} on Eating Out last week. If you cut one meal out per week, you could save ~₹${potential}/month.`,
      action: 'Apply suggestion?',
    });
  }

  if (categoryTotals['Petrol'] >= 2000) {
    insights.push({
      type: 'optimization',
      category: 'Petrol',
      message: `High petrol expenses detected (₹${categoryTotals['Petrol'].toFixed(0)}). Consider carpooling or using public transport on alternate days to reduce costs.`,
      action: null,
    });
  }

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0 && sortedCategories[0][1] > 1500) {
    const [topCat, topAmount] = sortedCategories[0];
    insights.push({
      type: 'pattern',
      category: topCat,
      message: `${topCat} is your highest expense category (₹${topAmount.toFixed(0)}). Track this closely to stay within budget.`,
      action: null,
    });
  }

  return insights;
}
