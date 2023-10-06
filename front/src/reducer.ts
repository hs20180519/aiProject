function userReducer(userState, action) {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        console.log("%c로그인!", "color: #d93d1a;");
        return {
          ...userState,
          user: action.payload,
        };
      case "LOGOUT":
        console.log("%c로그아웃!", "color: #d93d1a;");
        return {
          ...userState,
          user: null,
        };
      case "UPDATE":
        console.log("%업데이트!", "color: #d93d1a;");
        return {
          ...userState,
          user: action.payload,
        };
      default:
        return userState;
    }
  }
  
  export default userReducer;  