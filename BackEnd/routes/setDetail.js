// routes/setDetail.js
import express from "express";
import ProblemSet from "../models/ProblemSet.js";

const router = express.Router();

// GET /api/sets/:id
router.get("/:id", async (req, res) => {
  try {
    // 필요한 필드만 select로 가져오기
    const set = await ProblemSet.findById(req.params.id)
      .select("title setNumber problems.problemId problems.titleKo problems.tier problems.solvedCount")
      .lean();

    if (!set) {
      return res.status(404).json({ message: "Set not found" });
    }

    // DB데이터 -> 프론트 요구형태로 가공
    const problems = Array.isArray(set.problems)        // 배열여부 확인
      ? set.problems.map((p) => ({                      // 배열 -> JSON 변환
          problemId: p.problemId,                       // Number (프론트 요구)
          titleKo: p.titleKo ?? "",                     // 없으면 빈 문자열
          tier: typeof p.tier === "number" ? p.tier : undefined,
          solvedCount: typeof p.solvedCount === "number" ? p.solvedCount : undefined,
        }))
      : [];
      
    // 전달
    return res.json({
      setNumber: set.setNumber,
      problems,
    });
  } catch (e) {
    console.error("[GET /api/sets/:id] error:", e);
    return res.status(500).json({ message: "세트 상세 조회 실패" });
  }
});

export default router;