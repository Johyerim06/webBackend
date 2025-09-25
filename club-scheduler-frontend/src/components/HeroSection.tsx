import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const HeroContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing['4xl']} ${spacing.xl};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing['4xl']};
  align-items: center;
  min-height: 70vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${spacing['2xl']};
    padding: ${spacing['2xl']} ${spacing.lg};
    text-align: center;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const MainHeadline = styled.h1`
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize['5xl']};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.korean};
  line-height: ${typography.lineHeight.tight};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${typography.fontSize['4xl']};
  }

  @media (max-width: 480px) {
    font-size: ${typography.fontSize['3xl']};
  }
`;

const SubDescription = styled.p`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.relaxed};
  margin: 0;
  max-width: 500px;

  @media (max-width: 768px) {
    font-size: ${typography.fontSize.base};
    max-width: none;
  }
`;

const CTAButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing.lg} ${spacing.xl};
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  align-self: flex-start;
  box-shadow: ${shadows.md};

  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const ArrowIcon = styled.span`
  font-size: ${typography.fontSize.xl};
  transition: transform 0.2s ease;
  
  ${CTAButton}:hover & {
    transform: translateX(4px);
  }
`;

const VisualSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const BrowserMockup = styled.div`
  width: 400px;
  height: 250px;
  background-color: ${colors.background};
  border-radius: 12px;
  box-shadow: ${shadows.xl};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    width: 300px;
    height: 200px;
  }
`;

const BrowserHeader = styled.div`
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  padding: 0 ${spacing.md};
  gap: ${spacing.sm};
`;

const BrowserButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const BrowserAddressBar = styled.div`
  flex: 1;
  height: 24px;
  background-color: ${colors.background};
  border-radius: 6px;
  margin: 0 ${spacing.md};
  display: flex;
  align-items: center;
  padding: 0 ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.textSecondary};
`;

const BrowserContent = styled.div`
  height: calc(100% - 40px);
  background-color: ${colors.background};
  border-radius: 0 0 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textLight};
  font-size: ${typography.fontSize.sm};
`;

const PhoneMockup = styled.div`
  width: 120px;
  height: 200px;
  background-color: ${colors.background};
  border-radius: 20px;
  box-shadow: ${shadows.xl};
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textLight};
  font-size: ${typography.fontSize.sm};

  @media (max-width: 768px) {
    width: 100px;
    height: 160px;
    top: 10px;
    right: 10px;
  }
`;

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateMeeting = () => {
    // 새로운 모임 설정 페이지로 이동
    navigate('/meeting/setup');
  };

  return (
    <HeroContainer>
      <ContentSection>
        <MainHeadline>
          친구, 팀원들과의 모임<br />
          우리밋(ur meet)에서 정해보세요!
        </MainHeadline>
        
        <SubDescription>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
        </SubDescription>
        
        <CTAButton onClick={handleCreateMeeting}>
          모임 만들기
          <ArrowIcon>→</ArrowIcon>
        </CTAButton>
      </ContentSection>
      
      <VisualSection>
        <BrowserMockup>
          <BrowserHeader>
            <BrowserButton color="#FF5F57" />
            <BrowserButton color="#FFBD2E" />
            <BrowserButton color="#28CA42" />
            <BrowserAddressBar>thedesignership.com</BrowserAddressBar>
          </BrowserHeader>
          <BrowserContent>
            웹 브라우저
          </BrowserContent>
        </BrowserMockup>
        
        <PhoneMockup>
          모바일 앱
        </PhoneMockup>
      </VisualSection>
    </HeroContainer>
  );
};

export default HeroSection;
