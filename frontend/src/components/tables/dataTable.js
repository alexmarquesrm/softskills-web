import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';
import { Search, Download, RefreshCw, Filter } from 'react-feather';
import "./dataTable.css";

export default function DataTable({ columns, rows, title = "Data Table", onExport = null }) {
  // Custom theme with dark blue color scheme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1a4b8b',
        light: '#2c7abe',
        dark: '#0d3168',
      },
      secondary: {
        main: '#2c7abe',
        light: '#4a9de3',
        dark: '#164178',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#555555',
      },
      divider: '#f0f0f0',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      h6: {
        fontWeight: 700,
        fontSize: '1.25rem',
      },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '6px',
            fontWeight: 500,
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #1a4b8b, #2c7abe)',
            boxShadow: '0 4px 10px rgba(26, 75, 139, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #164178, #246aa6)',
              boxShadow: '0 6px 12px rgba(26, 75, 139, 0.3)',
            },
          },
        },
      },
    },
  });

  // Enhanced column styling
  const styledColumns = columns.map(column => ({
    ...column,
    headerClassName: 'data-grid-header',
    flex: column.flex || 1,
    minWidth: column.minWidth || 150,
    renderHeader: (params) => (
      <div className="header-cell-content">
        <span>{params.colDef.headerName}</span>
        {params.field !== 'actions' && <div className="header-cell-divider"></div>}
      </div>
    ),
  }));

  return (
    <div className="data-table-wrapper">
      <ThemeProvider theme={theme}>
        <Box className="data-table-header">
          <Typography variant="h6" className="data-table-title">{title}</Typography>
          <Box className="data-table-actions">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
            <Button 
              variant="outlined" 
              startIcon={<Filter size={16} />}
              className="action-button filter-button"
            >
              Filter
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<RefreshCw size={16} />}
              className="action-button refresh-button"
            >
              Refresh
            </Button>
            {onExport && (
              <Button 
                variant="contained" 
                startIcon={<Download size={16} />}
                onClick={onExport}
                className="action-button export-button"
              >
                Export
              </Button>
            )}
          </Box>
        </Box>

        <div className="data-grid-container">
          <DataGrid
            rows={rows}
            columns={styledColumns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 15 } },
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 15, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            className="data-grid"
            getRowClassName={(params) => `data-grid-row ${params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'}`}
            getCellClassName={() => 'data-grid-cell'}
            autoHeight={false}
            density="standard"
          />
        </div>
      </ThemeProvider>
    </div>
  );
}