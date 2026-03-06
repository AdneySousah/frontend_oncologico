import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useTheme } from 'styled-components'; // Adicionado para puxar as cores do seu tema
import api from '../../../services/api';
import { FormContainer, InputGroup, Button } from './styles';
import { getCustomSelectStyles } from '../../../utils/selectStyles';

export default function MedicoForm({ onSuccess }) {
    const theme = useTheme(); // Puxa o tema atual (dark/light)
    const [nome, setNome] = useState('');
    const [crm, setCrm] = useState('');
    const [prestadoresOptions, setPrestadoresOptions] = useState([]); // Opções formatadas para o Select
    const [prestadoresSelecionados, setPrestadoresSelecionados] = useState([]); // Tags selecionadas

    useEffect(() => {
        async function loadPrestadores() {
            try {
                const response = await api.get('/prestadores-medicos'); 
                
                // O react-select exige que os dados tenham esse formato: { value: id, label: nome }
                const optionsFormatadas = response.data.map(prestador => ({
                    value: prestador.id,
                    label: prestador.nome
                }));
                
                setPrestadoresOptions(optionsFormatadas);
            } catch (error) {
                toast.error('Erro ao carregar locais de atendimento.');
            }
        }
        loadPrestadores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !crm || prestadoresSelecionados.length === 0) {
            toast.warning('Preencha nome, CRM e selecione pelo menos um local.');
            return;
        }

        try {
            // Extrai apenas os IDs (value) das opções selecionadas para enviar para sua API
            const idsPrestadores = prestadoresSelecionados.map(option => option.value);

            await api.post('/medicos', {
                nome,
                crm,
                prestadores: idsPrestadores
            });

            toast.success('Médico cadastrado com sucesso!');
            setNome('');
            setCrm('');
            setPrestadoresSelecionados([]);
            
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
                <Select
                    isMulti
                    name="prestadores"
                    options={prestadoresOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Selecione um ou mais locais..."
                    value={prestadoresSelecionados}
                    onChange={setPrestadoresSelecionados}
                    styles={getCustomSelectStyles(theme)} // Passa o tema para customizar os estilos
                    noOptionsMessage={() => "Nenhum local encontrado"}
                />
            </InputGroup>

            <Button type="submit">Salvar Médico</Button>
        </FormContainer>
    );
}