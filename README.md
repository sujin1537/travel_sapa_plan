# 하노이 · 사파 여행 플래너

3인 여행(2026년 11월 13일–18일)을 위한 반응형 한국어 여행 계획표입니다.

## 파일 구성
- `index.html`: 웹페이지 화면과 스타일
- `trip-data.json`: 일정, 교통, 숙소 후보 등 수정할 여행 데이터
- `.github/workflows/deploy.yml`: `main` 변경 시 GitHub Pages 자동 배포

## GitHub Pages 최초 설정
1. 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. 저장소의 **Actions** 탭에서 `Deploy travel planner to GitHub Pages` 실행 결과를 확인합니다.
4. 최초 배포가 성공하면 사이트 주소는 보통 `https://sujin1537.github.io/travel_sapa_plan/` 형식입니다. 실제 공개 여부는 Pages 설정과 Actions 결과에서 확인하세요.

## 여행 정보 수정
일정·교통·숙소 정보는 우선 `trip-data.json`에서 수정합니다. 실제 예약 시간, 운행 조건, 객실 가격과 잔여 객실은 공식 안내에서 확인한 후 반영하세요. 현재 숙소는 후보이며 가격·가용성 확인을 마친 상태가 아닙니다.

## Windows PC에서 로컬 복제
Git 설치 후 PowerShell에서 실행합니다.
```powershell
git clone https://github.com/sujin1537/travel_sapa_plan.git
cd travel_sapa_plan
```

수정한 파일을 GitHub에 올릴 때:
```powershell
git add .
git commit -m "Update trip plan"
git push
```

`main`에 푸시하면 GitHub Actions가 자동 배포합니다. 최초 Pages 설정과 배포 성공 여부 확인은 한 번 필요합니다.
