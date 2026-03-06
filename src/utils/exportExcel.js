// src/utils/exportExcel.js
import ExcelJS from "exceljs";

export const exportToXLSX = async (data, columns, filename, reportTitle) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Relatório");

  const TITLE_YELLOW = "FFFF00"; 
  const HEADER_GRAY = "3B4651"; 
  const HEADER_FONT = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } }; 
  const CELL_FONT = { name: "Arial", size: 10, color: { argb: "FF000000" } }; 
  const THIN_BORDER = {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  };

  const excelColumns = columns.map(col => ({
    header: col.header.toUpperCase(),
    key: col.key,
    width: col.width || 20,
  }));
  ws.columns = excelColumns;

  ws.mergeCells(1, 1, 1, excelColumns.length);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = reportTitle.toUpperCase();
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.font = { name: "Arial", size: 12, bold: true, color: { argb: "FF000000" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TITLE_YELLOW } };
  titleCell.border = THIN_BORDER;
  ws.getRow(1).height = 20;

  const headerRow = ws.getRow(2);
  headerRow.values = excelColumns.map((c) => c.header);
  headerRow.eachCell((cell) => {
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_GRAY } };
    cell.border = THIN_BORDER;
  });
  ws.getRow(2).height = 18;

  data.forEach((item) => {
    const row = ws.addRow(item);
    row.eachCell((cell) => {
      cell.font = CELL_FONT;
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = THIN_BORDER;
    });
    row.height = 16;
  });

  ws.views = [{ state: "frozen", ySplit: 2 }];

  try {
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao exportar para XLSX:", error);
    alert("Erro ao gerar o arquivo Excel.");
  }
};