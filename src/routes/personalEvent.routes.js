import { Router } from 'express';
import { PersonalEvent } from '../models/PersonalEvent.js';

export const personalEventRouter = Router();

// 개인 일정 생성
personalEventRouter.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { name, timeSlots, selectedDates, originalScheduleId } = req.body;

    console.log('[PERSONAL_EVENT] Create request body:', req.body);

    if (!name || !timeSlots || !selectedDates) {
      return res.status(400).json({ 
        error: '일정 이름, 시간 슬롯, 선택된 날짜가 필요합니다' 
      });
    }

    const personalEvent = new PersonalEvent({
      name,
      user: userId,
      timeSlots,
      selectedDates: selectedDates.map(date => new Date(date)),
      originalScheduleId,
      isActive: true
    });

    await personalEvent.save();

    res.status(201).json({
      message: '개인 일정이 성공적으로 생성되었습니다',
      personalEvent: {
        id: personalEvent._id,
        name: personalEvent.name,
        timeSlots: personalEvent.timeSlots,
        selectedDates: personalEvent.selectedDates,
        originalScheduleId: personalEvent.originalScheduleId,
        isActive: personalEvent.isActive
      }
    });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Create error:', error);
    res.status(500).json({ error: '개인 일정 생성 중 오류가 발생했습니다' });
  }
});

// 사용자의 모든 개인 일정 조회
personalEventRouter.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    
    const personalEvents = await PersonalEvent.find({ 
      user: userId, 
      isActive: true 
    }).sort({ updatedAt: -1 });

    res.json({
      personalEvents: personalEvents.map(event => ({
        id: event._id,
        name: event.name,
        timeSlots: event.timeSlots,
        selectedDates: event.selectedDates,
        originalScheduleId: event.originalScheduleId,
        isActive: event.isActive,
        createdAt: event.createdAt
      }))
    });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Get error:', error);
    res.status(500).json({ error: '개인 일정 조회 중 오류가 발생했습니다' });
  }
});

// 특정 개인 일정 조회
personalEventRouter.get('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;

    const personalEvent = await PersonalEvent.findOne({ 
      _id: eventId, 
      user: userId, 
      isActive: true 
    });

    if (!personalEvent) {
      return res.status(404).json({ error: '개인 일정을 찾을 수 없습니다' });
    }

    res.json({
      personalEvent: {
        id: personalEvent._id,
        name: personalEvent.name,
        timeSlots: personalEvent.timeSlots,
        selectedDates: personalEvent.selectedDates,
        originalScheduleId: personalEvent.originalScheduleId,
        isActive: personalEvent.isActive,
        createdAt: personalEvent.createdAt,
        updatedAt: personalEvent.updatedAt
      }
    });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Get by ID error:', error);
    res.status(500).json({ error: '개인 일정 조회 중 오류가 발생했습니다' });
  }
});

// 개인 일정 수정
personalEventRouter.put('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const { name, timeSlots, selectedDates } = req.body;

    const personalEvent = await PersonalEvent.findOne({ 
      _id: eventId, 
      user: userId, 
      isActive: true 
    });

    if (!personalEvent) {
      return res.status(404).json({ error: '개인 일정을 찾을 수 없습니다' });
    }

    if (name) personalEvent.name = name;
    if (timeSlots) personalEvent.timeSlots = timeSlots;
    if (selectedDates) personalEvent.selectedDates = selectedDates.map(date => new Date(date));

    await personalEvent.save();

    res.json({
      message: '개인 일정이 성공적으로 수정되었습니다',
      personalEvent: {
        id: personalEvent._id,
        name: personalEvent.name,
        timeSlots: personalEvent.timeSlots,
        selectedDates: personalEvent.selectedDates,
        originalScheduleId: personalEvent.originalScheduleId,
        isActive: personalEvent.isActive
      }
    });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Update error:', error);
    res.status(500).json({ error: '개인 일정 수정 중 오류가 발생했습니다' });
  }
});

// 개인 일정 삭제 (소프트 삭제)
personalEventRouter.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;

    const personalEvent = await PersonalEvent.findOne({ 
      _id: eventId, 
      user: userId, 
      isActive: true 
    });

    if (!personalEvent) {
      return res.status(404).json({ error: '개인 일정을 찾을 수 없습니다' });
    }

    personalEvent.isActive = false;
    await personalEvent.save();

    res.json({ message: '개인 일정이 성공적으로 삭제되었습니다' });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Delete error:', error);
    res.status(500).json({ error: '개인 일정 삭제 중 오류가 발생했습니다' });
  }
});

// 스케줄에서 개인일정으로 복사 (사용자의 활성 스케줄 사용)
personalEventRouter.post('/copy-from-schedule', async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.body;

    console.log('[PERSONAL_EVENT] Copy from schedule request:', { startDate, endDate });

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: '시작 날짜, 종료 날짜가 필요합니다' 
      });
    }

    // 현재 사용자의 활성 스케줄 조회
    const schedule = await Schedule.findOne({ 
      user: userId, 
      isActive: true 
    });

    if (!schedule) {
      return res.status(404).json({ error: '활성화된 시간표를 찾을 수 없습니다' });
    }

    // 사용자 정보 조회
    const user = await User.findById(userId);
    const personalEventName = user?.name ? `${user.name}의 일정` : '개인 일정';

    // 기존 개인일정이 있는지 확인
    const existingPersonalEvent = await PersonalEvent.findOne({
      user: userId,
      isActive: true
    });

    let personalEvent;
    if (existingPersonalEvent) {
      // 기존 개인일정 업데이트
      existingPersonalEvent.name = personalEventName;
      existingPersonalEvent.timeSlots = schedule.timeSlots;
      existingPersonalEvent.selectedDates = [new Date(startDate), new Date(endDate)];
      existingPersonalEvent.originalScheduleId = schedule._id;
      await existingPersonalEvent.save();
      personalEvent = existingPersonalEvent;
    } else {
      // 새로운 개인일정 생성
      personalEvent = new PersonalEvent({
        name: personalEventName,
        user: userId,
        timeSlots: schedule.timeSlots,
        selectedDates: [new Date(startDate), new Date(endDate)],
        originalScheduleId: schedule._id,
        isActive: true
      });
      await personalEvent.save();
    }

    res.status(201).json({
      message: '시간표가 개인일정으로 성공적으로 복사되었습니다',
      personalEvent: {
        id: personalEvent._id,
        name: personalEvent.name,
        timeSlots: personalEvent.timeSlots,
        selectedDates: personalEvent.selectedDates,
        originalScheduleId: personalEvent.originalScheduleId,
        isActive: personalEvent.isActive
      }
    });
  } catch (error) {
    console.error('[PERSONAL_EVENT] Copy from schedule error:', error);
    res.status(500).json({ error: '시간표 복사 중 오류가 발생했습니다' });
  }
});
