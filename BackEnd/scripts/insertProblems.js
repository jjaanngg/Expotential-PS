import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Problem from '../models/Problem.js';

dotenv.config();

// DB 연결
await mongoose.connect(process.env.MONGO_URI);

// JSON 파일 경로 설정 (현재 스크립트 기준 상대 경로)
const filePath = path.resolve('./sample/problems.json');
const rawData = fs.readFileSync(filePath);
const sampleProblems = JSON.parse(rawData);

// 데이터 삽입
try {
  await Problem.insertMany(sampleProblems);
  console.log("샘플 문제 데이터 삽입 완료!");
} catch (err) {
  console.error("데이터 삽입 실패:", err);
} finally {
  process.exit();
}