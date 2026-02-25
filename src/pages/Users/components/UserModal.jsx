import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Overlay, ModalContainer, Form, FormGroup, ButtonGroup, Button, CheckboxGroup, Select, ProfessionalSection } from './styles';
import api from '../../../services/api';

const UserModal = ({ isOpen, onClose, userToEdit, onSuccess }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    is_profissional: false,
    perfil_id: '', // Adicionado
    operadoras: [],
  });

  const [proData, setProData] = useState({
    registry_type: 'CRM',
    registry_number: '',
    especiality_id: '',
  });

  const [specialties, setSpecialties] = useState([]);
  const [operadorasList, setOperadorasList] = useState([]);
  const [perfisList, setPerfisList] = useState([]); // Adicionado

  useEffect(() => {
    async function loadData() {
      try {
        const [specsRes, opsRes, perfisRes] = await Promise.all([
          api.get('/specialities'),
          api.get('/operadoras'),
          api.get('/perfis') // Busca os perfis
        ]);

     
        setSpecialties(specsRes.data);
        setOperadorasList(opsRes.data);
        setPerfisList(perfisRes.data);
      } catch (err) {
        console.error("Falha ao carregar dados auxiliares", err);
      }
    }
    if (isOpen) loadData();
  }, [isOpen]);

  useEffect(() => {
    if (userToEdit) {
      setUserData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        is_admin: userToEdit.is_admin || false,
        is_profissional: userToEdit.is_profissional || false,
        perfil_id: userToEdit.perfil_id || '', // Preenche o perfil
        operadoras: userToEdit.operadoras ? userToEdit.operadoras.map(op => op.id) : []
      });

      // Se ele for profissional, preenche os dados. userToEdit.professional vem do backend agora
      if (userToEdit.is_profissional && userToEdit.professional) {
        setProData({
          registry_type: userToEdit.professional.registry_type || 'CRM',
          registry_number: userToEdit.professional.registry_number || '',
          especiality_id: userToEdit.professional.especiality_id || '',
        });
      } else {
        setProData({ registry_type: 'CRM', registry_number: '', especiality_id: '' });
      }

    } else {
      setUserData({ name: '', email: '', password: '', is_admin: false, is_profissional: false, perfil_id: '', operadoras: [] });
      setProData({ registry_type: 'CRM', registry_number: '', especiality_id: '' });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOperadoraToggle = (operadoraId) => {
    setUserData(prev => {
      const isSelected = prev.operadoras.includes(operadoraId);
      if (isSelected) {
        return { ...prev, operadoras: prev.operadoras.filter(id => id !== operadoraId) };
      } else {
        return { ...prev, operadoras: [...prev.operadoras, operadoraId] };
      }
    });
  };

  const handleProChange = (e) => {
    setProData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.perfil_id) {
      return toast.warning("Por favor, selecione um Perfil de Acesso.");
    }

    try {
      // Monta o payload único para enviar pro backend
      const payload = {
        ...userData,
        professional_data: userData.is_profissional ? {
          registry_type: proData.registry_type,
          registry_number: proData.registry_number,
          especiality_id: Number(proData.especiality_id)
        } : null
      };

      if (userToEdit) {
        await api.put(`/users/${userToEdit.id}`, payload);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        if (!userData.password || userData.password.length < 6) {
          return toast.error("Senha deve ter no mínimo 6 caracteres.");
        }
        await api.post('/users', payload);
        toast.success('Usuário criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao salvar dados.';
      toast.error(message);
    }
  };

  return (
    <Overlay>
      <ModalContainer style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        
        <Form onSubmit={handleSubmit}>
          {/* PERFIL DE ACESSO */}
          <FormGroup>
            <label style={{ fontWeight: 'bold' }}>Perfil de Acesso (Grupo)</label>
            <Select name="perfil_id" value={userData.perfil_id} onChange={handleUserChange} required>
              <option value="">Selecione um perfil...</option>
              {perfisList.map(perfil => (
                <option key={perfil.id} value={perfil.id}>{perfil.nome}</option>
              ))}
            </Select>
          </FormGroup>

          {/* Dados Básicos */}
          <FormGroup>
            <label>Nome Completo</label>
            <input name="name" value={userData.name} onChange={handleUserChange} required />
          </FormGroup>

          <FormGroup>
            <label>E-mail</label>
            <input type="email" name="email" value={userData.email} onChange={handleUserChange} required />
          </FormGroup>

          {!userToEdit && (
            <FormGroup>
              <label>Senha</label>
              <input type="password" name="password" value={userData.password} onChange={handleUserChange} required minLength={6} />
            </FormGroup>
          )}

          {/* Área de Operadoras */}
          <FormGroup>
            <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              Acesso às Operadoras
            </label>
            <CheckboxGroup style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {operadorasList.map(op => (
                <label key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={userData.operadoras.includes(op.id)}
                    onChange={() => handleOperadoraToggle(op.id)}
                  />
                  {op.nome}
                </label>
              ))}
            </CheckboxGroup>
          </FormGroup>

          {/* Permissões */}
          <FormGroup>
             <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
              Status / Tipo
            </label>
            <CheckboxGroup>
              <label>
                <input 
                  type="checkbox" 
                  name="is_admin" 
                  checked={userData.is_admin} 
                  onChange={handleUserChange} 
                />
                Administrador
              </label>

              <label>
                <input 
                  type="checkbox" 
                  name="is_profissional" 
                  checked={userData.is_profissional} 
                  onChange={handleUserChange} 
                />
                É um Profissional de Saúde?
              </label>
            </CheckboxGroup>
          </FormGroup>

          {/* Área Condicional: Dados Profissionais */}
          {userData.is_profissional && (
            <ProfessionalSection style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
              <h4>Dados do Registro Profissional</h4>
              
              <FormGroup>
                <label>Tipo de Registro</label>
                <Select name="registry_type" value={proData.registry_type} onChange={handleProChange}>
                  <option value="CRM">CRM (Médico)</option>
                  <option value="COREN">COREN (Enfermagem)</option>
                  <option value="CRN">CRN (Nutrição)</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label>Número do Registro</label>
                <input 
                  name="registry_number" 
                  value={proData.registry_number} 
                  onChange={handleProChange} 
                  placeholder="Ex: 12345-MG"
                  required={userData.is_profissional} 
                />
              </FormGroup>

              <FormGroup>
                <label>Especialidade</label>
                <Select 
                  name="especiality_id" 
                  value={proData.especiality_id} 
                  onChange={handleProChange}
                  required={userData.is_profissional}
                >
                  <option value="">Selecione uma especialidade</option>
                  {specialties.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </Select>
              </FormGroup>
            </ProfessionalSection>
          )}

          <ButtonGroup style={{ marginTop: '20px' }}>
            <Button type="button" className="cancel" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="save">Salvar</Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
}

export default UserModal;