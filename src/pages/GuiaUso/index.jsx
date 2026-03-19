import React, { useState } from 'react';
import { 
  LuBookOpen, 
  LuUsers, 
  LuUserPlus, 
  LuMonitorPlay 
} from "react-icons/lu";

import {
  Container,
  Header,
  TabContainer,
  TabButton,
  ContentBox,
  ManualSectionTitle,
  ManualSubTitle,
  ManualParagraph,
  ManualHighlight,
  ManualImageContainer
} from './styles';

import manualData from './manualData.json';

// Mapeamento de ícones baseado na string salva no JSON
const IconMap = {
  LuBookOpen: <LuBookOpen size={18} style={{ marginRight: '8px' }} />,
  LuUsers: <LuUsers size={18} style={{ marginRight: '8px' }} />,
  LuUserPlus: <LuUserPlus size={18} style={{ marginRight: '8px' }} />,
  LuMonitorPlay: <LuMonitorPlay size={18} style={{ marginRight: '8px' }} />
};

export default function ManualPage() {
  // Define a primeira aba como ativa por padrão
  const [activeTab, setActiveTab] = useState(manualData[0].id);

  // Filtra o conteúdo da aba selecionada
  const activeSection = manualData.find(section => section.id === activeTab);

  return (
    <Container>
      <Header>
        <h1>Manual de Uso do Sistema</h1>
      </Header>

      <TabContainer>
        {manualData.map((section) => (
          <TabButton
            key={section.id}
            active={activeTab === section.id}
            onClick={() => setActiveTab(section.id)}
          >
            {IconMap[section.icon]}
            {section.title}
          </TabButton>
        ))}
      </TabContainer>

      <ContentBox>
        <ManualSectionTitle>{activeSection.title}</ManualSectionTitle>
        
        {activeSection.content.map((item, index) => {
          switch (item.type) {
            case 'text':
              return <ManualParagraph key={index}>{item.value}</ManualParagraph>;
            
            case 'title':
              return <ManualSubTitle key={index}>{item.value}</ManualSubTitle>;
            
            case 'highlight':
              return <ManualHighlight key={index}>{item.value}</ManualHighlight>;
            
            case 'image':
              return (
                <ManualImageContainer key={index}>
                  {/* Como as imagens estão em /public, o src nativo já resolve o caminho */}
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <span>{item.alt}</span>
                </ManualImageContainer>
              );
            
            default:
              return null;
          }
        })}
      </ContentBox>
    </Container>
  );
}