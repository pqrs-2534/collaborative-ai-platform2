import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiFolder, FiTrendingUp, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { getProjects, createProject } from '../redux/slices/projectSlice';
import { openModal } from '../redux/slices/uiSlice';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import { formatRelativeTime } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state) => state.projects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(newProject));
    if (result.type === 'projects/create/fulfilled') {
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: FiFolder, color: 'text-primary-600' },
    { label: 'Active Tasks', value: '24', icon: FiCheckCircle, color: 'text-secondary-600' },
    { label: 'Team Members', value: '12', icon: FiUsers, color: 'text-purple-600' },
    { label: 'Completion Rate', value: '87%', icon: FiTrendingUp, color: 'text-yellow-600' },
  ];

  if (loading && !projects.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FiPlus /> New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
        
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project._id} 
                hover
                onClick={() => navigate(`/projects/${project._id}`)}
                className="cursor-pointer"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, idx) => (
                      <Avatar 
                        key={idx} 
                        src={member.user?.avatar} 
                        name={member.user?.name} 
                        size="sm"
                      />
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(project.updatedAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first project</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus /> Create Project
            </Button>
          </Card>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            placeholder="Enter project name"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;