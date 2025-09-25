import express from 'express';
import Meeting from '../models/Meeting.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// 모든 모임 조회
router.get('/', auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ creatorId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    console.error('[MEETING] Get meetings error:', error);
    res.status(500).json({ error: '모임 목록을 불러오는데 실패했습니다.' });
  }
});

// 특정 모임 조회 (ID로)
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }
    res.json(meeting);
  } catch (error) {
    console.error('[MEETING] Get meeting error:', error);
    res.status(500).json({ error: '모임 정보를 불러오는데 실패했습니다.' });
  }
});

// 모임 생성
router.post('/', auth, async (req, res) => {
  try {
    const { name, startDate, endDate, startTime, endTime, voting } = req.body;
    
    // 고유 ID 생성
    const id = Math.random().toString(36).substring(2, 10);
    
    const meeting = new Meeting({
      id,
      name,
      startDate,
      endDate,
      startTime,
      endTime,
      voting: voting || false,
      creatorId: req.user.id,
      participants: []
    });
    
    await meeting.save();
    
    console.log('[MEETING] Meeting created:', {
      id: meeting.id,
      name: meeting.name,
      creatorId: meeting.creatorId
    });
    
    res.status(201).json(meeting);
  } catch (error) {
    console.error('[MEETING] Create meeting error:', error);
    res.status(500).json({ error: '모임 생성에 실패했습니다.' });
  }
});

// 모임 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }
    
    if (meeting.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ error: '모임을 수정할 권한이 없습니다.' });
    }
    
    const { name, startDate, endDate, startTime, endTime, voting } = req.body;
    
    meeting.name = name || meeting.name;
    meeting.startDate = startDate || meeting.startDate;
    meeting.endDate = endDate || meeting.endDate;
    meeting.startTime = startTime || meeting.startTime;
    meeting.endTime = endTime || meeting.endTime;
    meeting.voting = voting !== undefined ? voting : meeting.voting;
    
    await meeting.save();
    
    console.log('[MEETING] Meeting updated:', {
      id: meeting.id,
      name: meeting.name
    });
    
    res.json(meeting);
  } catch (error) {
    console.error('[MEETING] Update meeting error:', error);
    res.status(500).json({ error: '모임 수정에 실패했습니다.' });
  }
});

// 모임 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }
    
    if (meeting.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ error: '모임을 삭제할 권한이 없습니다.' });
    }
    
    await Meeting.deleteOne({ id: req.params.id });
    
    console.log('[MEETING] Meeting deleted:', {
      id: req.params.id
    });
    
    res.json({ message: '모임이 삭제되었습니다.' });
  } catch (error) {
    console.error('[MEETING] Delete meeting error:', error);
    res.status(500).json({ error: '모임 삭제에 실패했습니다.' });
  }
});

// 참여자 가용시간 등록
router.post('/:id/participant', async (req, res) => {
  try {
    const { name, email, availability } = req.body;
    
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }
    
    // 기존 참여자인지 확인
    const existingParticipant = meeting.participants.find(p => p.email === email);
    
    if (existingParticipant) {
      // 기존 참여자 업데이트
      existingParticipant.name = name;
      existingParticipant.availability = availability;
    } else {
      // 새 참여자 추가
      meeting.participants.push({
        name,
        email,
        availability
      });
    }
    
    await meeting.save();
    
    console.log('[MEETING] Participant added/updated:', {
      meetingId: meeting.id,
      participantName: name,
      participantEmail: email
    });
    
    res.json({ message: '가용시간이 등록되었습니다.' });
  } catch (error) {
    console.error('[MEETING] Add participant error:', error);
    res.status(500).json({ error: '가용시간 등록에 실패했습니다.' });
  }
});

// 참여자 목록 조회
router.get('/:id/participants', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ id: req.params.id });
    if (!meeting) {
      return res.status(404).json({ error: '모임을 찾을 수 없습니다.' });
    }
    
    res.json(meeting.participants);
  } catch (error) {
    console.error('[MEETING] Get participants error:', error);
    res.status(500).json({ error: '참여자 목록을 불러오는데 실패했습니다.' });
  }
});

export { router as meetingRouter };
