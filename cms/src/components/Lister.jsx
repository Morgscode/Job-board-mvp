import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function Lister(props) {
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

  const onPage = (event) => {
    event.page += 1;
    props.setFirst(event.first);
    props.setParams(event);
  };

  const header = (
    <React.Fragment>
      <div className="flex justify-content-between align-items-center">
        <h2 className="m-0">Mange {props.resourceName}</h2>
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
    <div className="w-full card">
      <DataTable
        value={props.data}
        lazy
        paginator
        first={props.params.first}
        totalRecords={props.totalRecords}
        rows={props.params.rows}
        onPage={onPage}
        dataKey="id"
        filters={filters}
        header={header}
        loading={props.loading}
        globalFilterFields={['name']}
        responsiveLayout="scroll"
        rowHover
        selection={props.selectedResources}
        onSelectionChange={(e) => props.setSelectedResources(e.value)}
        emptyMessage="No entries found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        {props.dataColumns}
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

export default Lister;
