import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import * as Api from "../../api";
import Education from "./Education";
import EducationAddForm from "./EducationAddForm";

function Educations({ portfolioOwnerId, isEditable }) {
    const [educations, setEducations] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
  
    useEffect(() => {
      Api.get(`Educations/${portfolioOwnerId}`)
        .then((res) => setEducations(res.data))
        setIsAdding(false);
    }, [portfolioOwnerId]);
  
  return (
    <Card>
      <Card.Body>
        <Card.Title>학력</Card.Title>
        {educations.map((education) => (
          <Education
            key={education.id}
            education={education}
            setEducations={setEducations}
            isEditable={isEditable}
          />
        ))}
        {isEditable && (
          <Row className="mt-3 text-center mb-4">
            <Col sm={{ span: 20 }}>
              <Button onClick={() => setIsAdding(true)}>+</Button>
            </Col>
          </Row>
        )}
        {isAdding && (
          <EducationAddForm
            portfolioOwnerId={portfolioOwnerId}
            setEducations={setEducations}
            setIsAdding={setIsAdding}
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default Educations;

// import React, { useEffect, useState } from "react";
// import { Card, Button, Row, Col } from "react-bootstrap";
// import * as Api from "../../api";
// import Education from "./Education";
// import EducationAddForm from "./EducationAddForm";

// function Educations({ portfolioOwnerId, isEditable }) {
//   //useState로 awards 상태를 생성함.
//   const [educations, setEducations] = useState([]);
//   //useState로 isAdding 상태를 생성함.
//   const [isAdding, setIsAdding] = useState(false);

//   useEffect(() => {
//     // "awardlist/유저id"로 GET 요청하고, response의 data로 awards를 세팅함.
//     Api.get("educationlist", portfolioOwnerId)
//     .then((res) => setAwards(res.data));
//   }, [portfolioOwnerId]);

//   return (
//     <Card>
//       <Card.Body>
//         <Card.Title>학력</Card.Title>
//         {educations.map((education) => (
//           <Education
//             key={education.id}
//             education={education}
//             setEducations={setEducations}
//             isEditable={isEditable}
//           />
//         ))}
//         {isEditable && (
//           <Row className="mt-3 text-center mb-4">
//             <Col sm={{ span: 20 }}>
//               <Button onClick={() => setIsAdding(true)}>+</Button>
//             </Col>
//           </Row>
//         )}
//         {isAdding && (
//           <EducationAddForm
//             portfolioOwnerId={portfolioOwnerId}
//             setEducaions={setEducations}
//             setIsAdding={setIsAdding}
//           />
//         )}
//       </Card.Body>
//     </Card>
//   );
// }

// export default Educations;
