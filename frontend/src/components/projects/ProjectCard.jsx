import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiClock } from 'react-icons/fi';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/helpers';

const statusVariant = {
  planning: 'default',
  active: 'success',
  on_hold: 'warning',
  completed: 'info',
  archived: 'danger',
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer
                 hover:shadow-lg hover:border-primary-300 transition-all duration-200
                 flex flex-col gap-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <FiFolder size={20} className="text-primary-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{project.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Badge variant={statusVariant[project.status] || 'default'} size="sm">
          {(project.status || 'active').replace('_', ' ')}
        </Badge>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="flex -space-x-2">
          {(project.members || []).slice(0, 4).map((m, i) => (
            <Avatar key={i} name={m.user?.name} size="xs" />
          ))}
          {(project.members || []).length > 4 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white
                            flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">
                +{project.members.length - 4}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <FiClock size={11} />
          {formatRelativeTime(project.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;