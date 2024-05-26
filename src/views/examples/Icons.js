// Icons.js
import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Card, CardBody, CardHeader, Container, Form, Input } from "reactstrap";

const Icons = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([
    { identifier: "A", answer: "" },
    { identifier: "B", answer: "" },
    { identifier: "C", answer: "" },
    { identifier: "D", answer: "" },
  ]);

  const handleInputChange = (index, event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].answer = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newQuestionData = {
      question,
      answers: answers.map(({ identifier, answer }) => ({ identifier, answer })),
    };
    try {
      await addDoc(collection(db, "quizpapers/ppr001/questions"), newQuestionData);
      alert("Thêm câu hỏi mới thành công!");
      setQuestion("");
      setAnswers([
        { identifier: "A", answer: "" },
        { identifier: "B", answer: "" },
        { identifier: "C", answer: "" },
        { identifier: "D", answer: "" },
      ]);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Thêm câu hỏi mới thất bại!");
    }
  };

  return (
    <Container fluid>
      <Card className="bg-secondary shadow">
        <CardHeader className="bg-transparent border-0">
          <h3 className="mb-0">Thêm câu hỏi mới</h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Input
              type="textarea"
              placeholder="Nhập nội dung câu hỏi"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            {answers.map(({ identifier, answer }, index) => (
              <div key={index}>
                <Input
                  type="text"
                  placeholder={`Nhập câu trả lời cho đáp án ${identifier}`}
                  value={answer}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>
            ))}
            <Button type="submit" color="primary">Thêm câu hỏi</Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Icons;
