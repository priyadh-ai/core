export function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

export function getWeekRange(startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function getCurrentWeekMonday() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getLastWeekMonday() {
  const thisWeekMonday = getCurrentWeekMonday();
  const lastWeekMonday = new Date(thisWeekMonday);
  lastWeekMonday.setDate(thisWeekMonday.getDate() - 7);
  return lastWeekMonday;
}

export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function formatDateDisplay(date) {
  return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function getWeekDays(startDate) {
  const days = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}
