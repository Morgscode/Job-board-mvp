import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function JobLister(props) {
  const [selectedLocations, setSelectedLocations] = useState([]);
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
        <h2 className="m-0">Mange locations</h2>
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
        value={props.locations}
        selection={selectedLocations}
        onSelectionChange={e => setSelectedLocations(e.value)}
        filters={filters}
        header={header}
        className="w-full p-datatable-customers"
        globalFilterFields={['name']}
        responsiveLayout="scroll"
        rows={10}
        rowsPerPageOptions={[10, 20]}
        paginator
        rowHover
        emptyMessage="No locations found."
      >
        <Column selectionMode="multiple" selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column>
        <Column field="name" filter header="Location Name"></Column>
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
