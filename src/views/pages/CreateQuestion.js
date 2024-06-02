import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateQuestion = ({ toggleModal, quizType, onQuestionCreated }) => {
  const [type, setType] = useState(quizType || "");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [typeData, setTypeData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAnswerOpen, setDropdownAnswerOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleAnswer = () => setDropdownAnswerOpen((prevState) => !prevState);

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };

  useEffect(() => {
    const fetchQuizPapers = async () => {
      const collectionRef = collection(db, "quizpapers");
      const querySnapshot = await getDocs(collectionRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        const documentData = doc.data();
        data.push({ id: doc.id, ...documentData });
      });
      setTypeData(data);
      console.log(data); // Array containing all document data
    };

    fetchQuizPapers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const questionData = {
      question,
      correct_answer: correctAnswer,
    };

    try {
      // Thêm câu hỏi vào collection "questions" và lấy ID mới
      const selectedQuizPaper = typeData.find((item) => item.title === type);
      if (!selectedQuizPaper) {
        toast.error("Chưa chọn loại câu hỏi hoặc loại câu hỏi không hợp lệ.");
        return;
      }
      const questionRef = await addDoc(
        collection(db, `quizpapers/${selectedQuizPaper.id}/questions`),
        questionData
      );
      const questionId = questionRef.id;

      const countDocRef = doc(db, `quizpapers/${selectedQuizPaper.id}`);
      const countDocSnap = await getDoc(countDocRef);
      const currentCount = countDocSnap.data().questions_count || 0;
      await updateDoc(countDocRef, { questions_count: currentCount + 1 });

      // Thêm các câu trả lời vào collection "answers" trong document của câu hỏi với ID mới
      for (let [identifier, answer] of Object.entries(answers)) {
        console.log(answer);
        await setDoc(
          doc(
            db,
            `quizpapers/${selectedQuizPaper.id}/questions/${questionId}/answers/${identifier}`
          ),
          {
            answer,
            identifier,
          }
        );
      }

      toast.success("Thêm câu hỏi mới thành công!");
      setQuestion("");
      setAnswers({ A: "", B: "", C: "", D: "" });
      setCorrectAnswer("");
      toggleModal();
      onQuestionCreated();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Thêm câu hỏi mới thất bại!");
    }
  };

  return (
    <>
      <div className="header pt-1 md-8"></div>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary-info shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="mb-0">Thêm câu hỏi mới</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="question">Nội dung câu hỏi</Label>
                <Input
                  type="textarea"
                  id="question"
                  placeholder="Nhập nội dung câu hỏi"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </FormGroup>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="answerA">Đáp án A</Label>
                    <Input
                      type="text"
                      id="answerA"
                      name="A"
                      placeholder="Nhập câu trả lời cho đáp án A"
                      value={answers.A}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="answerB">Đáp án B</Label>
                    <Input
                      type="text"
                      id="answerB"
                      name="B"
                      placeholder="Nhập câu trả lời cho đáp án B"
                      value={answers.B}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="answerC">Đáp án C</Label>
                    <Input
                      type="text"
                      id="answerC"
                      name="C"
                      placeholder="Nhập câu trả lời cho đáp án C"
                      value={answers.C}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="answerD">Đáp án D</Label>
                    <Input
                      type="text"
                      id="answerD"
                      name="D"
                      placeholder="Nhập câu trả lời cho đáp án D"
                      value={answers.D}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="correctAnswer" className="mr-6">
                  Answer:
                </Label>
                <Dropdown isOpen={dropdownAnswerOpen} toggle={toggleAnswer}>
                  <DropdownToggle caret>
                    {correctAnswer || "Choose answer"}
                  </DropdownToggle>
                  <DropdownMenu>
                    {["A", "B", "C", "D"].map((option, index) => (
                      <DropdownItem
                        onClick={() => setCorrectAnswer(option)}
                        key={index}
                      >
                        {option}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>

              <FormGroup>
                <Label for="quizType" className="mr-4">
                  Type question:
                </Label>
                <Dropdown isOpen={dropdownOpen} toggle={toggle} disabled>
                  <DropdownToggle caret>
                    {type || "Hãy chọn loại câu hỏi"}
                  </DropdownToggle>
                  <DropdownMenu>
                    {typeData.map((item, index) => (
                      <DropdownItem
                        onClick={() => setType(item.title)}
                        key={index}
                      >
                        {item.title}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>

              <Button type="submit" color="primary">
                Add question
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default CreateQuestion;
