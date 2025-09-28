import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Availability {
  date: string;
  timeSlots: TimeSlot[];
}

interface AvailabilityData {
  _id: string;
  eventId: string;
  eventsID: string;
  eventTitle: string;
  creatorID: string;
  userId: {
    _id: string;
    name?: string;
    username?: string;
    email?: string;
  };
  availability: Availability[];
}

interface HeatmapCell {
  date: string;
  timeSlot: string;
  availableUsers: AvailabilityData[];
  totalUsers: number;
  intensity: number; // 0-1 사이의 값
}

const AvailabilityHeatmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventsID = searchParams.get('eventsID');
  
  const [availabilities, setAvailabilities] = useState<AvailabilityData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState('');

  // 시간 슬롯 생성 (9:00 - 18:00, 30분 단위)
  const timeSlots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // 날짜 배열 생성 (가용시간 데이터에서 추출)
  const [dates, setDates] = useState<string[]>([]);

  const generateDatesFromData = (availabilities: AvailabilityData[]) => {
    const allDates = new Set<string>();
    
    availabilities.forEach(avail => {
      avail.availability.forEach(dateAvail => {
        allDates.add(dateAvail.date);
      });
    });
    
    const sortedDates = Array.from(allDates).sort();
    
    // 최소 7일은 보여주기
    if (sortedDates.length < 7) {
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        if (!allDates.has(dateStr)) {
          sortedDates.push(dateStr);
        }
      }
      sortedDates.sort();
    }
    
    return sortedDates.slice(0, 14); // 최대 2주
  };

  useEffect(() => {
    if (!eventsID) {
      alert('이벤트 ID가 필요합니다.');
      navigate('/');
      return;
    }
    fetchAvailabilities();
  }, [eventsID, navigate]);

  useEffect(() => {
    if (availabilities.length > 0) {
      const extractedDates = generateDatesFromData(availabilities);
      setDates(extractedDates);
    }
  }, [availabilities]);

  const generateHeatmapData = () => {
    const heatmap: HeatmapCell[] = [];
    const totalUsers = availabilities.length;

    dates.forEach(date => {
      timeSlots.forEach(timeSlot => {
        const availableUsers = availabilities.filter(avail => 
          avail.availability.some(dateAvail => 
            dateAvail.date === date && 
            dateAvail.timeSlots.some(slot => slot.startTime === timeSlot)
          )
        );

        const intensity = totalUsers > 0 ? availableUsers.length / totalUsers : 0;

        heatmap.push({
          date,
          timeSlot,
          availableUsers,
          totalUsers,
          intensity
        });
      });
    });

    setHeatmapData(heatmap);
  };

  useEffect(() => {
    if (availabilities.length > 0 && dates.length > 0) {
      generateHeatmapData();
    }
  }, [availabilities, dates]);

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/availability/event/${eventsID}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data.availabilities || []);
        if (data.availabilities && data.availabilities.length > 0) {
          setEventTitle(data.availabilities[0].eventTitle || '모임');
        }
      } else {
        console.error('가용시간 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`;
  };

  const handleCellClick = (cell: HeatmapCell) => {
    setSelectedCell(cell);
  };

  const closeModal = () => {
    setSelectedCell(null);
  };

  if (loading) {
    return <LoadingContainer>가용시간 데이터를 불러오는 중...</LoadingContainer>;
  }

  return (
    <Container>
      <Header>
        <Title>{eventTitle} - 가용시간 히트맵</Title>
        <SubTitle>참여자 {availabilities.length}명의 가용시간을 한눈에 확인하세요</SubTitle>
      </Header>

      <HeatmapContainer>
        <HeatmapGrid dateCount={dates.length}>
          {/* 헤더 - 날짜 */}
          <TimeHeader></TimeHeader>
          {dates.map(date => (
            <DateHeader key={date}>{formatDate(date)}</DateHeader>
          ))}

          {/* 시간별 행 */}
          {timeSlots.map(timeSlot => (
            <React.Fragment key={timeSlot}>
              <TimeLabel>{timeSlot}</TimeLabel>
              {dates.map(date => {
                const cell = heatmapData.find(h => h.date === date && h.timeSlot === timeSlot);
                return (
                  <HeatmapCell
                    key={`${date}-${timeSlot}`}
                    intensity={cell?.intensity || 0}
                    onClick={() => cell && handleCellClick(cell)}
                  >
                    <CellContent>
                      {cell && cell.availableUsers.length > 0 && (
                        <UserCount>{cell.availableUsers.length}/{cell.totalUsers}</UserCount>
                      )}
                    </CellContent>
                  </HeatmapCell>
                );
              })}
            </React.Fragment>
          ))}
        </HeatmapGrid>
      </HeatmapContainer>

      <Legend>
        <LegendTitle>범례</LegendTitle>
        <LegendItems>
          <LegendItem>
            <LegendColor intensity={0} />
            <span>0%</span>
          </LegendItem>
          <LegendItem>
            <LegendColor intensity={0.25} />
            <span>25%</span>
          </LegendItem>
          <LegendItem>
            <LegendColor intensity={0.5} />
            <span>50%</span>
          </LegendItem>
          <LegendItem>
            <LegendColor intensity={0.75} />
            <span>75%</span>
          </LegendItem>
          <LegendItem>
            <LegendColor intensity={1} />
            <span>100%</span>
          </LegendItem>
        </LegendItems>
      </Legend>

      {selectedCell && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {formatDate(selectedCell.date)} {selectedCell.timeSlot}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <AvailabilityInfo>
                <InfoText>
                  가능한 참여자: {selectedCell.availableUsers.length}명 / 전체 {selectedCell.totalUsers}명
                </InfoText>
                <Percentage>
                  ({Math.round(selectedCell.intensity * 100)}%)
                </Percentage>
              </AvailabilityInfo>
              
              <UserLists>
                <UserList>
                  <ListTitle available>✅ 가능한 참여자</ListTitle>
                  {selectedCell.availableUsers.map(user => (
                    <UserItem key={user._id}>
                      {user.userId.name || user.userId.username || '사용자'}
                    </UserItem>
                  ))}
                  {selectedCell.availableUsers.length === 0 && (
                    <EmptyMessage>가능한 참여자가 없습니다.</EmptyMessage>
                  )}
                </UserList>

                <UserList>
                  <ListTitle>❌ 불가능한 참여자</ListTitle>
                  {availabilities
                    .filter(user => !selectedCell.availableUsers.some(au => au._id === user._id))
                    .map(user => (
                      <UserItem key={user._id}>
                        {user.userId.name || user.userId.username || '사용자'}
                      </UserItem>
                    ))}
                </UserList>
              </UserLists>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #666;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: #333333;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333333;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0;
`;

const HeatmapContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow-x: auto;
`;

const HeatmapGrid = styled.div<{ dateCount: number }>`
  display: grid;
  grid-template-columns: 60px repeat(${props => props.dateCount}, 1fr);
  gap: 1px;
  background-color: #e9ecef;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
`;

const TimeHeader = styled.div``;

const DateHeader = styled.div`
  padding: 8px 4px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  background: #f8f9fa;
  color: #495057;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeLabel = styled.div`
  padding: 4px 2px;
  text-align: center;
  font-weight: 500;
  font-size: 11px;
  background: #f8f9fa;
  color: #495057;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeatmapCell = styled.div<{ intensity: number }>`
  min-height: 30px;
  background-color: ${props => getHeatmapColor(props.intensity)};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
`;

const CellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const UserCount = styled.span`
  font-size: 9px;
  font-weight: 600;
  color: #495057;
`;

const Legend = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const LegendTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #495057;
`;

const LegendItems = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6c757d;
`;

const LegendColor = styled.div<{ intensity: number }>`
  width: 20px;
  height: 20px;
  background-color: ${props => getHeatmapColor(props.intensity)};
  border: 1px solid #e9ecef;
  border-radius: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #495057;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #495057;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const AvailabilityInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 4px;
`;

const Percentage = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #28a745;
`;

const UserLists = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const UserList = styled.div``;

const ListTitle = styled.h4<{ available?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.available ? '#28a745' : '#dc3545'};
`;

const UserItem = styled.div`
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 14px;
  color: #495057;
`;

const EmptyMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  font-size: 14px;
`;

// Helper function (moved outside component)
const getHeatmapColor = (intensity: number) => {
  if (intensity === 0) return '#f8f9fa';
  if (intensity <= 0.25) return '#d4edda';
  if (intensity <= 0.5) return '#a3d977';
  if (intensity <= 0.75) return '#7bc96f';
  return '#28a745';
};

export default AvailabilityHeatmapPage;
