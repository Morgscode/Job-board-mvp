import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import userService from '../../services/userService';
import { user as userSchema } from '../../utils/schema';
import { updateUser } from '../../store/features/userSlice';
import { Toast } from 'primereact/toast';
import UserForm from '../../components/users/UserForm';
import useFetchResource from '../../utils/fetchResource';

function CreateUser() {
  const { id } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const resource = useFetchResource(id, userSchema, userService);

  async function updateUserById(submit) {
    setLoading(true);
    try {
      await userService.update(submit, submit.id);
      dispatch(updateUser(submit));
      toast.current.show({
        severity: 'success',
        summary: 'User updated',
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem updating that user',
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1 className="font-normal">Update user</h1>
      <UserForm formData={resource} submit={updateUserById} loading={loading} />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateUser;
