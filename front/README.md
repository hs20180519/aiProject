# dotenv

- `.env` 파일 설정
## 배포 서버 기준
- 2023년 12월 3일까지만 사용가능
```
REACT_APP_SERVER_URL="https://kdt-ai-8-team01-1.elicecoding.com/"
REACT_APP_SERVER_URL_API="https://kdt-ai-8-team01-1.elicecoding.com/api"
REACT_APP_GPT_SVR_URL="https://kdt-ai-8-team01-1.elicecoding.com/python/api"
REDIRECT_URI="https://kdt-ai-8-team01-1.elicecoding.com/oauth/kakao"
REACT_APP_GPT_TOKEN="elice-ai-8-1-team" 
```
## 로컬 서버 기준
```
REACT_APP_SERVER_URL="REACT_APP_SERVER_URL"
REACT_APP_SERVER_URL_API="REACT_APP_SERVER_URL_API"
REACT_APP_GPT_SVR_URL="REACT_APP_GPT_SVR_URL"
REACT_APP_GPT_TOKEN="REACT_APP_GPT_TOKEN"
REDIRECT_URI="http://localhost:3000/oauth/kakao"
```
- 카카오 로그인 사용할 경우 [해당 kakao develop](https://developers.kakao.com/) 에서 서비스 등록 후 백엔드 dotenv에서 `KAKAO_ID="KAKAO_ID"` 등록 후 사용할 것.

# 초기 패키지 설치

`yarn`을 사용하여 패키지 설치하기

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
