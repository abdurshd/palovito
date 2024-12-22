# 레스토랑 주문 처리 시스템

## 시스템 개요

실시간 업데이트가 가능한 풀스택 레스토랑 주문 관리 시스템으로, 다음 세 가지 주요 구성 요소로 이루어져 있습니다:

- 관리자 대시보드 (프론트엔드)
- 고객용 애플리케이션
- 백엔드 서비스

## 기술 스택

### 백엔드 (Spring Boot)

- Java 17
- Spring Boot 3.2.3
- Spring Security
- Spring WebSocket
- JUnit 5 & Mockito 테스팅
- Lombok (보일러플레이트 코드 감소)
- Actuator & Prometheus 모니터링

### 관리자 대시보드 (프론트엔드)

- React 18.3
- TypeScript 5.6
- Vite 6.0
- TailwindCSS 3.4
- Radix UI 컴포넌트
- Playwright E2E 테스팅
- STOMP WebSocket 클라이언트
- ShadcnUI 컴포넌트

### 고객용 애플리케이션

- React 18.3
- TypeScript 5.6
- Vite 6.0
- TailwindCSS 3.4
- Radix UI 컴포넌트
- STOMP WebSocket 클라이언트
- ShadcnUI 컴포넌트

## 아키텍처 및 기능

### 백엔드 아키텍처

- CRUD 작업을 위한 RESTful API 엔드포인트
- STOMP 프로토콜을 사용한 WebSocket 통합
- ConcurrentHashMap을 이용한 스레드 세이프 주문 처리
- 비동기 주문 처리 시뮬레이션
- 포괄적인 보안 구성
- Guava를 사용한 속도 제한 구현
- 캐싱 지원
- Spring Actuator를 통한 모니터링 엔드포인트

### 관리자 대시보드 기능

- 실시간 주문 관리 대시보드
- 카테고리별 메뉴 항목 관리
- 주문 상태 업데이트
- 상세 주문 추적
- 카테고리 관리
- 반응형 디자인
- 폼 유효성 검사
- 오류 경계
- Playwright를 이용한 E2E 테스팅

### 고객용 애플리케이션 기능

- 메뉴 탐색 및 주문
- 실시간 주문 상태 추적
- 주문 내역
- 카테고리 기반 메뉴 필터링
- 반응형 디자인
- 폼 유효성 검사
- 오류 처리

## 애플리케이션 실행 방법

### 백엔드

1. 사전 요구사항:
   - JDK 17 이상
   - Gradle 7.x 이상

2. 애플리케이션 실행:

```sh
cd backend
./gradlew bootRun
```

서버는 `http://localhost:8080`에서 시작됩니다

### 관리자 대시보드

1. 사전 요구사항:
   - Node.js 18.x 이상
   - npm 9.x 이상

2. 애플리케이션 실행 방법:

```sh
cd frontend
npm install
npm run dev
```

관리자 대시보드는 `http://localhost:5173`에서 실행됩니다

### 고객용 애플리케이션

1. 사전 요구사항:
   - Node.js 18.x 이상
   - npm 9.x 이상

2. 애플리케이션 실행 방법:

```sh
cd customer
npm install
npm run dev
```

고객용 애플리케이션은 `http://localhost:5174`에서 실행됩니다

## 테스트

### 백엔드 테스트

단위 및 통합 테스트 실행:

```sh
cd backend
./gradlew test
```

### 관리자 대시보드 테스트

테스트를 실행하기 위해서는 playwright 브라우저가 설치되어 있어야 하며, 테스트를 실행할 때 자동으로 설치됩니다. 그러나 테스트를 실행하기 전에 많은 시간을 기다리고 싶지 않다면 브라우저를 수동으로 먼저 설치하는 것이 좋습니다. 다음은 수동 설치 명령입니다:

```sh
cd frontend
npx playwright install
```

E2E 테스트 실행:

```sh
cd frontend
npm run test:e2e # 헤드리스 모드로 테스트 실행
npm run test:e2e:ui # 테스트 실행 시 UI 표시
```

## 개발 요구사항

### 중요 패키지 버전

- Node.js: ≥ 18.x
- Java: ≥ 17
- React: 18.3.x
- TypeScript: ~5.6.2
- Vite: ^6.0.3
- TailwindCSS: ^3.4.17
- Spring Boot: 3.2.3

### 개발 도구

- TypeScript 지원 통합 개발 환경 (VS Code 권장)
- Java 통합 개발 환경 (IntelliJ IDEA 권장)
- Git
- Postman 또는 유사한 API 테스트 도구
- 테스트를 위한 WebSocket 클라이언트 (예: WebSocket King)

### Environment Setup

1. Node.js 및 npm 설치
2. JDK 17 설치
3. Gradle 설치
4. JAVA_HOME 환경 변수 설정
5. 권장 IDE 확장 프로그램 설치:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

## 추가 참고사항

- 백엔드는 개발 환경에서 인메모리 스토리지를 사용합니다
- WebSocket 연결은 로컬 개발 환경에 구성되어 있습니다
- CORS는 로컬 개발 환경에 구성되어 있습니다
- 시스템은 주문 업데이트를 위해 실시간 통신을 사용합니다
- 두 개의 프런트엔드 애플리케이션은 일관성을 위해 동일한 UI 컴포넌트 라이브러리를 사용합니다
- 이 애플리케이션은 레스토랑에서 사용되므로 고객용 및 관리자용 두 개의 프런트엔드 애플리케이션으로 나뉘어 있습니다
