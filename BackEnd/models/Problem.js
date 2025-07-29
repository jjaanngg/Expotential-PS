import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true, unique: true },  // 문제 고유 번호
  titleKo: { type: String, required: true },                  // 문제 제목 (한글)
  tier: { type: Number, required: true },                     // 난이도 (1~30 등급)
  solvedCount: { type: Number, required: true },              // 푼 사람 수
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;