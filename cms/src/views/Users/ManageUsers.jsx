import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { setUsers, deleteUser } from '../../store/features/userSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import UserLister from '../../components/users/UserLister';
import useManageResource from '../../utils/manageResource';

function ManageUploads() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  useEffect(() => {
    if (loggedInUser.role !== 3) {
      navigate('/dashboard');
    }
  }, [loggedInUser]);

  const users = useSelector((state) => state.users.data);
  useEffect(() => {
    async function getUsers() {
      try {
        const users = await userService.index();
        if (users instanceof Array) {
          dispatch(setUsers(users));
        }
        setRequestSuccess(true);
      } catch (error) {
        setRequestSuccess(false);
        console.error(error);
      }
    }
    if (users.length === 0 && !requestSuccess) {
      getUsers();
    }
  }, [users, requestSuccess]);

  const uploads = useSelector((state) => state.uploads.data);
  useEffect(() => {
    async function getUploads() {}
    if (uploads.length === 0 && !requestSuccess) {
      getUploads();
    }
  }, [uploads, requestSuccess]);

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

  const [manageUser, setManageUser] = useManageResource(
    'users',
    'edit',
    deleteUserById
  );

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
