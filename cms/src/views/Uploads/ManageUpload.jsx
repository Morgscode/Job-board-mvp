import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import userService from '../../services/userService';
import uploadService from '../../services/uploadService';
import { upload as uploadSchema, user as userSchema } from '../../utils/schema';
import UploadDetails from '../../components/uploads/UploadDetails';
import UserDetails from '../../components/users/UserDetails';
import FileDownload from '../../components/uploads/FileDownload';

function ManageUpload(props) {
  const { id } = useParams();
  const toast = useRef(null);

  const [fetchedUpload, setFetchedUpload] = useState(false);
  const [upload, setUpload] = useState({ ...uploadSchema });
  useEffect(() => {
    async function getUser(user_id) {
      const user = await userService.find(user_id);
      if (!user) {
        getUser(user_id);
      }
      setUser(user);
      setFetchedUser(true);
    }
    async function getUpload(id) {
      const upload = await uploadService.find(id);
      if (!upload) {
        getUpload(id);
      }
      setUpload(upload);
      setFetchedUpload(true);
    }
    if (!fetchedUpload) {
      getUpload(id);
    }
  }, [fetchedUpload, upload]);

  const [fecthedUser, setFetchedUser] = useState(false);
  const [user, setUser] = useState({ ...userSchema });
  useEffect(() => {
    async function getUser(user_id) {
      const user = await userService.find(user_id);
      if (!user) {
        getUser(user_id);
      }
      setUser(user);
      setFetchedUser(true);
    }
    if (fetchedUpload && !fecthedUser) {
      getUser(upload.user_id);
    }
  }, [fetchedUpload, fecthedUser, upload, user]);

  return (
    <div>
      <h1 className="font-normal">Manage upload</h1>
      <form className="flex w-full p-6 border-solid border-round border-1 border-gray-50 flex-column shadow-1">
        <h3 className="mb-6 font-normal">Upload details</h3>
        <FileDownload file={upload} />
        <UploadDetails upload={upload} disabled />
        <h3 className="mb-6 font-normal">User details</h3>
        <UserDetails user={user} disabled />
      </form>
      <Toast ref={toast} />
    </div>
  );
}

export default ManageUpload;
