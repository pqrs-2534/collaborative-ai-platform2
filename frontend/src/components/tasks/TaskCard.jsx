import React from 'react';
import { FiUser, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import { PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/helpers';

const TaskCard = ({ task, onClick, provided, snapshot }) => {
  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      onClick={() => onClick && onClick(task)}
      className={`
        bg-white border border-gray-200 rounded-lg p-3.5 cursor-pointer
        hover:shadow-md hover:border-primary-200 transition-all duration-150
        ${snapshot?.isDragging ? 'shadow-lg scale-[1.02] border-primary-400' : ''}
        ${overdue ? 'border-l-[3px] border-l-red-500' : ''}
      `}
    >
      {/* Title */}
      <p className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</p>

      {/* Description snippet */}
      {task.description && (
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
          {task.priority}
        </span>
        {(task.tags || []).map((tag, i) => (
          <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between mt-3">
        {task.assignee ? (
          <Avatar name={task.assignee?.name} size="xs" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <FiUser size={10} className="text-gray-400" />
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
            {overdue && <FiAlertCircle size={11} />}
            <FiCalendar size={11} />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;