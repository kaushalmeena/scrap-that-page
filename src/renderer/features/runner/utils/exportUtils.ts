import type { TableData } from "../types";

// Quote a CSV field only when it contains a delimiter, quote, or newline,
// escaping embedded quotes by doubling them (RFC 4180).
const escapeCSVField = (value: string) =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const convertToCSV = (data: TableData) => {
  const toRow = (cells: string[]) =>
    data.cols.map((_, colIdx) => escapeCSVField(cells[colIdx] || "")).join(",");

  const header = data.cols.map(escapeCSVField).join(",");
  const body = data.rows.map(toRow);
  return [header, ...body].join("\r\n");
};

const convertToJSON = (data: TableData) => {
  const array = [];
  let result = "";
  for (let i = 0; i < data.rows.length; i += 1) {
    const row: Record<string, string> = {};
    for (let j = 0; j < data.cols.length; j += 1) {
      row[data.cols[j]] = data.rows[i][j] || "";
    }
    array.push(row);
  }
  result = JSON.stringify(array, null, 2);
  return result;
};

const saveFile = (
  data: string | ArrayBuffer,
  extension = "txt",
  type = "text/plain"
) => {
  const blob = new Blob([data], { type });
  const href = window.URL.createObjectURL(blob);
  const anchorEl = document.createElement("a");
  anchorEl.download = `output.${extension}`;
  anchorEl.href = href;
  anchorEl.click();
  window.URL.revokeObjectURL(href);
};

export const downloadAsCSV = (data: TableData) => {
  const csvString = convertToCSV(data);
  saveFile(csvString, "csv", "text/csv");
};

export const downloadAsJSON = (data: TableData) => {
  const jsonString = convertToJSON(data);
  saveFile(jsonString, "json", "application/json");
};

// ExcelJS is large, so it is only loaded the first time someone exports XLSX.
export const downloadAsXLSX = async (data: TableData): Promise<void> => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Results");
  sheet.addRow(data.cols);
  sheet.getRow(1).font = { bold: true };
  for (const row of data.rows) {
    sheet.addRow(data.cols.map((_, i) => row[i] ?? ""));
  }
  const buffer = await workbook.xlsx.writeBuffer();
  saveFile(
    buffer,
    "xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
};

export const copyTableToClipboard = async (data: TableData): Promise<void> => {
  const toRow = (cells: string[]) =>
    data.cols.map((_, colIdx) => cells[colIdx] || "").join("\t");
  const tsv = [data.cols.join("\t"), ...data.rows.map(toRow)].join("\n");
  await navigator.clipboard.writeText(tsv);
};
