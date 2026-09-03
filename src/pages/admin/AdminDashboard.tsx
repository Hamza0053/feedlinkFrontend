import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import { ImpactStats, TopDonor, TopNgo, RecentActivity, AiMatchingStats } from '../../types/stats';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Package,
  Brain,
  TrendingUp,
  Leaf,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [topNgos, setTopNgos] = useState<TopNgo[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [aiStats, setAiStats] = useState<AiMatchingStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [impact, donors, ngos, activity, aiMatch] = await Promise.all([
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
        setAiStats(aiMatch);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  const activityTypeColors: Record<string, string> = {
    donation: 'bg-primary-100 text-primary-700',
    claim: 'bg-blue-100 text-blue-700',
    pickup: 'bg-amber-100 text-amber-700',
    completion: 'bg-green-100 text-green-700',
  };

  const stats = impactStats || {
    totalUsers: 0,
    activeDonors: 0,
    activeNgos: 0,
    totalDonations: 0,
    completedDonations: 0,
    totalServings: 0,
    totalMealsProvided: 0,
    totalKgRedistributed: 0,
    totalCO2Saved: 0,
    completionRate: 0,
    averageMatchTime: '--',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={24} className="text-primary-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Platform overview and management
          </p>
        </div>
        <Badge variant="info" size="md">
          Administrator
        </Badge>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={24} />}
          subtitle="All registered users"
        />
        <StatCard
          title="Donors"
          value={stats.activeDonors.toLocaleString()}
          icon={<Users size={24} />}
          subtitle="Registered food donors"
        />
        <StatCard
          title="NGOs"
          value={stats.activeNgos.toLocaleString()}
          icon={<Users size={24} />}
          subtitle="Registered receivers"
        />
        <StatCard
          title="Total Donations"
          value={stats.totalDonations.toLocaleString()}
          icon={<Package size={24} />}
          subtitle="All time"
        />
      </div>

      {/* Completed Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Donations"
          value={stats.completedDonations.toLocaleString()}
          icon={<Package size={24} />}
          subtitle={`${stats.completionRate}% completion rate`}
        />
        <StatCard
          title="Servings Rescued"
          value={stats.totalServings.toLocaleString()}
          icon={<TrendingUp size={24} />}
          subtitle="From completed donations"
        />
        <StatCard
          title="Food Rescued"
          value={`${stats.totalKgRedistributed.toLocaleString()} kg`}
          icon={<Leaf size={24} />}
          subtitle="Completed donations"
        />
        <StatCard
          title="AI Match Score"
          value={`${aiStats?.avgMatchScore ?? 0}/100`}
          icon={<Brain size={24} />}
          subtitle={`${aiStats?.totalMatches ?? 0} total matches`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/impact')}>
                View All
              </Button>
            }
          />
          <div className="space-y-3">
            {recentActivity.length === 0 && !statsLoading ? (
              <p className="text-sm text-gray-500 py-4 text-center">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      activityTypeColors[activity.type] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {activity.type[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user} &middot;{' '}
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Performers */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Top Donors" subtitle="By total donations" />
            <div className="space-y-3">
              {topDonors.length === 0 && !statsLoading ? (
                <p className="text-sm text-gray-500 py-4 text-center">No donors yet</p>
              ) : (
                topDonors.map((donor, i) => (
                  <div key={donor.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">
                      #{i + 1}
                    </span>
                    <Avatar name={donor.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {donor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {donor.totalDonations} donations &middot;{' '}
                        {donor.totalKg.toLocaleString()}kg
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Top NGOs" subtitle="By people served" />
            <div className="space-y-3">
              {topNgos.length === 0 && !statsLoading ? (
                <p className="text-sm text-gray-500 py-4 text-center">No NGOs yet</p>
              ) : (
                topNgos.map((ngo, i) => (
                  <div key={ngo.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">
                      #{i + 1}
                    </span>
                    <Avatar name={ngo.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ngo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ngo.totalClaimed} claims &middot;{' '}
                        {ngo.totalPeopleServed.toLocaleString()} served
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader title="Platform Health" />
        <div className="space-y-4">
          <ProgressBar
            label="Completion Rate"
            value={stats.completionRate}
            variant="success"
          />
          <ProgressBar
            label="AI Match Quality"
            value={aiStats?.avgMatchScore ?? 0}
            variant="primary"
          />
          <ProgressBar
            label="AI Explanation Coverage"
            value={aiStats?.aiExplanationRate ?? 0}
            variant="primary"
          />
          <ProgressBar
            label="Successful Match Rate"
            value={
              aiStats && aiStats.totalMatches > 0
                ? Math.round((aiStats.successfulMatches / aiStats.totalMatches) * 100)
                : 0
            }
            variant="success"
          />
        </div>
      </Card>

      {/* AI Matching Intelligence */}
      <Card>
        <CardHeader
          title="AI Matching Intelligence"
          action={
            <Badge variant="primary" size="sm">
              <Sparkles size={12} className="mr-1" /> Gemini Powered
            </Badge>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <Target size={24} className="mx-auto text-primary-600 mb-2" />
            <p className="text-3xl font-bold text-primary-700">
              {aiStats?.totalMatches ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total AI Matches</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <Brain size={24} className="mx-auto text-emerald-600 mb-2" />
            <p className="text-3xl font-bold text-emerald-700">
              {aiStats?.avgMatchScore ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Avg Match Score</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp size={24} className="mx-auto text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-blue-700">
              {aiStats?.successfulMatches ?? 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Successful Matches</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Sparkles size={24} className="mx-auto text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-purple-700">
              {aiStats?.aiExplanationRate ?? 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">AI Explanation Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
