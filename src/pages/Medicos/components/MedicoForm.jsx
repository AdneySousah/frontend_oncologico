import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { FormContainer, InputGroup, CheckboxGroup, Button } from './styles';

export default function MedicoForm({ onSuccess }) {
    const [nome, setNome] = useState('');
    const [crm, setCrm] = useState('');
    const [prestadores, setPrestadores] = useState([]); // Lista que vem da API
    const [prestadoresSelecionados, setPrestadoresSelecionados] = useState([]); // IDs marcados

    useEffect(() => {
        async function loadPrestadores() {
            try {
                // Supondo que sua rota de listar clínicas se chame /prestadores
                const response = await api.get('/prestadores-medicos'); 
                setPrestadores(response.data);
            } catch (error) {
                toast.error('Erro ao carregar locais de atendimento.');
            }
        }
        loadPrestadores();
    }, []);

    const handleCheckbox = (id) => {
        if (prestadoresSelecionados.includes(id)) {
            setPrestadoresSelecionados(prestadoresSelecionados.filter(item => item !== id));
        } else {
            setPrestadoresSelecionados([...prestadoresSelecionados, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !crm || prestadoresSelecionados.length === 0) {
            toast.warning('Preencha nome, CRM e selecione pelo menos um local.');
            return;
        }

        try {
            await api.post('/medicos', {
                nome,
                crm,
                prestadores: prestadoresSelecionados
            });

            toast.success('Médico cadastrado com sucesso!');
            setNome('');
            setCrm('');
            setPrestadoresSelecionados([]);
            
            // Atualiza a lista na tela principal
            if (onSuccess) onSuccess(); 
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao cadastrar médico.';
            toast.error(msg);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <h3>Cadastrar Novo Médico</h3>
            
            <InputGroup>
                <label>Nome do Médico</label>
                <input 
                    type="text" 
                    placeholder="Ex: Dr. Adney Sousa" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </InputGroup>

            <InputGroup>
                <label>CRM</label>
                <input 
                    type="text" 
                    placeholder="Ex: 12345-MG" 
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                />
            </InputGroup>

            <InputGroup>
                <label>Locais de Atendimento (Prestadores)</label>
                <div className="checkbox-list">
                    {prestadores.map(prestador => (
                        <CheckboxGroup key={prestador.id}>
                            <input 
                                type="checkbox" 
                                id={`prestador-${prestador.id}`}
                                checked={prestadoresSelecionados.includes(prestador.id)}
                                onChange={() => handleCheckbox(prestador.id)}
                            />
                            <label htmlFor={`prestador-${prestador.id}`}>
                                {prestador.nome}
                            </label>
                        </CheckboxGroup>
                    ))}
                </div>
            </InputGroup>

            <Button type="submit">Salvar Médico</Button>
        </FormContainer>
    );
}