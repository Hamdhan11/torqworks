import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  filterKey,
  filterOptions = [],
  onRowClick,
  actions,
  title
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter dropdown check
      if (filterKey && selectedFilter !== 'ALL') {
        if (item[filterKey] !== selectedFilter) return false;
      }
      // Search term check across all object values
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return Object.values(item).some(val => 
        String(val || '').toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, selectedFilter, filterKey]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(row => {
      return columns.map(c => {
        const val = typeof c.accessor === 'function' ? c.accessor(row) : row[c.accessor];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title || 'export'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sap-card overflow-hidden">
      {/* Table Header Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {title && <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-wide">{title}</h3>}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            {filteredData.length} records
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Dropdown */}
          {filterKey && filterOptions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFilter}
                onChange={(e) => { setSelectedFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs px-2.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="sap-table-header">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row._id || row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`sap-table-row ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {col.render 
                        ? col.render(row) 
                        : typeof col.accessor === 'function' 
                        ? col.accessor(row) 
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 text-xs">
                  No records match the current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
