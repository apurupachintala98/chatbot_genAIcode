import React from 'react';
import { HiUpload } from 'react-icons/hi';
import { Button, Typography } from '@mui/material';

function FileUploader({ uploadStatus, setUploadStatus, handleFileUpload, setSelectedFile, fileInputRef }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      setSelectedFile(file);
    } else {
      setUploadStatus('Please select a valid PDF or PPTX file.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.pptx"  // Allow only PDF and PPTX files
          style={{ marginRight: '16px' }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<HiUpload />}
          style={{
            backgroundColor: '#18181a',
            color: 'white',
            padding: '4px 8px',
            fontSize: '11px',
          }}
          onClick={handleFileUpload}
        >
          Upload
        </Button>
      </div>
      {uploadStatus && (
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: '12px', textAlign: 'center' }}
        >
          {uploadStatus}
        </Typography>
      )}
    </div>
  );
}

export default FileUploader;
