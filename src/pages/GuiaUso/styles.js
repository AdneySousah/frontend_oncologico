import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background || theme.colors.inputBg || '#f4f6f8'};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text}; 
    font-size: 1.8rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 1rem;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? '#ffffff' : theme.colors.text};
  padding: 0.8rem 1.5rem;
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primaryHover || theme.colors.primary : theme.colors.inputBg};
  }
`;

export const ContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid ${({ theme }) => theme.colors.border}; 
`;

/* --- ESTILOS ESPECÍFICOS DO MANUAL --- */

export const ManualSectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

export const ManualSubTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`;

export const ManualParagraph = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1.2rem;
  font-size: 1rem;
`;

export const ManualHighlight = styled.div`
  background-color: ${({ theme }) => theme.colors.primary}15;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 4px 4px 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  line-height: 1.5;
`;

export const ManualImageContainer = styled.div`
  margin: 2rem 0;
  text-align: center;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  span {
    display: block;
    margin-top: 0.8rem;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textLight};
    font-style: italic;
  }
`;