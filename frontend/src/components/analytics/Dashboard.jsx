import React from 'react';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import Card from '../common/Card';
import ProgressChart from './ProgressChart';
import ActivityChart from './ActivityChart';

const AnalyticsDashboard = ({ projects = [], activityData = [] }) => {
  /* ─── derive metrics ─── */
  const totalTasks     = projects.reduce((s, p) => s + (p.taskCount || 0), 0);
  const uniqueMembers  = [...new Set(projects.flatMap((p) => (p.members || []).map((m) => m.user?._id)))].length;
  const avgCompletion  = projects.length
    ? Math.round(
        projects.reduce((s, p) => {
          const t = p.taskCount || 1;
          return s + ((p.completedTaskCount || 0) / t) * 100;
        }, 0) / projects.length
      )
    : 0;

  const metrics = [
    { label: 'Total Projects',  value: projects.length, icon: FiTrendingUp,  color: 'text-primary-600',  bg: 'bg-primary-50' },
    { label: 'Total Tasks',     value: totalTasks,      icon: FiCheckCircle, color: 'text-green-600',    bg: 'bg-green-50' },
    { label: 'Team Members',    value: uniqueMembers,   icon: FiUsers,       color: 'text-purple-600',   bg: 'bg-purple-50' },
    { label: 'Avg Completion',  value: `${avgCompletion}%`, icon: FiClock,   color: 'text-yellow-600',   bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{m.label}</p>
                <p className="text-xl font-bold text-gray-900">{m.value}</p>
              </div>
              <div className={`w-10 h-10 ${m.bg} rounded-xl flex items-center justify-center ${m.color}`}>
                <m.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Project Progress">
          <ProgressChart projects={projects} />
        </Card>
        <Card title="Weekly Activity">
          <ActivityChart activityData={activityData} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;