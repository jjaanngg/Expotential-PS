// services/submissionService.js
// 문제를 풀었을 때, 서버(DB)에 기록하고, 보상 지급/중복 여부를 결정하는 로직
import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import { rewardForTier } from "./reward.js";   // 보상 정책 import
import ProblemSet from "../models/ProblemSet.js"; // 문제 tier 가져오기 위해 필요

export async function acceptSolve({ userId, problemId }) {
  const uid = new mongoose.Types.ObjectId(userId);
  const pid = Number(problemId);

  // (1) 문제 티어 가져오기
  const problem = await ProblemSet.findOne(
    { "problems.problemId": pid },    // problemId가 pid인 문서 조회
    { "problems.$": 1 }               // 배열에서 해당 원소만 반환
  ).lean();

  if (!problem || !problem.problems?.length) {
    throw new Error("해당 문제를 찾을 수 없습니다.");
  }

  const tier = problem.problems[0].tier;

  // (2) 보상 계산 (tier 기반)
  const reward = rewardForTier(tier);

  try {
    await Submission.create({
      userId: uid,
      problemId: pid,
      status: "AC",    // 정답 처리
      reward,
    });

    return {
      isNew: true,
      duplicate: false,
      reward,
    };
  } catch (err) {
    if (err?.code === 11000) {
      return { isNew: false, duplicate: true };
    }
    throw err;
  }
}