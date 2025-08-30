// models/User.js
import mongoose from "mongoose";   

const userSchema = new mongoose.Schema({
    // Expotential-PS 관련 정보
    email: { type: String, unique: true },
    passwordHash: String,
    nickname: { type: String, unique: true },
    // 외부 사이트 관련 정보
    solved_id: String,    
    atcoder_id: String,
    cf_id: String,
    // 점수
    solvedRating: Number,    
    codeforcesRating: Number,
    atcoderRating: Number,
    totalRating: Number,
    // 코인
    currency: Number,   
    // 회원가입 날짜       
    createdAt: Date,
    // 풀이 기록 동기화를 위한 필드
    solvedProblems: { type: [Number], default: [] },
    lastSyncAt: Date,
});

userSchema.index({ totalRating: -1 });
userSchema.index({ createdAt: -1 });

const userModel = mongoose.model("User", userSchema);

export default userModel;