import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card, CardHeader } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  mockImpactStats,
  mockMonthlyStats,
  mockTopDonors,
  mockTopNgos,
  mockRecentActivity,
} from '../mock/stats';
import { statsService } from '../services/statsService';
import { ImpactStats, TopDonor, TopNgo, RecentActivity, AiMatchingStats } from '../types/stats';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import {
  Utensils,
  Package,
  Leaf,
  Users,
  TrendingUp,
  Activity,
  Brain,
  Sparkles,
} from 'lucide-react';

export const Impact: React.FC = () => {
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [topNgos, setTopNgos] = useState<TopNgo[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [aiStats, setAiStats] = useState<AiMatchingStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [impact, donors, ngos, activity, ai] = await Promise.all([
          statsService.getImpact(),
          statsService.getTopDonors(),
          statsService.getTopNgos(),
          statsService.getRecentActivity(),
          statsService.getAiMatching(),
        ]);
        setImpactStats(impact);
        setTopDonors(donors);
        setTopNgos(ngos);
        setRecentActivity(activity);
        setAiStats(ai);
      } catch {
        // Unauthenticated or API down — use mock data for demo
      }
    };
    load();
  }, []);

  const stats = impactStats || mockImpactStats;
  const donors = topDonors.length > 0 ? topDonors : mockTopDonors;
  const ngos = topNgos.length > 0 ? topNgos : mockTopNgos;
  const activity = recentActivity.length > 0 ? recentActivity : mockRecentActivity;
  const isLiveData = !!impactStats;

  const maxMonthlyDonations = Math.max(
    ...mockMonthlyStats.map((m) => m.donations)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
                <p className="text-gray-500 mt-2">
                  See the collective impact of the FeedLink AI community
                </p>
              </div>
              <Badge variant={isLiveData ? 'success' : 'info'} size="md">
                {isLiveData ? (
                  <><Sparkles size={12} className="mr-1" /> Live Data</>
                ) : (
                  'Demo Data'
                )}
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Donations"
              value={stats.totalDonations.toLocaleString()}
              icon={<Package size={24} />}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Meals Provided"
              value={stats.totalMealsProvided.toLocaleString()}
              icon={<Utensils size={24} />}
              trend={{ value: 22, isPositive: true }}
            />
            <StatCard
              title="Food Redistributed"
              value={`${(stats.totalKgRedistributed / 1000).toFixed(1)}t`}
              icon={<TrendingUp size={24} />}
              trend={{ value: 18, isPositive: true }}
            />
            <StatCard
              title="CO2 Saved"
              value={`${(stats.totalCO2Saved / 1000).toFixed(1)}t`}
              icon={<Leaf size={24} />}
              trend={{ value: 20, isPositive: true }}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Active Donors"
              value={stats.activeDonors}
              icon={<Users size={24} />}
              subtitle="Registered"
            />
            <StatCard
              title="Active NGOs"
              value={stats.activeNgos}
              icon={<Users size={24} />}
              subtitle="Partnered"
            />
            <StatCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={<Activity size={24} />}
              subtitle="Donation to delivery"
            />
            <StatCard
              title="AI Match Score"
              value={`${aiStats?.avgMatchScore ?? 0}/100`}
              icon={<Brain size={24} />}
              subtitle={`${aiStats?.totalMatches ?? 0} AI matches`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Chart (Bar representation) */}
            <Card className="lg:col-span-2">
              <CardHeader title="Monthly Donations" subtitle="Last 6 months" />
              <div className="space-y-4">
                {mockMonthlyStats.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 w-10">
                      {month.month}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-6 bg-primary-500 rounded-md transition-all duration-500"
                          style={{
                            width: `${(month.donations / maxMonthlyDonations) * 100}%`,
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {month.donations}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {mockMonthlyStats.reduce((a, m) => a + m.donations, 0)}
                  </p>
                  <p className="text-xs text-gray-500">Total Donations</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {mockMonthlyStats
                      .reduce((a, m) => a + m.mealsProvided, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Meals Provided</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {(
                      mockMonthlyStats.reduce((a, m) => a + m.kgRedistributed, 0) / 1000
                    ).toFixed(1)}
                    t
                  </p>
                  <p className="text-xs text-gray-500">Redistributed</p>
                </div>
              </div>
            </Card>

            {/* Completion Breakdown */}
            <Card>
              <CardHeader title="Completion Breakdown" />
              <div className="space-y-5">
                <ProgressBar label="Successful" value={94.5} variant="success" />
                <ProgressBar label="In Progress" value={3.5} variant="primary" />
                <ProgressBar label="Expired" value={1.2} variant="warning" />
                <ProgressBar label="Cancelled" value={0.8} variant="danger" />
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-medium text-primary-800">
                  Food Waste Prevented
                </p>
                <p className="text-2xl font-bold text-primary-700 mt-1">
                  {(stats.totalKgRedistributed / 1000).toFixed(1)} tonnes
                </p>
                <p className="text-xs text-primary-600 mt-1">
                  Equivalent to {stats.totalMealsProvided.toLocaleString()} meals
                </p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Donors */}
            <Card>
              <CardHeader title="Top Donors" subtitle="Leading contributors this quarter" />
              <div className="space-y-4">
                {donors.map((donor, i) => (
                  <div
                    key={donor.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-gray-300 w-6">
                      {i + 1}
                    </span>
                    <Avatar name={donor.name} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{donor.name}</p>
                      <p className="text-sm text-gray-500">{donor.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {donor.totalDonations}
                      </p>
                      <p className="text-xs text-gray-500">donations</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top NGOs */}
            <Card>
              <CardHeader title="Top NGOs" subtitle="Most active receivers" />
              <div className="space-y-4">
                {ngos.map((ngo, i) => (
                  <div
                    key={ngo.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-gray-300 w-6">
                      {i + 1}
                    </span>
                    <Avatar name={ngo.name} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ngo.name}</p>
                      <p className="text-sm text-gray-500">
                        {ngo.totalPeopleServed.toLocaleString()} served
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{ngo.totalClaimed}</p>
                      <p className="text-xs text-gray-500">claims</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader title="Recent Platform Activity" />
            <div className="space-y-3">
              {activity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      act.type === 'donation'
                        ? 'bg-primary-100 text-primary-700'
                        : act.type === 'claim'
                        ? 'bg-blue-100 text-blue-700'
                        : act.type === 'pickup'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {act.type[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{act.description}</p>
                    <p className="text-xs text-gray-500">{act.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
