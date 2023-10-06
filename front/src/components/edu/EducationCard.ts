import { Card, Button, Row, Col } from "react-bootstrap";

function EducationCard({ education, isEditable, setIsEditing }) {
  return (
    <Card.Text>
      <Row className="align-items-center">
        <Col>
          <span>{education.title}</span>
          <br />
          <span className="text-muted">{education.description}</span>
        </Col>
        {isEditable && (
          <Col xs lg="1">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => setIsEditing((prev) => !prev)}
              className="mr-3"
            >
              편집
            </Button>
          </Col>
        )}
      </Row>
    </Card.Text>
  );
}

export default EducationCard;

// import { Card, Button, Row, Col } from "react-bootstrap";

// function EducationCard({ education, isEditable, setIsEditing }) {
//   return (
//     <Card.Text>
//       <Row className="align-items-center">
//         <Col>
//           <span>{education.title}</span>
//           <br />
//           <span className="text-muted">{education.description}</span>
//         </Col>
//         {isEditable && (
//           <Col xs lg="1">
//             <Button
//               variant="outline-info"
//               size="sm"
//               onClick={() => setIsEditing((prev) => !prev)}
//               className="mr-3"
//             >
//               편집
//             </Button>
//           </Col>
//         )}
//       </Row>
//     </Card.Text>
//   );
// }

// export default EducationCard;

