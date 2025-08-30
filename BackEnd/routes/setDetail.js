import express from 'express';
import ProblemSet from '../models/ProblemSet.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  try {
    const set = await ProblemSet.findById(req.params.id);
    if (!set) return res.status(404).send('세트를 찾을 수 없음');
    res.json({ title: set.title, problems: set.problems });
  } catch (err) {
    res.status(500).send('세트 상세 조회 실패');
  }
});

export default router;