import { Router } from 'express';
import { Schedule } from '../models/Schedule.js';

export const scheduleRouter = Router();

// 시간표 생성
scheduleRouter.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { name, timeSlots, selectedDates } = req.body;

    console.log('[SCHEDULE] Create request body:', req.body);

    if (!name || !timeSlots || !selectedDates) {
      return res.status(400).json({ 
        error: '시간표 이름, 시간 슬롯, 선택된 날짜가 필요합니다' 
      });
    }

    const schedule = new Schedule({
      name,
      user: userId,
      timeSlots,
      selectedDates: selectedDates.map(date => new Date(date)),
      isActive: true
    });

    await schedule.save();

    res.status(201).json({
      message: '시간표가 성공적으로 생성되었습니다',
      schedule: {
        id: schedule._id,
        name: schedule.name,
        timeSlots: schedule.timeSlots,
        selectedDates: schedule.selectedDates,
        isActive: schedule.isActive
      }
    });
  } catch (error) {
    console.error('[SCHEDULE] Create error:', error);
    res.status(500).json({ error: '시간표 생성 중 오류가 발생했습니다' });
  }
});

// 사용자의 모든 시간표 조회
scheduleRouter.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    
    const schedules = await Schedule.find({ 
      user: userId, 
      isActive: true 
    }).sort({ updatedAt: -1 });

    res.json({
      schedules: schedules.map(schedule => ({
        id: schedule._id,
        name: schedule.name,
        timeSlots: schedule.timeSlots,
        selectedDates: schedule.selectedDates,
        isActive: schedule.isActive,
        createdAt: schedule.createdAt
      }))
    });
  } catch (error) {
    console.error('[SCHEDULE] Get error:', error);
    res.status(500).json({ error: '시간표 조회 중 오류가 발생했습니다' });
  }
});

// 특정 시간표 조회
scheduleRouter.get('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const scheduleId = req.params.id;

    const schedule = await Schedule.findOne({ 
      _id: scheduleId, 
      user: userId, 
      isActive: true 
    });

    if (!schedule) {
      return res.status(404).json({ error: '시간표를 찾을 수 없습니다' });
    }

    res.json({
      schedule: {
        id: schedule._id,
        name: schedule.name,
        timeSlots: schedule.timeSlots,
        selectedDates: schedule.selectedDates,
        isActive: schedule.isActive,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt
      }
    });
  } catch (error) {
    console.error('[SCHEDULE] Get by ID error:', error);
    res.status(500).json({ error: '시간표 조회 중 오류가 발생했습니다' });
  }
});

// 시간표 수정
scheduleRouter.put('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const scheduleId = req.params.id;
    const { name, timeSlots, selectedDates } = req.body;

    console.log('[SCHEDULE] Update request body:', {
      name,
      timeSlots: timeSlots ? timeSlots.length : 0,
      selectedDates: selectedDates ? selectedDates.length : 0,
      selectedDatesArray: selectedDates
    });

    const schedule = await Schedule.findOne({ 
      _id: scheduleId, 
      user: userId, 
      isActive: true 
    });

    if (!schedule) {
      return res.status(404).json({ error: '시간표를 찾을 수 없습니다' });
    }

    if (name) schedule.name = name;
    if (timeSlots) schedule.timeSlots = timeSlots;
    if (selectedDates) schedule.selectedDates = selectedDates.map(date => new Date(date));

    await schedule.save();

    res.json({
      message: '시간표가 성공적으로 수정되었습니다',
      schedule: {
        id: schedule._id,
        name: schedule.name,
        timeSlots: schedule.timeSlots,
        selectedDates: schedule.selectedDates,
        isActive: schedule.isActive
      }
    });
  } catch (error) {
    console.error('[SCHEDULE] Update error:', error);
    res.status(500).json({ error: '시간표 수정 중 오류가 발생했습니다' });
  }
});

// 수정된 일정 저장 (새로운 일정으로 저장)
scheduleRouter.post('/save-modified', async (req, res) => {
  try {
    const userId = req.userId;
    const { name, timeSlots, selectedDates, originalScheduleId } = req.body;

    console.log('[SCHEDULE] Save modified request body:', req.body);

    if (!name || !timeSlots || !selectedDates) {
      return res.status(400).json({ 
        error: '시간표 이름, 시간 슬롯, 선택된 날짜가 필요합니다' 
      });
    }

    // 새로운 일정으로 저장
    const modifiedSchedule = new Schedule({
      name: `${name} (수정됨)`,
      user: userId,
      timeSlots,
      selectedDates: selectedDates.map(date => new Date(date)),
      isActive: true
    });

    await modifiedSchedule.save();

    res.status(201).json({
      message: '수정된 일정이 성공적으로 저장되었습니다',
      schedule: {
        id: modifiedSchedule._id,
        name: modifiedSchedule.name,
        timeSlots: modifiedSchedule.timeSlots,
        selectedDates: modifiedSchedule.selectedDates,
        isActive: modifiedSchedule.isActive
      }
    });
  } catch (error) {
    console.error('[SCHEDULE] Save modified error:', error);
    res.status(500).json({ error: '수정된 일정 저장 중 오류가 발생했습니다' });
  }
});

// 시간표 삭제 (소프트 삭제)
scheduleRouter.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const scheduleId = req.params.id;

    const schedule = await Schedule.findOne({ 
      _id: scheduleId, 
      user: userId, 
      isActive: true 
    });

    if (!schedule) {
      return res.status(404).json({ error: '시간표를 찾을 수 없습니다' });
    }

    schedule.isActive = false;
    await schedule.save();

    res.json({ message: '시간표가 성공적으로 삭제되었습니다' });
  } catch (error) {
    console.error('[SCHEDULE] Delete error:', error);
    res.status(500).json({ error: '시간표 삭제 중 오류가 발생했습니다' });
  }
});
