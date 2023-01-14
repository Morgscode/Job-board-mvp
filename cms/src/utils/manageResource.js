import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useManageResource(
  resource = 'jobs',
  editPath = 'edit',
  deleteResourceById
) {
  const navigate = useNavigate();

  const [manageResource, setManageResource] = useState({
    action: null,
    data: null,
  });
  useEffect(() => {
    if (manageResource.action && manageResource.data) {
      if (manageResource.action === 'edit') {
        navigate(`/${resource}/${manageResource.data.id}/${editPath}`);
      } else if (manageResource.action === 'delete') {
        deleteResourceById(manageResource.data);
      }
    }
    return;
  }, [manageResource]);

  return [manageResource, setManageResource];
}

export default useManageResource;
