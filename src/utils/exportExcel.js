// src/utils/exportExcel.js
import ExcelJS from "exceljs";
import logoBranca from "../assets/logo_branca_excel.png"; 

export const exportToXLSX = async (data, columns, filename, reportTitle) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Relatório");

  const THEME_TEAL = "FF1A968D"; 
  const THEME_RED = "FFE83B3E";  
  const THEME_DARK = "FF333333"; 

  const TITLE_FONT = { name: "Arial", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
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

  // --- CONFIGURAÇÃO DO CABEÇALHO COM LOGO ---
  
  // 1. Aumentamos a altura da linha 1 para caber a logo confortavelmente
  ws.getRow(1).height = 40; 

  // 2. Mesclar as células para o título centralizado
  ws.mergeCells(1, 1, 1, excelColumns.length);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = reportTitle.toUpperCase();
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.font = TITLE_FONT;
  
  // <-- ALTERAÇÃO AQUI: Trocando THEME_TEAL por THEME_DARK
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME_DARK } };
  titleCell.border = THIN_BORDER;

  // 3. Inserção da Logo na Extrema Esquerda
  try {
    const response = await fetch(logoBranca);
    const imageBuffer = await response.arrayBuffer();

    const imageId = wb.addImage({
      buffer: imageBuffer,
      extension: "png",
    });

    // Adiciona a imagem posicionada na célula A1 (extrema esquerda)
    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.1 }, // Um pequeno offset para não colar na borda
      ext: { width: 140, height: 55 }, // Ajuste o tamanho conforme sua logo
      editAs: 'absolute'  
    });
  } catch (error) {
    console.warn("Aviso: Não foi possível carregar a logo no cabeçalho.", error);
  }

  // --- RESTANTE DO CORPO DO RELATÓRIO ---

  // Cabeçalhos das Colunas (Linha 2)
  const headerRow = ws.getRow(2);
  headerRow.values = excelColumns.map((c) => c.header);
  headerRow.eachCell((cell) => {
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: THEME_RED } };
    cell.border = THIN_BORDER;
  });
  ws.getRow(2).height = 20;

  // Inserção dos Dados
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

  // Exportação
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