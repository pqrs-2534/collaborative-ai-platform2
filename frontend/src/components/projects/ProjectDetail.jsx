import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiUsers, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { getProject } from '../../redux/slices/projectSlice';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/helpers';

const statusVariant = {
  planning: 'default',
  active: 'success',
  on_hold: 'warning',
  completed: 'info',
  archived: 'danger',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    if (id) dispatch(getProject(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size="md" text="Loading…" />
      </div>
    );
  }

  if (!currentProject) {
    return <p className="text-sm text-gray-500 text-center py-8">Project not found.</p>;
  }

  return (
    <div className="space-y-5">
      {/* Title row */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{currentProject.name}</h2>
            <Badge variant={statusVariant[currentProject.status] || 'default'}>
              {(currentProject.status || '').replace('_', ' ')}
            </Badge>
          </div>
          {currentProject.description && (
            <p className="text-gray-600 mt-1.5 max-w-2xl">{currentProject.description}</p>
          )}
        </div>
        <button className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
          <FiEdit2 size={15} /> Edit
        </button>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-5 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <FiUsers size={15} />
          {(currentProject.members || []).length} Members
        </div>
        <div className="flex items-center gap-1.5">
          <FiCalendar size={15} />
          Created {formatDate(currentProject.createdAt)}
        </div>
      </div>

      {/* Members preview */}
      {currentProject.members?.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Team</p>
          <div className="flex flex-wrap gap-4">
            {currentProject.members.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar name={m.user?.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;