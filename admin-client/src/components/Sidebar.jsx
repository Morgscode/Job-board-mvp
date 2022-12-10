import { useSelector } from 'react-redux';
import { MegaMenu } from 'primereact/megamenu';

function Sidebar(props) {
  const user = useSelector((state) => state.user.details);
  const items = [
    {
      label: 'Jobs',
      icon: 'pi pi-bars',
    },
    {
      label: 'Job Applications',
      icon: 'pi pi-file',
    },
    {
      label: 'Job Locations',
      icon: 'pi pi-map-marker',
    },
    {
      label: 'Job Categories',
      icon: 'pi pi-tag',
    },
    {
      label: 'Uploads',
      icon: 'pi pi-file-import',
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: props.logout,
    },
  ];

  return <MegaMenu className="h-full" model={items} orientation="vertical" />;
}

export default Sidebar;
