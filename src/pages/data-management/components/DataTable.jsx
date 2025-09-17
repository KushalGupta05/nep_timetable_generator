import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DataTable = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  onBulkAction,
  searchable = true,
  selectable = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data?.filter(item =>
    Object.values(item)?.some(value =>
      value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData]?.sort((a, b) => {
    if (!sortConfig?.key) return 0;
    
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(paginatedData?.map(item => item?.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows?.filter(rowId => rowId !== id));
    }
  };

  const handleBulkAction = (action) => {
    onBulkAction?.(action, selectedRows);
    setSelectedRows([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          {searchable && (
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Bulk Actions */}
          {selectable && selectedRows?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedRows?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 p-4">
                  <Checkbox
                    checked={selectedRows?.length === paginatedData?.length && paginatedData?.length > 0}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                  />
                </th>
              )}
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className="text-left p-4 text-sm font-medium text-foreground"
                >
                  <button
                    onClick={() => handleSort(column?.key)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    {column?.label}
                    {sortConfig?.key === column?.key && (
                      <Icon
                        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                      />
                    )}
                  </button>
                </th>
              ))}
              <th className="w-32 p-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((item, index) => (
              <tr
                key={item?.id}
                className={`border-t border-border hover:bg-muted/30 transition-colors ${
                  selectedRows?.includes(item?.id) ? 'bg-primary/5' : ''
                }`}
              >
                {selectable && (
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows?.includes(item?.id)}
                      onChange={(e) => handleSelectRow(item?.id, e?.target?.checked)}
                    />
                  </td>
                )}
                {columns?.map((column) => (
                  <td key={column?.key} className="p-4 text-sm text-foreground">
                    {column?.render ? column?.render(item?.[column?.key], item) : item?.[column?.key]}
                  </td>
                ))}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(item)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete?.(item)}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData?.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Database" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No data found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'No records match your search criteria.' : 'No records available.'}
            </p>
          </div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            />
            <span className="text-sm text-foreground px-3 py-1">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;