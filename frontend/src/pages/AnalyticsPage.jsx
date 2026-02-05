import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProjects } from '../redux/slices/projectSlice';
import AnalyticsDashboard from '../components/analytics/Dashboard';
import Loader from '../components/common/Loader';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading analytics…" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track your team's performance and insights</p>
      </div>
      <AnalyticsDashboard projects={projects || []} />
    </div>
  );
};

export default AnalyticsPage;