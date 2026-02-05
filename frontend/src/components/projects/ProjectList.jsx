import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiFolder } from 'react-icons/fi';
import { getProjects } from '../../redux/slices/projectSlice';
import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size="md" text="Loading projects…" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FiFolder size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No projects yet. Create one from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <ProjectCard key={p._id} project={p} />
      ))}
    </div>
  );
};

export default ProjectList;