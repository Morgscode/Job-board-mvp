import React, { useState } from 'react';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import FileDownload from '../../components/uploads/FileDownload';

function JobLister(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState(''); 
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  function formatUploadDate(data) {
    return moment(data.createdAt).format('DD-MM-YYYY H:M:SS')
  }

  const header = (
    <React.Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2 className="m-0">Mange uploads</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </React.Fragment>
  );

  const downloadTemplate = (options) => {
    return (
      <FileDownload file={options} buttonOnly />
    );
  }

  const updateTemplate = (options) => {
    return (
      <Button
        type="button"
        className="p-button-info"
        icon="pi pi-cog"
        onClick={(e) => props.manage({ action: 'edit', data: options })}
      ></Button>
    );
  };

  const deleteTemplate = (options) => {
    return (
      <Button
        type="button"
        className="p-button-danger"
        icon="pi pi-trash"
        onClick={(e) => props.manage({ action: 'delete', data: options })}
      ></Button>
    );
  };

  return (
    <div className="card w-full">
      <DataTable
        value={props.uploads}
        selection={props.selectedUploads}
        onSelectionChange={e => props.setSelectedUploads(e.value)}
        filters={filters}
        header={header}
        className="w-full p-datatable-customers"
        globalFilterFields={['title', 'mimetype']}
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 20]}
        paginator
        rowHover
        emptyMessage="No uploads found..."
      >
        <Column selectionMode="multiple" selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column>
        <Column field="title" filter header="Upload Title"></Column>
        <Column field="mimetype" filter header="Filetype"></Column>
        <Column field="createdAt" filter header="Upload date" body={formatUploadDate}></Column>
        <Column
          headerStyle={{ width: '4rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
          body={downloadTemplate}
        />
        <Column
          headerStyle={{ width: '4rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
          body={updateTemplate}
        />
        <Column
          headerStyle={{ width: '4rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
          body={deleteTemplate}
        />
      </DataTable>
    </div>
  );
}

export default JobLister;
