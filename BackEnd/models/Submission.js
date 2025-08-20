// models/Submission.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const submissionSchema = new mongoose.Schema({
  // (1) 사용자
  userId: {
      type: Schema.Types.ObjectId,
      ref: "User",            // Ref USERS -> User 컬렉션 문서로 join
      required: true,         // 필요성 부여 -> DB 저장
      index: true,            // 검색 허용
    },
  problemId: { type: Number, required: true, index: true },
  // (2) 채점 결과
  status: {
    type: String,
    required: true,
    enum: ["AC", "WA", "TLE", "MLE", "RE", "CE", "PE", "IE"],
    default: "AC",  // 버튼 클릭 시, 정답처리되는 구조
  },
  // (3) 보상 지급 여부
  rewarded: {
    type: Boolean,
    default: false,
    index: true,
  },
  // (4) 해결 시각
  solvedAt: {
    type: Date,
    default: Date.now,
  },
});

// (userId, problemId) 조합 unique -> 한 번만 정답처리
submissionSchema.index(
  { userId: 1, problemId: 1 }, { unique: true }
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;