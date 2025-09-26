import { Router } from 'express';
import { Availability } from '../models/Availability.js';
import { PersonalEvent } from '../models/PersonalEvent.js';
import { Event } from '../models/Event.js';
import { auth } from '../middleware/auth.js';
import Meeting from '../models/Meeting.js';

export const availabilityRouter = Router();

// 가용시간 저장 (기존 라우트 - 호환성 유지)
availabilityRouter.post('/:eventId', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { slots } = req.body; // ISO 문자열 배열
    await Availability.findOneAndUpdate(
      { eventId: req.params.eventId, userId: userId },
      { eventId: req.params.eventId, userId: userId, slots },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error('[AVAILABILITY] Save error:', error);
    res.status(500).json({ error: '가용시간 저장에 실패했습니다.' });
  }
});

// 가용시간 저장 (새로운 구조)
availabilityRouter.post('/meeting/:meetingId', auth, async (req, res) => {
  try {
    const userId = req.userId; // auth 미들웨어에서 설정된 userId 사용
    const meetingId = req.params.meetingId;
    const { availability, personalEventId } = req.body;
    
    // Meeting 정보 조회 (URL과 이름 가져오기)
    const meeting = await Meeting.findOne({ id: meetingId });
    const meetingUrl = `${req.protocol}://${req.get('host')}/meeting/participant?id=${meetingId}`;
    const meetingName = meeting ? meeting.name : '모임';
    
    // Events 컬렉션에서 정보 가져오기 (Meeting의 id를 Events의 _id로 사용)
    let eventsID = null;
    let eventTitle = null;
    let creatorID = null;
    
    try {
      // Meeting의 id를 ObjectId로 변환하여 Events 컬렉션에서 찾기
      const event = await Event.findById(meetingId);
      if (event) {
        eventsID = event._id; // Events 컬렉션의 _id
        eventTitle = event.title; // Events 컬렉션의 title
        creatorID = event.creator; // Events 컬렉션의 creator
        console.log('[AVAILABILITY] Found Event:', {
          eventsID: eventsID.toString(),
          eventTitle,
          creatorID: creatorID.toString()
        });
      } else {
        console.log('[AVAILABILITY] Event not found for meetingId:', meetingId);
        // Meeting 정보를 fallback으로 사용
        if (meeting) {
          eventsID = meeting._id;
          eventTitle = meeting.name;
          creatorID = meeting.creatorId;
        }
      }
    } catch (error) {
      console.log('[AVAILABILITY] Error finding Event, using Meeting info:', error.message);
      // Meeting 정보를 fallback으로 사용
      if (meeting) {
        eventsID = meeting._id;
        eventTitle = meeting.name;
        creatorID = meeting.creatorId;
      }
    }
    
    // PersonalEvent 생성 (선택적)
    let personalEvent = null;
    if (personalEventId) {
      personalEvent = await PersonalEvent.findById(personalEventId);
    }
    
    // Availability 저장 또는 업데이트
    const availabilityData = {
      eventId: meetingId,
      eventsID: eventsID,
      eventTitle: eventTitle,
      creatorID: creatorID,
      meetingUrl: meetingUrl,
      meetingName: meetingName, // 기존 호환성 유지
      userId: userId, // 가용시간을 저장한 사용자 ID
      personalEventId: personalEventId || null,
      availability: availability
    };
    
    await Availability.findOneAndUpdate(
      { eventId: meetingId, userId: userId },
      availabilityData,
      { upsert: true, new: true }
    );
    
    console.log('[AVAILABILITY] Saved:', {
      meetingId,
      eventsID,
      eventTitle,
      creatorID,
      meetingUrl,
      meetingName,
      userId,
      personalEventId,
      availabilityCount: availability.length
    });
    
    res.json({ 
      success: true, 
      message: '가용시간이 저장되었습니다.',
      personalEventId: personalEvent?._id
    });
  } catch (error) {
    console.error('[AVAILABILITY] Save error:', error);
    res.status(500).json({ error: '가용시간 저장에 실패했습니다.' });
  }
});

// 가용시간 조회
availabilityRouter.get('/meeting/:meetingId', auth, async (req, res) => {
  try {
    const userId = req.userId; // auth 미들웨어에서 설정된 userId 사용
    const meetingId = req.params.meetingId;
    
    const availability = await Availability.findOne({
      eventId: meetingId,
      userId: userId
    });
    
    res.json(availability || { availability: [] });
  } catch (error) {
    console.error('[AVAILABILITY] Get error:', error);
    res.status(500).json({ error: '가용시간 조회에 실패했습니다.' });
  }
});
