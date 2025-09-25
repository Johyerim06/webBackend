import { Router } from 'express';
import { Event } from '../models/Event.js';
import { buildCandidates } from '../services/suggestion.service.js';

export const eventRouter = Router();

// 폼 화면
eventRouter.get('/new/:clubId', (req,res)=>{
  res.render('event_form', { clubId: req.params.clubId });
});

// 생성
eventRouter.post('/', async (req,res)=>{
  try {
    // 모임 URL 생성
    const meetingUrl = `${req.protocol}://${req.get('host')}/meeting/participant?id=${req.userId}`;
    
    // 프론트엔드 데이터를 Event 모델에 맞게 변환
    const eventData = {
      title: req.body.name || req.body.title || '새 모임',
      club: req.body.club || req.userId, // 임시로 userId를 club으로 사용
      description: req.body.description || '',
      windowStart: req.body.startDate ? new Date(req.body.startDate) : undefined,
      windowEnd: req.body.endDate ? new Date(req.body.endDate) : undefined,
      status: 'draft',
      creator: req.userId, // 생성자 ID 저장
      meetingUrl: meetingUrl // 모임 URL 저장
    };
    
    const ev = await Event.create(eventData);
    
    // 생성된 모임의 실제 ID로 URL 업데이트
    const actualMeetingUrl = `${req.protocol}://${req.get('host')}/meeting/participant?id=${ev._id}`;
    await Event.findByIdAndUpdate(ev._id, { meetingUrl: actualMeetingUrl });
    
    // JSON 응답으로 변경 (프론트엔드 호환)
    res.status(201).json({
      id: ev._id,
      name: ev.title,
      title: ev.title,
      startDate: ev.windowStart?.toISOString().split('T')[0],
      endDate: ev.windowEnd?.toISOString().split('T')[0],
      startTime: req.body.startTime || '00:00',
      endTime: req.body.endTime || '24:00',
      voting: req.body.voting || false,
      creatorId: req.userId,
      meetingUrl: actualMeetingUrl,
      participants: [],
      createdAt: ev.createdAt,
      updatedAt: ev.updatedAt
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(400).json({ error: '모임 생성에 실패했습니다.' });
  }
});

// 상세
eventRouter.get('/:id', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.json(ev);
});

// 일정 조율 화면
eventRouter.get('/:id/schedule', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.render('schedule', { ev });
});

// 후보 생성(관리자)
eventRouter.post('/:id/candidates', async (req,res)=>{
  const list = await buildCandidates(req.params.id, Number(req.body.thresholdRate || 0.7));
  res.redirect(`/events/${req.params.id}/vote`);
});

// 투표 화면
eventRouter.get('/:id/vote', async (req,res)=>{
  const ev = await Event.findById(req.params.id);
  res.render('vote', { ev });
});

// 확정(관리자)
eventRouter.post('/:id/confirm', async (req,res)=>{
  const { start, end } = req.body;
  const ev = await Event.findByIdAndUpdate(req.params.id, { status:'confirmed', confirmed: { start, end } }, { new: true });
  res.render('admin', { ev, ok:true });
});

// 참여자 추가
eventRouter.post('/:id/participants', async (req, res) => {
  try {
    const { name, email, availability } = req.body;
    const meetingId = req.params.id;

    if (!name || !email) {
      return res.status(400).json({ error: '이름과 이메일을 입력해주세요.' });
    }

    // 모임 존재 확인
    const meeting = await Event.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }

    // participants 배열 초기화
    if (!meeting.participants) {
      meeting.participants = [];
    }

    // 이미 참여자인지 확인
    const existingParticipantIndex = meeting.participants.findIndex(
      p => p.email === email
    );

    const participant = {
      name,
      email,
      availability: availability || [],
      joinedAt: new Date()
    };

    if (existingParticipantIndex >= 0) {
      // 기존 참여자라면 가용시간만 업데이트
      meeting.participants[existingParticipantIndex].availability = availability || [];
      meeting.participants[existingParticipantIndex].name = name; // 이름도 업데이트
      console.log('기존 참여자 가용시간 업데이트:', email);
    } else {
      // 새 참여자라면 추가
      meeting.participants.push(participant);
      console.log('새 참여자 등록:', email);
    }

    await meeting.save();

    res.status(201).json({
      message: existingParticipantIndex >= 0 
        ? '참여자 가용시간이 업데이트되었습니다.' 
        : '참여자가 성공적으로 등록되었습니다.',
      participant: {
        name: participant.name,
        email: participant.email,
        availability: participant.availability
      }
    });

  } catch (error) {
    console.error('Participant registration error:', error);
    res.status(500).json({ error: '참여자 등록 중 오류가 발생했습니다.' });
  }
});
