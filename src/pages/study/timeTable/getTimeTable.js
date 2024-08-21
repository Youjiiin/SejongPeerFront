// utils/getTimeTable.js
import readXlsxFile from 'read-excel-file';

const getTimeTable = async () => {
  try {
    const response = await fetch('/TimeTable.xlsx');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const rows = await readXlsxFile(arrayBuffer);

    const tableInfos = rows.slice(1).map(row => row);
    const filteredInfos=[...tableInfos];
    const showData = Array.from(
      new Set(
        rows
          .slice(1)
          .map(row => row[1])
          .filter(Boolean)
      )
    );

    return {
      tableInfos,
      filteredInfos,
      showData,
    };
  } catch (error) {
    console.error('Error reading the Excel file:', error);
    return {
      tableInfos: [],
      filteredInfos:[],
      showData: [],
    };
  }
};

export default getTimeTable;
