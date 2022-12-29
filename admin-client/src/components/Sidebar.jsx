import { useSelector } from 'react-redux';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate } from 'react-router-dom';

function Sidebar(props) {
  const user = useSelector((state) => state.auth.loggedInUser);
  const navigate = useNavigate();

  const manageResourceItems = (resource) => [
    [
      {
        label: `Manage ${resource}`,
        items: [
          {
            label: 'View all',
            icon: 'pi pi-table',
            command: () => navigate(`${resource}`),
          },
          {
            label: 'Add new',
            icon: 'pi pi-plus',
            command: () => navigate(`/${resource}/create`),
          },
        ],
      },
    ],
  ];

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => navigate(`/dashboard`),
    },
    {
      label: 'Job Applications',
      icon: 'pi pi-file',
      command: () => navigate(`/job-applications`),
    },
    {
      label: 'Jobs',
      icon: 'pi pi-bars',
      items: manageResourceItems('jobs'),
    },
    {
      label: 'Job Locations',
      icon: 'pi pi-map-marker',
      items: manageResourceItems('locations'),
    },
    {
      label: 'Job Categories',
      icon: 'pi pi-tag',
      items: manageResourceItems('job-categories'),
    },
   
  ];

  const recruiterItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => navigate(`/dashboard`),
    },
    {
      label: 'Job Applications',
      icon: 'pi pi-file',
      command: () => navigate(`/job-applications`),
    },
    {
      label: 'Jobs',
      icon: 'pi pi-bars',
      items: manageResourceItems('jobs'),
    },
    {
      label: 'Job Locations',
      icon: 'pi pi-map-marker',
      items: manageResourceItems('locations'),
    },
    {
      label: 'Job Categories',
      icon: 'pi pi-tag',
      items: manageResourceItems('job-categories'),
    },
  ];

  const adminItems = [
    {
      label: 'Uploads',
      icon: 'pi pi-file-import',
      items: manageResourceItems('uploads'),
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      items: manageResourceItems('users'),
    },
  ];

  const logout = {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: props.logout,
  };

  function sidebarModel() {
    let items = [...recruiterItems];
    console.log(user);
    if (user.role === 3) {
      items = [...items, ...adminItems];
    }
    items.push(logout);
    console.log(items);
    return items;
  }

  return (
    <MegaMenu className="h-full w-full" model={sidebarModel()} orientation="vertical" />
  );
}

export default Sidebar;
