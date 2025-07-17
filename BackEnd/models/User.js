import mongoose from "mongoose";    // Node.js 앱에서 MongoDB와 쉽게 통신할 수 있게 도와주는 라이브러리

// ※ 스키마 속성 타입 & 옵션 정의
// - 속성 타입 : like 자료형, but 우리가 아는 일반적인 자료형이랑 다름
// - 옵션 : unique(속성의 중복방지를 허용할건지 설정), default(속성의 기본값을 설정), required(속성이 필수인지 설정) 등
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    passwordHash: String,
    nickname: { type: String, unique: true },
    solvedRating: Number,    
    codeforcesRating: Number,
    atcoderRating: Number,
    totalRating: Number,
    currency: Number,              // int, float과 같은 구체적 타입구분 없이, 전부 Number타입으로 설정
    createdAt: Date                // 날짜
});

// ※ 인덱스 설정
// - 인덱스 : 자주 조회되는 필드의 정렬방법 설정 -> 조회 속도 향상
// - 1(오름차순), -1(내림차순)
userSchema.index({ totalRating: -1 });
// userSchema.index({ email: 1 });
// userSchema.index({ nickname: 1 });   // unipue 옵션이 자동생성하기 때문에, 생략
userSchema.index({ createdAt: -1 });

// ※ 모델 생성
const userModel = mongoose.model("User", userSchema);

// ※ 모델 내보내기
// - default를 적으면, 나중에 import 할 때 이름을 자유롭게 지정 가능함
// - import를 통해 객체를 얻게되면, CRUD 시스템(Create, Read, Update, Delete) 구현가능
export default userModel;