// routes/setCreate.js
import express from 'express';
import ProblemSet from '../models/ProblemSet.js';
import Problem from '../models/Problem.js';

const router = express.Router();

// [POST] 특정 티어 세트 생성
router.post('/generate', async (req, res) => {
  const { setNumber, title, tierGroup, count } = req.body;

  // 티어 범위 설정
  const tierRanges = {
    Bronze: [1, 5],
    Silver: [6, 10],
    Gold: [11, 15],
    Platinum: [16, 20],
  };

  const [minTier, maxTier] = tierRanges[tierGroup] || [];

  if (!minTier || !maxTier) {
    return res.status(400).send('잘못된 티어 그룹입니다.');
  }

  try {
    // 최근 24세트 문제 ID 수집
    const recentSets = await ProblemSet.find({ tiers: tierGroup }).sort({ createdAt: -1 }).limit(24);
    
    // 세트 안의 모든 문제 ID 추출
    let allUsedIds = [];
    for (const set of recentSets) {
      for (const problem of set.problems) {
        allUsedIds.push(problem.problemId);
      }
    }

    // 중복 제거한 ID 집합 생성
    const usedIds = new Set(allUsedIds);

    // 티어가 minTier 이상, maxTier 이하인 조건 만들기
    const tierCondition = { $gte: minTier, $lte: maxTier };

    // 이미 다른 세트에 포함된 문제 ID는 제외
    const excludeUsedIds = { $nin: Array.from(usedIds) };

    // 조건에 맞는 문제 가져오기
    const problems = await Problem.find({
      tier: tierCondition,
      problemId: excludeUsedIds
    }).limit(count);

    if (problems.length < count) {
      return res.status(400).send(`해당 티어(${tierGroup}) 문제 수가 부족합니다.`);
    }

    const newSet = new ProblemSet({
      title,
      setNumber,
      tiers: [tierGroup],
      problems
    });

    await newSet.save();
    res.status(201).json({ message: `${tierGroup} 세트 생성 완료`, id: newSet._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('세트 생성 실패');
  }
});

export default router;