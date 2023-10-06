import React, { useState } from "react";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../api";

function EducationEditForm({ currentEducation, setEducations, setIsEditing }) {
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [graduation, setGraduation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      college: college,
      major: major,
      graduation: graduation,
    };

    // 폼 데이터를 API로 전송
    Api.post("educations", formData)
      .then((response) => {
        // 성공적으로 처리된 경우
        console.log("학력 정보가 업데이트되었습니다.");
        // 필요한 업데이트 작업 수행
        // ...
        setIsEditing(false);
      })
      .catch((error) => {
        // 에러 발생 시 처리
        console.log("학력 정보 업데이트 중 에러 발생:", error);
      });
  };

  return (
    <Card className="mb-2">
      <Card.Body>
        <h2>학력</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="학교명"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              onBlur={(e) => setCollege(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="전공"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              onBlur={(e) => setMajor(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Check
              inline
              type={"radio"}
              label="재학중"
              id={`inline-radio-1`}
              checked={graduation === 1}
              onChange={() => setGraduation(1)}
              onBlur={() => setGraduation(1)}
            />
            <Form.Check
              inline
              type={"radio"}
              label="학사졸업"
              id={`inline-radio-2`}
              checked={graduation === 2}
              onChange={() => setGraduation(2)}
              onBlur={() => setGraduation(2)}
            />
            <Form.Check
              inline
              type={"radio"}
              label="석사졸업"
              id={`inline-radio-3`}
              checked={graduation === 3}
              onChange={() => setGraduation(3)}
              onBlur={() => setGraduation(3)}
            />
            <Form.Check
              inline
              type={"radio"}
              label="박사졸업"
              id={`inline-radio-4`}
              checked={graduation === 4}
              onChange={() => setGraduation(4)}
              onBlur={() => setGraduation(4)}
            />
          </Form.Group>
          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 12 }}>
              <Button variant="primary" type="submit" className="me-3">
                확인
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EducationEditForm;
// // -----------------------------------------------------------------------------------
// import React, { useState } from "react";
// import { Button, Form, Card ,Col, Row } from "react-bootstrap";
// import * as Api from "../../api";

// function EducationEditForm({ currentEducation, setEducations, setIsEditing }) {
//   //useState로 title 상태를 생성함.
//   const [college, setCollege] = useState(currentEducation.college);
//   //useState로 description 상태를 생성함.
//   const [major, setMajor] = useState(currentEducation.major);
//   const [graduation, setGraduation] = useState(currentEducation.graduation);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // currentAward의 user_id를 user_id 변수에 할당함.
//     const formData = {
//       college: college,
//       major: major,
//       graduation: graduation,
//     };

//     // "awards/수상 id" 엔드포인트로 PUT 요청함.
//     await Api.put(`educations/${currentEducation.id}`, {
//       college,
//       major,
//       graduation,
//     });

//     // "awardlist/유저id" 엔드포인트로 GET 요청함.
//     const res = await Api.get("educationlist", formData);
//     // awards를 response의 data로 세팅함.
//     setEducations(res.data);
//     // 편집 과정이 끝났으므로, isEditing을 false로 세팅함.
//     setIsEditing(false);
//   };

//   return (
//     <Card className="mb-2">
//     <Card.Body>
//       <h2>학력</h2>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="collegeInput" className="mb-3">
//           <Form.Control
//             type="text"
//             placeholder="학교명"
//             value={college}
//             onChange={(e) => setCollege(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group controlId="majorInput" className="mb-3">
//           <Form.Control
//             type="text"
//             placeholder="전공"
//             value={major}
//             onChange={(e) => setMajor(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group controlId="graduationInput" className="mb-3">
//           <Form.Check
//             inline
//             type={"radio"}
//             label="재학중"
//             id={`inline-radio-1`}
//             checked={graduation === "1"}
//             onChange={() => setGraduation("1")}
//           />
//           <Form.Check
//             inline
//             type={"radio"}
//             label="학사졸업"
//             id={`inline-radio-2`}
//             checked={graduation === "2"}
//             onChange={() => setGraduation("2")}
//           />
//           <Form.Check
//             inline
//             type={"radio"}
//             label="석사졸업"
//             id={`inline-radio-3`}
//             checked={graduation === "3"}
//             onChange={() => setGraduation("3")}
//           />
//           <Form.Check
//             inline
//             type={"radio"}
//             label="박사졸업"
//             id={`inline-radio-4`}
//             checked={graduation === "4"}
//             onChange={() => setGraduation("4")}
//           />
//         </Form.Group>
//         <Form.Group as={Row} className="mt-3 text-center">
//           <Col sm={{ span: 12 }}>
//             <Button variant="primary" type="submit" className="me-3">
//               확인
//             </Button>
//             <Button variant="secondary" onClick={() => setIsEditing(false)}>
//               취소
//             </Button>
//           </Col>
//         </Form.Group>
//       </Form>
//     </Card.Body>
//   </Card>
//   );
// }

// export default EducationEditForm;


