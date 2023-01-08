import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import userService from '../../services/userService';
import { user as userSchema } from '../../utils/schema';
import { addUser } from '../../store/features/userSlice';
import { Toast } from 'primereact/toast';
import UserForm from '../../components/users/UserForm';

function CreateUser() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function createUser(submit) {
    try {
      setLoading(true);
      const user = await userService.create(user);
      dispatch(addUser(user));
      toast.current.show({
        severity: 'success',
        summary: 'User created',
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem creating that user',
      });
    } finally {
      setLoading(false);
    }
    const user = await userService.create(submit);
    dispatch(addUser(user));
  }

  return (
    <div>
      <UserForm
        formData={{ ...userSchema }}
        submit={createUser}
        loading={loading}
        reset={true}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateUser;
