import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function ExportToExcel({ apiData }) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const cleanData = (data) => {
    return data.map(item => {
      const cleanedItem = { ...item };
      for (let key in cleanedItem) {
        if (typeof cleanedItem[key] === 'string') {
          cleanedItem[key] = cleanedItem[key].replace(/<[^>]+>/g, '');
        }
      }
      return cleanedItem;
    });
  }

  const exportToCSV = (apiData, fileName) => {
    const cleanedData = cleanData(apiData);
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button onClick={(e) => exportToCSV(apiData, 'filename')}>
      Export to Excel
    </button>
  );
}

export default ExportToExcel;
