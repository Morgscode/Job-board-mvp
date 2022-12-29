import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import {
  setUsers,
  deleteUser,
} from '../../store/features/userSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import UserLister from '../../components/users/UserLister';

function ManageUploads() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  useEffect(() => {
    if (loggedInUser.role !== 3) {
        navigate('/dashboard');
    }
  }, [loggedInUser]);

  const users = useSelector((state) => state.users.data);
  useEffect(() => {
    async function getUsers() {
      const users = await userService.index();
      dispatch(setUsers(users));
    }
    if (users.length === 0) {
      getUsers();
    }
  }, [users]);

  const [manageUser, setManageUser] = useState({
    action: null,
    data: null,
  });
  useEffect(() => {
    async function deleteUserById(user) {
      try {
        await userService.delete(user.id);
        dispatch(deleteUser(user.id));
        toast.current.show({
          severity: 'success',
          summary: 'User deleted',
        });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'There was a problem deleting that user',
        });
      }
    }
    if (manageUser.action && manageUser.data) {
      if (manageUser.action === 'edit') {
        navigate(`/users/${manageUser.data.id}/edit`);
      } else if (manageUser.action === 'delete') {
        deleteUserById(manageUser.data);
      }
    }
    return;
  }, [manageUser]);

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/users/create')}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <UserLister
        users={users}
        manage={setManageUser}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageUploads;
