// routes/solveCheck.js
// "보상 받기" 버튼을 눌렀을 때 실행되는 백엔드 API 엔드포인트
import express from "express";
import auth from "../middlewares/auth.js";
import {acceptSolve} from "../services/submissionService.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  // JWT 토큰 검증 후, 사용자 정보 받기
  const body = req.body;
  const authUser = req.user;
  console.log("[solve-check] req.body:", body, "req.user:", authUser);
  
  try {
    // problemId가 숫자인지 확인
    const pid = Number(body?.problemId);
    if (!Number.isFinite(pid)) {
      return res.status(400).json({ message: "problemId가 Number가 아닙니다!" });
    }
    // userId 존재여부 확인
    const userId = authUser?.id ?? authUser?._id ?? authUser?.userId;
    if (!userId) {
      return res.status(401).json({ message: "user id가 존재하지 않습니다!" });
    }
    
    // 실제 로직(services/submissionService.js)에 위임
    const result = await acceptSolve({ userId, problemId: pid });
    console.log("[solve-check] 결과:", result);
    // 중복 정답제출 처리
    if (result.duplicate || !result.isNew) {
      return res.status(409).json({ message: "이미 완료된 처리입니다" });
    }

    // 새로운 제출일 경우, 응답
    return res.status(201).json({
      status: "accepted",
      reward: result.reward,
      totals: result.totals
    });
  } catch (e) {
    console.error("[solve-check] 오류:", e?.message, e);
    return res.status(500).json({ message: e?.message || "Internal error" });
  }
});

export default router;