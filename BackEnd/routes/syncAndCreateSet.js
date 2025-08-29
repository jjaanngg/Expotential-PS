// scripts/syncAndCreateSet.js
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import ProblemSet from '../models/ProblemSet.js';

dotenv.config();

const syncAndCreateSet = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected...');

  try {
    const tierGroup = 'Bronze';
    const query = encodeURIComponent('tier:b5..b1');
    
    // 👇 이 부분 확인! headers에 페이지 크기를 5로 지정합니다.
    const response = await axios.get(
      `https://solved.ac/api/v3/search/problem?query=${query}&sort=random`,
      {
        headers: {
          'x-solvedac-page-size': 1
        }
      }
    );
    
    const problemsFromApi = response.data.items;
    if (problemsFromApi.length === 0) {
      throw new Error("API에서 문제를 가져오지 못했습니다.");
    }
    console.log(`${problemsFromApi.length}개의 ${tierGroup} 문제를 Solved.ac에서 가져왔습니다.`);

    for (const prob of problemsFromApi) {
      await Problem.updateOne(
        { problemId: prob.problemId },
        {
          $set: {
            titleKo: prob.titleKo,
            tier: prob.level,
            solvedCount: prob.solvedCount,
          },
        },
        { upsert: true }
      );
    }
    console.log('개별 문제 정보 동기화 완료!');

    const lastSet = await ProblemSet.findOne().sort({ setNumber: -1 });
    const newSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

    const newSet = new ProblemSet({
      title: `${tierGroup} 자동 생성 세트 #${newSetNumber}`,
      setNumber: newSetNumber,
      tiers: [tierGroup],
      problems: problemsFromApi.map(p => ({
        problemId: p.problemId,
        titleKo: p.titleKo,
        tier: p.level,
        solvedCount: p.solvedCount
      }))
    });

    await newSet.save();
    console.log(`✅ 성공: '${newSet.title}' 문제 세트가 DB에 생성되었습니다.`);

  } catch (error) {
    console.error('스크립트 실행 실패:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

syncAndCreateSet();