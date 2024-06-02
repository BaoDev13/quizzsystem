import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Button,
  Card,
  CardHeader,
  Container,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Input,
  FormGroup,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import CreateQuestion from "./CreateQuestion";

const ManageDailyQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    answers: { A: "", B: "", C: "", D: "" },
    correct_answer: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quizType, setQuizType] = useState("");

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleModal = () => setModalOpen((prevState) => !prevState);

  const fetchQuestions = async () => {
    try {
      const questionsRef = collection(db, "quizpapers/ppr001/questions");
      const questionsSnapshot = await getDocs(questionsRef);
      const data = [];

      for (const questionDoc of questionsSnapshot.docs) {
        const questionData = questionDoc.data();
        const questionId = questionDoc.id;

        const answersRef = collection(
          db,
          `quizpapers/ppr001/questions/${questionId}/answers`
        );
        const answersSnapshot = await getDocs(answersRef);
        const answersData = {};

        answersSnapshot.forEach((answerDoc) => {
          const answerData = answerDoc.data();
          answersData[answerDoc.id] = answerData.answer;
        });

        const questionWithAnswers = {
          id: questionId,
          ...questionData,
          answers: answersData,
        };
        data.push(questionWithAnswers);
      }

      setQuestions(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching questions: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (questionId) => {
    try {
      const batch = writeBatch(db);
      const answersRef = collection(
        db,
        `quizpapers/ppr001/questions/${questionId}/answers`
      );
      const answersSnapshot = await getDocs(answersRef);
      answersSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      const questionDocRef = doc(
        db,
        `quizpapers/ppr001/questions/${questionId}`
      );
      batch.delete(questionDocRef);
      await batch.commit();
      setQuestions(questions.filter((question) => question.id !== questionId));
      toast.success("Delete question successful!");
    } catch (error) {
      toast.error("Error deleting question: ", error);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setEditedQuestion({
      question: question.question,
      answers: question.answers,
      correct_answer: question.correct_answer,
    });
  };

  const handleSaveQuestion = async () => {
    try {
      const questionDocRef = doc(
        db,
        `quizpapers/ppr001/questions/${editingQuestionId}`
      );
      await updateDoc(questionDocRef, {
        question: editedQuestion.question,
        correct_answer: editedQuestion.correct_answer,
      });

      const answersRef = collection(
        db,
        `quizpapers/ppr001/questions/${editingQuestionId}/answers`
      );

      for (const [key, value] of Object.entries(editedQuestion.answers)) {
        const answerDocRef = doc(answersRef, key);
        await updateDoc(answerDocRef, { answer: value });
      }

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === editingQuestionId
            ? { ...question, ...editedQuestion }
            : question
        )
      );
      setEditingQuestionId(null);
      toast.success("Update question successful!");
    } catch (error) {
      toast.error("Error saving question: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({ ...editedQuestion, [name]: value });
  };

  const handleAnswerChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({
      ...editedQuestion,
      answers: { ...editedQuestion.answers, [name]: value },
    });
  };

  const handleCorrectAnswerChange = (correctAnswer) => {
    setEditedQuestion({ ...editedQuestion, correct_answer: correctAnswer });
  };

  const onQuestionCreated = () => {
    fetchQuestions();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-transparent border-0">
            <h2 className="mb-5">Manage Daily Quiz</h2>
            <Button
              color="primary"
              onClick={() => {
                setQuizType("Daily Quiz");
                toggleModal();
              }}
            >
              Create Question
            </Button>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Question</th>
                <th scope="col">Option A</th>
                <th scope="col">Option B</th>
                <th scope="col">Option C</th>
                <th scope="col">Option D</th>
                <th scope="col">Answer</th>
                <th
                  style={{
                    position: "sticky",
                    right: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                  scope="col"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <Spinner color="primary" />
                  </td>
                </tr>
              ) : (
                currentQuestions.map((question, index) => (
                  <tr key={question.id}>
                    <td>{index + 1 + (currentPage - 1) * questionsPerPage}</td>
                    <td style={{ minWidth: "150px" }}>
                      {editingQuestionId === question.id ? (
                        <Input
                          type="textarea"
                          name="question"
                          value={editedQuestion.question}
                          onChange={handleInputChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        question.question
                      )}
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      {editingQuestionId === question.id ? (
                        <Input
                          type="textarea"
                          name="A"
                          value={editedQuestion.answers.A}
                          onChange={handleAnswerChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        question.answers && question.answers.A
                      )}
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      {editingQuestionId === question.id ? (
                        <Input
                          type="textarea"
                          name="B"
                          value={editedQuestion.answers.B}
                          onChange={handleAnswerChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        question.answers && question.answers.B
                      )}
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      {editingQuestionId === question.id ? (
                        <Input
                          type="textarea"
                          name="C"
                          value={editedQuestion.answers.C}
                          onChange={handleAnswerChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        question.answers && question.answers.C
                      )}
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      {editingQuestionId === question.id ? (
                        <Input
                          type="textarea"
                          name="D"
                          value={editedQuestion.answers.D}
                          onChange={handleAnswerChange}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        question.answers && question.answers.D
                      )}
                    </td>
                    <td style={{ minWidth: "150px" }}>
                      {editingQuestionId === question.id ? (
                        <FormGroup>
                          <Dropdown
                            isOpen={dropdownOpen}
                            toggle={toggleDropdown}
                          >
                            <DropdownToggle caret>
                              {editedQuestion.correct_answer || "Select Answer"}
                            </DropdownToggle>
                            <DropdownMenu>
                              {["A", "B", "C", "D"].map((answer) => (
                                <DropdownItem
                                  key={answer}
                                  onClick={() =>
                                    handleCorrectAnswerChange(answer)
                                  }
                                >
                                  {answer}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      ) : (
                        question.correct_answer
                      )}
                    </td>
                    <td
                      style={{
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                      }}
                    >
                      {editingQuestionId === question.id ? (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            onClick={handleSaveQuestion}
                          >
                            Save
                          </Button>{" "}
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() => setEditingQuestionId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
        <Pagination className="justify-content-end mt-3">
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              previous
              onClick={() => paginate(currentPage - 1)}
            />
          </PaginationItem>
          {[
            ...Array(Math.ceil(questions.length / questionsPerPage)).keys(),
          ].map((number) => (
            <PaginationItem
              key={number + 1}
              active={number + 1 === currentPage}
            >
              <PaginationLink onClick={() => paginate(number + 1)}>
                {number + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem
            disabled={
              currentPage >= Math.ceil(questions.length / questionsPerPage)
            }
          >
            <PaginationLink next onClick={() => paginate(currentPage + 1)} />
          </PaginationItem>
        </Pagination>
      </Container>

      <Modal className="modal-lg " isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <CreateQuestion
            toggleModal={toggleModal}
            quizType={quizType}
            onQuestionCreated={onQuestionCreated}
          />
        </ModalBody>
      </Modal>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default ManageDailyQuiz;
