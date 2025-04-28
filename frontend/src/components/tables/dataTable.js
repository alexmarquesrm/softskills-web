import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import './dataTable.css';

export default function DataTable({ columns, rows, pageSize = 10, title = "Data Table", showSearch = true, theme = "light", selectable = false, onRowSelect, emptyStateMessage = "No data found", headerActions })
{
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // filtro de pesquisa
  const filteredRows = [...rows].filter(row => {
    if (!searchQuery) return true;
    
    // pesquisa em todas as colunas
    return columns.some(column => {
      if (column.searchable === false) return false;
      const value = row[column.field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
    
    const isNumeric = !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));
    
    if (isNumeric) {
      return sortDirection === 'asc' 
        ? parseFloat(aValue) - parseFloat(bValue) 
        : parseFloat(bValue) - parseFloat(aValue);
    }
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderCellContent = (row, column) => {
    if (column.renderCell) {
      return column.renderCell({ row, selectedRows });
    }
    
    if (column.type === 'status') {
      return (
        <Badge bg={getStatusColor(row[column.field])}>
          {row[column.field]}
        </Badge>
      );
    }
    
    if (column.type === 'date' && row[column.field]) {
      return formatDate(row[column.field]);
    }
    
    return row[column.field] ?? column.emptyValue ?? '-';
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusColor = (status) => {
    if (!status) return 'secondary';
    
    const statusLower = String(status).toLowerCase();
    
    if (['active', 'aprovado', 'concluído', 'success'].includes(statusLower)) return 'success';
    if (['pending', 'pendente', 'em análise', 'warning'].includes(statusLower)) return 'warning';
    if (['inactive', 'cancelled', 'cancelado', 'error'].includes(statusLower)) return 'danger';
    if (['em progresso', 'processing'].includes(statusLower)) return 'info';
    
    return 'secondary';
  };

  const handleRowSelect = (row) => {
    const rowId = row.id || row.key;
    setSelectedRows(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      } else {
        if (onRowSelect) onRowSelect(row);
        return [...prev, rowId];
      }
    });
  };

  const renderPaginationItems = () => {
    let items = [];
    
    items.push(
      <Pagination.Item 
        key="prev" 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="prev-page"
      >
        <ChevronLeft />
      </Pagination.Item>
    );
    
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
    
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>1</Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }
      items.push(
        <Pagination.Item 
          key={totalPages} 
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    items.push(
      <Pagination.Item 
        key="next" 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="next-page"
      >
        <ChevronRight />
      </Pagination.Item>
    );
    
    return items;
  };

  return (
    <div className={`bootstrap-data-table-container ${theme}-theme`}>
      <div className="table-header">
        <div className="d-flex align-items-center gap-3">
          <h5 className="table-title mb-0">{title}</h5>
          {/* Place the action button right after the title */}
          {headerActions && (
            <div className="header-action-button">
              {headerActions}
            </div>
          )}
        </div>
        
        {showSearch && (
          <div className="table-search-wrapper">
            <InputGroup className="table-search">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                aria-label="Search table" 
              />
              {searchQuery && ( 
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchQuery('')} 
                  className="clear-search"
                >
                  ×
                </Button>
              )}
            </InputGroup>
          </div>
        )}
      </div>
      
      <div className="table-responsive">
        <Table hover className="bootstrap-data-table">
          <thead>
            <tr>
              {selectable && (
                <th className="selection-column" style={{ width: '40px' }}>
                </th>
              )}
              {columns.map((column) => (
                <th 
                  key={column.field} 
                  className={` 
                    ${column.headerAlign || 'center'}-aligned
                    ${column.sortable !== false ? 'sortable-header' : ''}
                  `}
                  style={{ 
                    width: column.width || 'auto',
                    minWidth: column.minWidth || 'auto'
                  }}
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                >
                  <div className="header-content">
                    <span>{column.headerName}</span>
                    {sortField === column.field ? (
                      <span className="sort-icon active">
                        {sortDirection === 'asc' ? <ArrowUp /> : <ArrowDown />}
                      </span>
                    ) : column.sortable !== false ? (
                      <span className="sort-icon">
                        <ArrowUp />
                      </span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => {
                const rowId = row.id || row.key;
                const isSelected = selectedRows.includes(rowId);
                
                return (
                  <tr 
                    key={rowId} 
                    className={isSelected ? 'selected-row' : ''}
                    onClick={() => selectable && handleRowSelect(row)}
                    style={selectable ? { cursor: 'pointer' } : {}}
                  >
                    {selectable && (
                      <td className="selection-column">
                        <Form.Check type="checkbox" checked={isSelected} onChange={() => {}} onClick={(e) => e.stopPropagation()} aria-label="Select row" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td 
                        key={`${rowId}-${column.field}`} 
                        className={`${column.align || 'center'}-aligned ${column.type || ''}`} >
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td 
                  colSpan={selectable ? columns.length + 1 : columns.length} 
                  className="empty-state" >
                  {emptyStateMessage}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      
      <div className="table-footer">
        <div className="pagination-info">
          {sortedRows.length > 0 ? (
            <>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedRows.length)} of {sortedRows.length} entries
              {searchQuery && 
               filteredRows.length !== rows.length && 
               ` (filtered from ${rows.length} total entries)`}
            </>
          ) : (
            `No entries found${searchQuery ? ' matching search criteria' : ''}`
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mb-0">
            {renderPaginationItems()}
          </Pagination>
        )}
      </div>
    </div>
  );
}