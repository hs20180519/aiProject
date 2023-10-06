import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import * as Api from "../../api";

function EducationAddForm({ portfolioOwnerId, setEducations, setIsAdding }) {
  //useState로 title 상태를 생성함.
  const [title, setTitle] = useState("");
  //useState로 description 상태를 생성함.
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // portfolioOwnerId를 user_id 변수에 할당함.
    const user_id = portfolioOwnerId;

    // "Education/create" 엔드포인트로 post요청함.
    await Api.post("Educations", {
      user_id: portfolioOwnerId,
      title,
      description,
    });

    // "Educationlist/유저id" 엔드포인트로 get요청함.
    const res = await Api.get("Educations", user_id);
    // Educations를 response의 data로 세팅함.
    setEducations(res.data);
    // Education을 추가하는 과정이 끝났으므로, isAdding을 false로 세팅함.
    setIsAdding(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicTitle">
        <Form.Control
          type="text"
          placeholder="학교명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicDescription" className="mt-3">
        <Form.Control
          type="text"
          placeholder="전공"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group as={Row} className="mt-3 text-center">
        <Col sm={{ span: 20 }}>
          <Button variant="primary" type="submit" className="me-3">
            확인
          </Button>
          <Button variant="secondary" onClick={() => setIsAdding(false)}>
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
}

export default EducationAddForm;

// import React, { useState } from "react";
// import { Button, Form, Col, Row } from "react-bootstrap";
// import * as Api from "../../api";

// function EducationAddForm({ portfolioOwnerId, setEducations, setIsAdding }) {
//   //useState로 title 상태를 생성함.
//   const [college, setCollege] = useState("");
//   //useState로 description 상태를 생성함.
//   const [major, setMajor] = useState("");
//   const [graduation, setGraduation] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // portfolioOwnerId를 user_id 변수에 할당함.
//     const user_id = portfolioOwnerId;

//     // "award/create" 엔드포인트로 post요청함.
//     await Api.post("award/create", {
//       user_id: portfolioOwnerId,
//       college,
//       major,
//       graduation,
//     });

//     // "awardlist/유저id" 엔드포인트로 get요청함.
//     const res = await Api.get("educationlist", user_id);
//     // awards를 response의 data로 세팅함.
//     setEducations(res.data);
//     // award를 추가하는 과정이 끝났으므로, isAdding을 false로 세팅함.
//     setIsAdding(false);
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       <Form.Group controlId="formBasicTitle">
//         <Form.Control
//           type="text"
//           placeholder="학력"
//           value={college}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//       </Form.Group>

//       <Form.Group controlId="formBasicDescription" className="mt-3">
//         <Form.Control
//           type="text"
//           placeholder="전공"
//           value={major}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </Form.Group>

//       <Form.Group controlId="formBasicDescription" className="mt-3">
//         <Form.Control
//           type="text"
//           placeholder="졸업"
//           value={graduation}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </Form.Group>

//       <Form.Group as={Row} className="mt-3 text-center">
//         <Col sm={{ span: 20 }}>
//           <Button variant="primary" type="submit" className="me-3">
//             확인
//           </Button>
//           <Button variant="secondary" onClick={() => setIsAdding(false)}>
//             취소
//           </Button>
//         </Col>
//       </Form.Group>
//     </Form>
//   );
// }

// export default EducationAddForm;
