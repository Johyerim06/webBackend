import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/design-tokens';
import HeroSection from '../components/HeroSection';

const HomeContainer = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection />
    </HomeContainer>
  );
};

export default HomePage;
