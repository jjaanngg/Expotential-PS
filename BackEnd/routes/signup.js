// ※ 기본 셋팅
import express from 'express';
const router = express.Router();            // 라우터 생성 -> 연결뿐만 아니라, 데이터 전달도 함
import User from '../models/User.js';       // 모델을 기반으로 데이터 저장하기 위해 가져옴
import bcrypt from 'bcryptjs';                // 비밀번호 암호화를 제공하는 함수

// ※ 회원가입 코드
router.post("/", async(req,res) => {
    // - body에서 응답 가져옴
    const {email, password, nickname} = req.body;
    try{
        // - 이메일 & 닉네임 중복 확인
        const existingEmail = await User.findOne({email});
        const existingNickname = await User.findOne({nickname});
        if (existingEmail) {
            // res.status() : 응답 시, 상태 지정
            // 2XX번대 코드는 성공을, 4XX번대 코드는 클라이언트 오류를, 5XX번대 코드는 서버 오류를 나타냄 (Rest API)
            return res.status(400).json({message: "이미 등록된 이메일입니다."});
        }
        if (existingNickname) {
            return res.status(400).json({message: "이미 사용 중인 닉네임입니다."});
        }

        // - 비밀번호 암호화
        const saltRounds = 10;  // 무작위 문자열(salt)을 생성하는 반복횟수
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // - 모델을 기반으로 데이터 생성
        const newUser = new User({
            email,
            passwordHash,
            nickname,
            solvedRating: 0,
            codeforcesRating: 0,
            atcoderRating: 0,
            totalRating: 0,
            currency: 0,
            createdAt: new Date()
        });

        // - MongoDB에 데이터 저장
        await newUser.save();
        res.status(201).json({message: "회원가입 성공"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "서버오류"});
    }
});

export default router;