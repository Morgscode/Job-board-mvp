import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import userService from '../../services/userService';
import {
  setUsers,
  deleteUser,
  setPage,
  setFirstRow,
  setTotalRecords,
} from '../../store/features/userSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageUploads() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const totalRecords = useSelector((state) => state.users.totalRecords);
  const currentPage = useSelector((state) => state.users.page);
  const firstRow = useSelector((state) => state.users.firstRow);
  const [manageUser, setManageUser] = useManageResource(
    'users',
    'edit',
    deleteUserById
  );

  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getUsers,
    setCurrentPage
  );

  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  useEffect(() => {
    if (loggedInUser.role !== 3) {
      navigate('/dashboard');
    }
  }, [loggedInUser]);

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getUsers(params) {
    try {
      setLoading(true);
      const { users, totalRecords } = await userService.index(
        `page=${params.page}&limit=${params.rows}`
      );
      if (users instanceof Array) {
        dispatch(setUsers(users));
        dispatch(setTotalRecords(totalRecords));
        setRequestSuccess(true);
      }
    } catch (error) {
      setRequestSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const users = useSelector((state) => state.users.data);
  useEffect(() => {
    if (users.length === 0 && !requestSuccess) {
      getUsers(lazyParams);
    }
  }, [users, requestSuccess, lazyParams]);

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

  function formatRegisteredDate(data) {
    return moment(data.createdAt).format('DD-MM-YYYY')
  }

  const columns = [
    { field: 'title', header: 'Title', filter: true },
    { field: 'first_name', header: 'First name', filter: true },
    { field: 'surname', header: 'Last name', filter: true },
    { field: 'email', header: 'Email address', filter: true },
    { field: 'createdAt', header: 'Registered date', filter: true, body: formatRegisteredDate },
  ];

  const dataColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} filter={col.filter} header={col.header} body={col.body} />;
  });

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <Lister
        resourceName="Users"
        data={users}
        dataColumns={dataColumns}
        manage={setManageUser}
        selectedResources={selectedUsers}
        setSelectedResources={setSelectedUsers}
        params={lazyParams}
        setParams={setLazyParams}
        loading={loading}
        totalRecords={totalRecords}
        setFirst={setFirst}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageUploads;
