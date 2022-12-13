import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function JobLister(props) {
  function formatActive(data) {
    return data.active === 0 ? 'Closed' : 'Open';
  }

  function formatCreatedDate(data) {
    return moment(data.createdAt).format('L');
  }

  function formateDeadline(data) {
    return moment(data.deadline).format('L');
  }

  return (
    <div className="card w-full">
      <DataTable
        className="w-full"
        value={props.jobs}
        responsiveLayout="scroll"
      >
        <Column field="title" header="Title"></Column>
        <Column field="active" header="Open" body={formatActive}></Column>
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
      </DataTable>
    </div>
  );
}

export default JobLister;
