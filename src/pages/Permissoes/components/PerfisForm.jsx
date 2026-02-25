import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; 
import { toast } from 'react-toastify';
import { Form, FormGroup, ButtonGroup, Button, Table } from '../styles';

// Lista de todos os módulos que mapeamos nas rotas
const modulosSistema = [
    { key: 'usuarios', label: 'Usuários e Perfis' },
    { key: 'profissionais', label: 'Profissionais' },
    { key: 'especialidades', label: 'Especialidades' },
    { key: 'operadoras', label: 'Operadoras' },
    { key: 'pacientes', label: 'Pacientes' },
    { key: 'prestadores_medicos', label: 'Hospitais / Prestadores' },
    { key: 'diagnosticos', label: 'Diagnósticos (CID)' },
    { key: 'exames', label: 'Exames' },
    { key: 'comorbidades', label: 'Comorbidades' },
    { key: 'entrevistas_medicas', label: 'Entrevistas Médicas' },
    { key: 'avaliacoes', label: 'Questionários e Avaliações' },
    { key: 'medicos', label: 'Médicos' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'termos', label: 'Termos de Aceite' },
    { key: 'telemonitoramento', label: 'Telemonitoramento' },
    { key: 'reacao_adversa', label: 'Reação Adversa' },
    { key: 'dashboard', label: 'Dashboard' }

];

export default function PerfisForm({ perfilToEdit, onSuccess, onCancel }) {
  
  // Gera um objeto padrão com tudo false para não dar erro se o JSON vier vazio
  const defaultPermissoes = modulosSistema.reduce((acc, modulo) => {
      acc[modulo.key] = { acessar: false, editar: false, excluir: false };
      return acc;
  }, {});

  const [formData, setFormData] = useState({
    nome: '',
    permissoes: defaultPermissoes
  });

  useEffect(() => {
    if (perfilToEdit) {
      setFormData({
        nome: perfilToEdit.nome || '',
        // Mescla as permissões padrão com as que vieram do banco
        permissoes: { ...defaultPermissoes, ...(perfilToEdit.permissoes || {}) }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfilToEdit]);

  const handleTextChange = (e) => {
    setFormData(prev => ({ ...prev, nome: e.target.value }));
  };

  // Função para ligar/desligar uma chavinha específica na tabela
  const handleTogglePermissao = (moduloKey, acao) => {
    setFormData(prev => {
      const permissoesAtuais = prev.permissoes[moduloKey] || {};
      return {
        ...prev,
        permissoes: {
          ...prev.permissoes,
          [moduloKey]: {
            ...permissoesAtuais,
            [acao]: !permissoesAtuais[acao]
          }
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (perfilToEdit) {
        await api.put(`/perfis/${perfilToEdit.id}`, formData);
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await api.post('/perfis', formData);
        toast.success("Perfil criado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao salvar perfil";
      toast.error(errorMsg);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '10px', color: '#555' }}>
        {perfilToEdit ? `Editando Perfil: ${perfilToEdit.nome}` : 'Novo Perfil de Acesso'}
      </h3>

      <FormGroup style={{ width: '50%' }}>
        <label>Nome do Perfil (Ex: Médico, Enfermeiro, Recepção)</label>
        <input 
            name="nome" 
            value={formData.nome} 
            onChange={handleTextChange} 
            required 
            placeholder="Digite o nome do perfil"
        />
      </FormGroup>

      <div style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
            <thead>
                <tr>
                    <th>Módulo do Sistema</th>
                    <th style={{ textAlign: 'center' }}>Acessar (Ler)</th>
                    <th style={{ textAlign: 'center' }}>Editar (Criar/Alterar)</th>
                    <th style={{ textAlign: 'center' }}>Excluir (Deletar)</th>
                </tr>
            </thead>
            <tbody>
                {modulosSistema.map(modulo => {
                    const perm = formData.permissoes[modulo.key] || {};
                    return (
                        <tr key={modulo.key}>
                            <td><strong>{modulo.label}</strong></td>
                            
                            {/* Checkbox Acessar */}
                            <td style={{ textAlign: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    checked={perm.acessar || false}
                                    onChange={() => handleTogglePermissao(modulo.key, 'acessar')}
                                />
                            </td>
                            
                            {/* Checkbox Editar */}
                            <td style={{ textAlign: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    checked={perm.editar || false}
                                    onChange={() => handleTogglePermissao(modulo.key, 'editar')}
                                />
                            </td>

                            {/* Checkbox Excluir */}
                            <td style={{ textAlign: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    checked={perm.excluir || false}
                                    onChange={() => handleTogglePermissao(modulo.key, 'excluir')}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
      </div>

      <ButtonGroup style={{ marginTop: '20px' }}>
        <Button type="button" onClick={onCancel} style={{ background: '#6c757d' }}>Cancelar</Button>
        <Button type="submit">{perfilToEdit ? 'Salvar Alterações' : 'Criar Perfil'}</Button>
      </ButtonGroup>
    </Form>
  );
}