import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find().sort({problemId: 1});
        res.status(200).json(problems);
    } catch (err) {
        console.error('문제 리스트 조회 실패:', err);
        res.status(500).json({message: '서버 오류'});
    }
});

export default router;