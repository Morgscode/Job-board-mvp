import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function JobLister(props) {
  const [selectedJobs, setSelectedJobs] = useState([]);
  useEffect(() => {
    console.log(selectedJobs);
  }, [selectedJobs])

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  useEffect(() => {
    console.log(globalFilterValue);
  }, [globalFilterValue]);
  
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  function formatCreatedDate(data) {
    return moment(data.createdAt).format('DD-MM-YYYY');
  }

  function formateDeadline(data) {
    return moment(data.deadline).format('DD-MM-YYYY');
  }

  function formateActive(data) {
    return data.active== 0 ? 'Hidden' : 'Active';
  }

  const header = (
    <React.Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2 className="m-0">Mange jobs</h2>
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
        value={props.jobs}
        selection={selectedJobs}
        onSelectionChange={e => setSelectedJobs(e.value)}
        filters={filters}
        header={header}
        className="w-full p-datatable-customers"
        globalFilterFields={['title', 'deadline', 'createdAt', 'active']}
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        paginator
        rowHover
        emptyMessage="No jobs found."
      >
        <Column selectionMode="multiple" selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column>
        <Column field="title" filter header="Job Title"></Column>
        <Column field="active" sortable header="Status" body={formateActive}></Column>
        <Column
          field="createdAt"
          sortable 
          header="Created"
          body={formatCreatedDate}
        ></Column>
        <Column
          field="deadline"
          sortable
          header="Closing date"
          body={formateDeadline}
        ></Column>
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
