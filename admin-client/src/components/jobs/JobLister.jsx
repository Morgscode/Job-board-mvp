import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function JobLister(props) {
  const [selectedJobs, setSelectedJobs] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    status: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  function formatCreatedDate(data) {
    return moment(data.createdAt).format('L');
  }

  function formateDeadline(data) {
    return moment(data.deadline).format('L');
  }

  const header = (
    <React.Fragment>
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">Mange all jobs</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    </React.Fragment>
  );

  const updateTemplate = (options) => {
    return <Button type="button" className="p-button-info"  icon="pi pi-cog" onClick={(e) => props.manage({action: 'edit', data: options})}></Button>;
  }

  const deleteTemplate = (options) => {
    return <Button type="button" className="p-button-danger" icon="pi pi-trash" onClick={(e) => props.manage({action: 'delete', data: options})}></Button>;
  }

  return (
    <div className="card w-full">
      <DataTable
        selection={selectedJobs}
        header={header}
        className="w-full p-datatable-customers"
        value={props.jobs}
        responsiveLayout="scroll"
        rowsPerPageOptions={[10,25,50]}
        rowHover
      >
        <Column field="title" header="Title"></Column>
        <Column
          field="createdAt"
          header="Created"
          body={formatCreatedDate}
        ></Column>
        <Column
          field="deadline"
          header="Closing date"
          body={formateDeadline}
        ></Column>
        <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={updateTemplate} />
        <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={deleteTemplate} />
      </DataTable>
    </div>
  );
}

export default JobLister;
