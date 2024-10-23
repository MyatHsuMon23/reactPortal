import * as XLSX from 'xlsx';

export const ExportToExcel = (data: any[] = [], fileName: string, headers: any[], pageLimit?: number) => {
    data = data?.map((item: any, idx: any) => ({ id: idx + 1, ...item }))
    // Map the data to an array of objects with the desired headers
    const mappedData = data.map(row => {
        let obj: { [key: string]: any } = {};
        headers.forEach((header: any) => {
            if (header.field === "IS_ACTIVE") {
                obj[header.headerName] = row[header.field] == "1" ? "Yes" : "No";
            }
            else {
                obj[header.headerName] = row[header.field];
            }
        });
        return obj;
    });

    // Convert the mapped data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(mappedData);

    // Create a new workbook and append the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}