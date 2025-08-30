// services/submissionService.js
import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import { rewardForTier } from "./reward.js";
import Problem from "../models/Problem.js"; // ProblemSet 대신 Problem 모델을 사용

export async function acceptSolve({ userId, problemId }) {
  const uid = new mongoose.Types.ObjectId(userId);
  const pid = Number(problemId);

  // (1) 문제 티어 가져오기 (효율적으로 변경)
  const problem = await Problem.findOne({ problemId: pid }).lean();

  if (!problem) {
    throw new Error("해당 문제를 찾을 수 없습니다.");
  }

  const tier = problem.tier;

  // (2) 보상 계산 (tier 기반)
  const reward = rewardForTier(tier);

  try {
    await Submission.create({
      userId: uid,
      problemId: pid,
      status: "AC",
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