import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({ columns, rows }) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 15 } },
        }}
        pageSizeOptions={[15]}
      />
    </div>
  );
}
