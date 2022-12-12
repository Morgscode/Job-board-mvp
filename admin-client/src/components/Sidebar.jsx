import { useSelector } from 'react-redux';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate} from 'react-router-dom';

function Sidebar(props) {
  const user = useSelector((state) => state.user.details);
  const navigate = useNavigate();

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => navigate(`/dashboard`),
    },
    {
      label: 'Jobs',
      icon: 'pi pi-bars',
      command: () => navigate(`/jobs`),
    },
    {
      label: 'Job Applications',
      icon: 'pi pi-file',
      command: () => navigate(`/job-applications`),
    },
    {
      label: 'Job Locations',
      icon: 'pi pi-map-marker',
      command: () => navigate(`/job-locations`),
    },
    {
      label: 'Job Categories',
      icon: 'pi pi-tag',
      command: () => navigate(`/job-categories`),
    },
    {
      label: 'Uploads',
      icon: 'pi pi-file-import',
      command: () => navigate(`/uplaods`),
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      command: () => navigate(`/users`),
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: props.logout,
    },
  ];

  return <MegaMenu className="h-full w-full" model={items} orientation="vertical" />;
}

export default Sidebar;
