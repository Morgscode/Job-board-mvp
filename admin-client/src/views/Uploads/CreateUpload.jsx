import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import uploadService from '../../services/uploadService';
import FileUploader from '../../components/uploads/FileUploader';

function CreateUpload(props) {
  const toast = useRef(null);

  async function uploadFile(file){
    console.log(file);
  }

  return (
    <FileUploader upload={uploadFile} />
  );
}

export default CreateUpload;
