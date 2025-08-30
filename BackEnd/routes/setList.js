import express from 'express';
import ProblemSet from '../models/ProblemSet.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const sets = await ProblemSet.find({}, 'title setNumber tiers');
    res.json(sets);
  } catch (err) {
    res.status(500).send('세트 목록 조회 실패');
  }
});

export default router;