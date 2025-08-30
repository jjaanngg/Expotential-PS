// routes/reward.js
import express from "express";
import auth from "../middlewares/auth.js";
import User from "../models/User.js";
import Submission from "../models/Submission.js";

const router = express.Router();

/**
 * POST /api/reward/claim
 * body: { problemId: number }
 * resp: 200 { message, currency } | 409 already claimed
 */
router.post("/claim", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.body;

    if (typeof problemId !== "number") {
      return res.status(400).json({ message: "problemId(숫자)가 필요합니다." });
    }

    // 1) 정답 제출 레코드가 없으면 만들어 둔다 (AC, rewarded:false)
    const sub = await Submission.findOneAndUpdate(
      { userId, problemId },
      {
        $setOnInsert: {
          userId,
          problemId,
          status: "AC",
          rewarded: false,
          solvedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    // 2) 아직 보상 안 받은(=rewarded:false) AC 제출만 보상 처리
    const toggled = await Submission.findOneAndUpdate(
      { _id: sub._id, status: "AC", rewarded: false },
      { $set: { rewarded: true } },
      { new: true }
    );

    // 이미 보상 받은 경우
    if (!toggled) {
      return res.status(409).json({ message: "이미 보상받은 문제입니다." });
    }

    // 3) 보상 최초 지급 시에만 코인 +1
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { currency: 1 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "보상 지급 완료", currency: user.currency });
  } catch (err) {
    console.error("[reward/claim] error:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
});

export default router;