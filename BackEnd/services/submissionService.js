// services/submissionService.js
import Submission from "../models/Submission.js";

// 문제 풀이 처리
export async function acceptSolve(userId, problemId) {
  return await Submission.findOneAndUpdate(
    { userId, problemId, status: "accepted" },
    {
      $setOnInsert: {
        userId,
        problemId,
        status: "accepted",
        reward: { exp: 10, coin: 1, policyVersion: "v1" },
        createdAt: new Date()
      }
    },
    { upsert: true, new: true }
  );
}