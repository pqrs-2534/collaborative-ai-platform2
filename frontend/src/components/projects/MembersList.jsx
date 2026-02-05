import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiTrash2, FiMail } from 'react-icons/fi';
import { addMember } from '../../redux/slices/projectSlice';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const roleVariant = {
  owner: 'primary',
  project_manager: 'info',
  team_member: 'default',
  guest: 'warning',
};

const MembersList = ({ projectId }) => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.projects);
  const members = currentProject?.members || [];

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('team_member');

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    await dispatch(addMember({ projectId, userId: inviteEmail, role: inviteRole }));
    setInviteEmail('');
    setShowInvite(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Members ({members.length})
        </h3>
        <Button size="sm" variant="outline" onClick={() => setShowInvite(true)}>
          <FiPlus size={14} /> Invite
        </Button>
      </div>

      {/* List */}
      <div className="space-y-1">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar name={m.user?.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-800">{m.user?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{m.user?.email || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={roleVariant[m.role] || 'default'} size="sm">
                {(m.role || '').replace('_', ' ')}
              </Badge>
              {m.role !== 'owner' && (
                <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Member">
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Email or User ID"
            name="inviteEmail"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="user@example.com"
            icon={<FiMail />}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="team_member">Team Member</option>
              <option value="project_manager">Project Manager</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersList;