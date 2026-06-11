import React, { memo } from 'react';
import { exportToXLSX } from '../../../utils/exportExcel';
import { ChartHeader } from '../styles';
import ButtonExcelExport from '../../../components/Buttons/ExportButtons';

const HistoricoTrocaTable = ({ tableData, reportData }) => {
  const handleExport = () => {
    const columns = [
      { header: 'ID Paciente', key: 'paciente_id', width: 15 },
      { header: 'Nome Paciente', key: 'nome_paciente', width: 35 },
      { header: 'Operadora', key: 'operadora', width: 20 },
      { header: 'Med. Antigo', key: 'medicamento_antigo', width: 30 },
      { header: 'Med. Novo', key: 'medicamento_novo', width: 30 },
      { header: 'Data da Troca', key: 'data_troca', width: 15 },
    ];
    exportToXLSX(reportData, columns, 'Relatorio_Troca_Medicamentos', 'Histórico de Trocas');
  };

  return (
    <>
      <ChartHeader>
        <h3>Histórico de Troca de Medicamentos</h3>
        <ButtonExcelExport onExport={handleExport} />
      </ChartHeader>

      <div style={{ overflowX: 'auto', marginTop: '1rem', maxHeight: '300px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>Paciente</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>Operadora</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>Med. Antigo</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>Med. Novo</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {tableData && tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', color: '#4b5563' }}>{row.nome_paciente}</td>
                  <td style={{ padding: '12px', color: '#4b5563' }}>{row.operadora}</td>
                  <td style={{ padding: '12px', color: '#ef4444' }}>{row.medicamento_antigo}</td>
                  <td style={{ padding: '12px', color: '#10b981' }}>{row.medicamento_novo}</td>
                  <td style={{ padding: '12px', color: '#4b5563' }}>{row.data_troca}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                  Nenhuma troca de medicamento registrada neste período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(HistoricoTrocaTable);