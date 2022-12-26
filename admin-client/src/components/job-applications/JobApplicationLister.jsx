import React, { useState } from 'react';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function JobApplicationLister(props) {
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

  const header = (
    <React.Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2 className="m-0">Mange job applications</h2>
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

  const formatApplicationDate = (options) => moment(options.createdAt).format('L') 

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
        value={props.applications}
        selection={props.selectedApplications}
        onSelectionChange={e => props.setSelectedApplications(e.value)}
        filters={filters}
        header={header}
        className="w-full p-datatable-customers"
        globalFilterFields={['id']}
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        paginator
        rowHover
        emptyMessage="No job categories found."
      >
        <Column selectionMode="multiple" selectionAriaLabel="id" headerStyle={{ width: '3em' }}></Column>
        <Column field="job_id" header="Job Title"></Column>
        <Column field="job_application_status_id" header="Status"></Column>
        <Column field="user_id" header="Applicant"></Column>
        <Column field="createdAt" header="Application date" body={formatApplicationDate}></Column>
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

export default JobApplicationLister;
