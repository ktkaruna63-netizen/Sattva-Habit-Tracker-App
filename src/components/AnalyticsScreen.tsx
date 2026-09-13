import { BarChart3, TrendingUp, Target, Calendar, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeeklyAnalytics } from '../hooks/useUserProfile';

export function AnalyticsScreen() {
  const { data, loading } = useWeeklyAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-safe-top">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-sage-100 rounded w-32" />
            <div className="h-48 bg-sage-100 rounded-3xl" />
            <div className="h-32 bg-sage-100 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const avgCompletion = data.dailyStats.reduce((sum, d) => sum + d.percentage, 0) / 7;
  const bestDay = data.dailyStats.reduce((best, d) => d.percentage > best.percentage ? d : best, data.dailyStats[0]);
  const trendUp = data.dailyStats[6].percentage > data.dailyStats[0].percentage;

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return { dayName, dayNum, isToday };
  };

  const maxPercentage = Math.max(...data.dailyStats.map(d => d.percentage), 1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-safe-top">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="pt-6 pb-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-sage-700" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-sage-800">Analytics</h1>
              <p className="text-sm text-sage-500">Your weekly progress at a glance</p>
            </div>
          </div>
        </header>

        {/* Weekly Summary Cards */}
        <section className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-4 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Target className="w-5 h-5 mx-auto text-blush-400 mb-2" />
            <div className="text-xl font-semibold text-sage-800">{Math.round(avgCompletion)}%</div>
            <div className="text-xs text-sage-500">Avg Daily</div>
          </div>
          <div className="card p-4 text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <TrendingUp className="w-5 h-5 mx-auto text-sage-400 mb-2" />
            <div className="text-xl font-semibold text-sage-800">{data.weeklyTotal.habits}</div>
            <div className="text-xs text-sage-500">Habits Done</div>
          </div>
          <div className="card p-4 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Calendar className="w-5 h-5 mx-auto text-lavender-400 mb-2" />
            <div className="text-xl font-semibold text-sage-800">{data.habitBreakdown.filter(h => h.completed >= 7).length}</div>
            <div className="text-xs text-sage-500">Perfect Days</div>
          </div>
        </section>

        {/* Weekly Bar Chart */}
        <section className="card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-sage-700">Weekly Overview</h2>
            {trendUp ? (
              <div className="flex items-center gap-1 text-sage-500 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>Improving</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-blush-400 text-sm">
                <ArrowDown className="w-4 h-4" />
                <span>Keep pushing</span>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {data.dailyStats.map((day, index) => {
              const { dayName, dayNum, isToday } = getDateLabel(day.date);
              const height = (day.percentage / maxPercentage) * 100;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center justify-end h-28">
                    {/* Bar */}
                    <div
                      className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-blush-400 to-lavender-400'
                          : day.percentage >= 100
                            ? 'bg-gradient-to-t from-sage-400 to-sage-300'
                            : day.percentage >= 50
                              ? 'bg-gradient-to-t from-sage-300 to-sage-200'
                              : 'bg-sage-100'
                      }`}
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {day.percentage > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-sage-600">
                          {day.percentage}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`text-center ${isToday ? 'text-blush-600' : 'text-sage-400'}`}>
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className={`text-lg font-semibold ${isToday ? 'text-blush-500' : 'text-sage-500'}`}>{dayNum}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Habit Breakdown */}
        <section className="card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-medium text-sage-700 mb-4">Habit Breakdown</h2>
          <div className="space-y-3">
            {data.habitBreakdown.map((habit, index) => {
              const percentage = Math.round((habit.completed / habit.total) * 100);

              return (
                <div key={habit.habit_id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-lg">
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-sage-700">{habit.habit_name}</span>
                      <span className="text-xs text-sage-500">{habit.completed}/{habit.total} days</span>
                    </div>
                    <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          percentage >= 85
                            ? 'bg-gradient-to-r from-sage-400 to-sage-500'
                            : percentage >= 50
                              ? 'bg-gradient-to-r from-blush-300 to-blush-400'
                              : 'bg-lavender-300'
                        }`}
                        style={{ width: `${percentage}%`, animationDelay: `${index * 100}ms` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Insights */}
        <section className="card p-5 flex items-start gap-3 bg-gradient-to-r from-blush-50 to-lavender-50 border-blush-200 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <Sparkles className="w-5 h-5 text-blush-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-sage-700 mb-1">Weekly Insight</h3>
            <p className="text-xs text-sage-600">
              {avgCompletion >= 80
                ? "Outstanding week! You're crushing your habits. Keep this momentum going!"
                : avgCompletion >= 50
                  ? `Great progress! Your best day was ${bestDay.percentage}% completion. Aim for consistency!`
                  : "Every small step counts. Focus on just showing up each day!"}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-xs text-blush-300">Small steps lead to big transformations</p>
        </footer>
      </div>
    </div>
  );
}
