import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Col, Row, Nav, Button } from "react-bootstrap";

import * as Api from "../../api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";

function Network() {
  const params = useParams();
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  // useState 훅을 통해 users 상태를 생성함.
  const [users, setUsers] = useState([]);
  const [id, setId] = useState();

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const offset = (page -1) * limit;
  const total = users.length;
  const numPages = Math.ceil(total / limit);

  useEffect(() => {
    function shuffle(sourceArray) {
      for (var i = 0; i < sourceArray.length - 1; i++) {
          var j = i + Math.floor(Math.random() * (sourceArray.length - i));
  
          var temp = sourceArray[j];
          sourceArray[j] = sourceArray[i];
          sourceArray[i] = temp;
      }
      return sourceArray;
    }
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    Api.get("userlist").then((res) => setUsers(shuffle(res.data)));
  }, [userState, navigate]);

  useEffect(() => {
    if (params.userId) {
      // 만약 현재 URL이 "/users/:userId" 라면, 이 userId를 유저 id로 설정함.
      setId(params.userId);
    } else {
      // 이외의 경우, 즉 URL이 "/" 라면, 전역 상태의 user.id를 유저 id로 설정함.
      setId(userState.user.id);
    }
  }, [params, userState]);

  return (
    <Col>
      {users.filter((user) => user.id !== id).slice(offset, offset + limit).map((user) => (
        <UserCard key={user.id} user={user} isNetwork />
      ))}
      <Nav total={total} limit={limit} page={page} setPage={setPage}>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          &lt;
        </Button>
        {Array(numPages)
          .fill()
          .map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? "page" : null}
            >
              {i + 1}
            </Button>
          ))}
        <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
          &gt;
        </Button>
      </Nav>
    </Col>
  );
}

export default Network;