import styled from 'styled-components';

export const Container = styled.div`
  text-align: left;
  margin: 10px 0;
  width: 100%;
`;

export const Title = styled.h3`
  margin-bottom: 10px;
  color: var(--text-color, #333);
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  margin-bottom: 20px;
  color: #555;
`;

export const Card = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa; /* Fundo leve para destacar */
`;

export const MedName = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #2c3e50;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  color: #444;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

export const InputGroup = styled.div`
  flex: ${props => props.flex || '1'};
  min-width: ${props => props.minWidth || '100px'};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid ${props => (props.error ? '#e74c3c' : '#ccc')};
  font-size: 0.9rem;
  background-color: #fff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const WarningBox = styled.div`
  margin-bottom: 15px;
  padding: 12px;
  background-color: #fff3cd;
  border-radius: 6px;
  border-left: 4px solid #ffc107;

  label {
    color: #856404;
    font-weight: bold;
    margin-bottom: 8px;
    display: block;
  }
`;

export const HelpText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin: 3px 0 8px 0;
`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-size: 0.9rem;
    color: #333;
    font-weight: 500;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 10px;
`;

export const Button = styled.button`
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  flex: 1;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ButtonCancel = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;

  &:hover:not(:disabled) {
    background-color: #e2e6ea;
  }
`;

export const ButtonSubmit = styled(Button)`
  background-color: #28a745; /* Verde de sucesso */
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #218838;
  }
`;