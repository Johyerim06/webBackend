import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl};
`;

const ContentCard = styled.div`
  background-color: ${colors.background};
  border-radius: 16px;
  padding: ${spacing['4xl']};
  box-shadow: ${shadows.xl};
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing['2xl']};
`;

const LinkSection = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

const LinkLabel = styled.label`
  display: block;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
  text-align: left;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
`;

const LinkInput = styled.input`
  flex: 1;
  padding: ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: ${typography.fontSize.base};
  background-color: ${colors.background};
  color: ${colors.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const CopyButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 8px;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const HomeButton = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const MeetingCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingData, setMeetingData] = useState<any>(null);

  useEffect(() => {
    // location.state에서 데이터 가져오기
    if (location.state) {
      const originalLink = location.state.meetingLink || '';
      // 링크를 /meeting/join으로 변경
      const joinLink = originalLink.replace('/schedule/setup', '/meeting/join');
      setMeetingLink(joinLink);
      setMeetingData(location.state.meetingData || null);
    }
  }, [location.state]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('복사 실패:', error);
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = meetingLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <ContentCard>
        <Title>모임 설정이 완료되었어요</Title>
        <Subtitle>팀원, 친구들에게 링크를 공유해주세요</Subtitle>
        
        <LinkSection>
          <LinkLabel>링크 주소</LinkLabel>
          <LinkContainer>
            <LinkInput
              type="text"
              value={meetingLink}
              readOnly
              placeholder="링크가 생성되지 않았습니다"
            />
            <CopyButton onClick={handleCopyLink}>
              복사하기
            </CopyButton>
          </LinkContainer>
        </LinkSection>

        <HomeButton onClick={handleGoHome}>
          홈화면으로 돌아가기
        </HomeButton>
      </ContentCard>
    </PageContainer>
  );
};

export default MeetingCompletePage;
