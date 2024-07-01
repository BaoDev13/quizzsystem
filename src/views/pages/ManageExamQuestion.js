import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  updateDoc,
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
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import CreateQuestion from "./CreateQuestion";
import EditQuestion from "./EditQuestion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ManageExamQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quizType, setQuizType] = useState("");

  const [questionsCount, setQuestionsCount] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const toggleModal = () => setModalOpen((prevState) => !prevState);
  const toggleModalEdit = () => setModalOpenEdit((prevState) => !prevState);
  const toggleSettingsModal = () =>
    setSettingsModalOpen((prevState) => !prevState);

  const fetchQuestions = async () => {
    try {
      const questionsRef = collection(db, "quizpapers/ppr004/questions");
      const questionsSnapshot = await getDocs(questionsRef);
      const data = [];

      for (const questionDoc of questionsSnapshot.docs) {
        const questionData = questionDoc.data();
        const questionId = questionDoc.id;

        const answersRef = collection(
          db,
          `quizpapers/ppr004/questions/${questionId}/answers`
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
    fetchQuizSettings();
  }, []);

  const fetchQuizSettings = async () => {
    try {
      const quizSettingsDocRef = doc(db, "quizpapers/ppr004");
      const quizSettingsDoc = await getDoc(quizSettingsDocRef);
      if (quizSettingsDoc.exists()) {
        const { questions_count, time_seconds } = quizSettingsDoc.data();
        setQuestionsCount(questions_count);
        setTimeSeconds(time_seconds);
      } else {
        toast.error("Quiz settings document does not exist");
      }
    } catch (error) {
      toast.error("Error fetching quiz settings: " + error.message);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const quizSettingsDocRef = doc(db, "quizpapers/ppr004");
      await updateDoc(quizSettingsDocRef, {
        questions_count: questionsCount,
        time_seconds: timeSeconds,
      });
      toast.success("Quiz settings updated successfully!");
      setSettingsModalOpen(false);
    } catch (error) {
      toast.error("Error updating quiz settings: " + error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const batch = writeBatch(db);
      const answersRef = collection(
        db,
        `quizpapers/ppr004/questions/${questionId}/answers`
      );
      const answersSnapshot = await getDocs(answersRef);
      answersSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      const questionDocRef = doc(
        db,
        `quizpapers/ppr004/questions/${questionId}`
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
    setSelectedQuestion(question); // Set the selected question for editing
    toggleModalEdit(); // Open the Edit modal
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const batch = writeBatch(db);

      jsonData.forEach((row) => {
        const [question, optionA, optionB, optionC, optionD, correct_answer] =
          row;
        if (
          question &&
          optionA &&
          optionB &&
          optionC &&
          optionD &&
          correct_answer
        ) {
          const newQuestionRef = doc(
            collection(db, "quizpapers/ppr004/questions")
          );
          batch.set(newQuestionRef, {
            question,
            correct_answer,
          });
          batch.set(doc(newQuestionRef, "answers", "A"), { answer: optionA });
          batch.set(doc(newQuestionRef, "answers", "B"), { answer: optionB });
          batch.set(doc(newQuestionRef, "answers", "C"), { answer: optionC });
          batch.set(doc(newQuestionRef, "answers", "D"), { answer: optionD });
        }
      });

      try {
        await batch.commit();
        toast.success("Questions imported successfully!");
        fetchQuestions();
      } catch (error) {
        toast.error("Error importing questions: ", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      {
        question: "Sample Question",
        optionA: "Option A",
        optionB: "Option B",
        optionC: "Option C",
        optionD: "Option D",
        correct_answer: "A",
      },
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "template.xlsx"
    );
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-transparent border-0">
            <h2 className="mb-5">Manage Exam Quiz</h2>
            <Button
              color="primary"
              onClick={() => {
                setQuizType("Exam Quiz");
                toggleModal();
              }}
            >
              <i class="fa-regular fa-square-plus"></i> Create new question
            </Button>
            <Button color="info" onClick={handleDownloadTemplate}>
              <i class="fa-solid fa-download"></i> Download Template
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              id="fileUpload"
              onChange={handleFileUpload}
            />
            <Button
              color="warning"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <i class="fa-solid fa-upload"></i> Import questions from Excel
            </Button>
            <Button color="info" className="ml-2" onClick={toggleSettingsModal}>
              <i class="fa-solid fa-gear"></i>
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
                    <td style={{ minWidth: "150px" }}>{question.question}</td>
                    <td style={{ minWidth: "200px" }}>{question.answers.A}</td>
                    <td style={{ minWidth: "200px" }}>{question.answers.B}</td>
                    <td style={{ minWidth: "200px" }}>{question.answers.C}</td>
                    <td style={{ minWidth: "200px" }}>{question.answers.D}</td>
                    <td style={{ minWidth: "150px" }}>
                      {question.correct_answer}
                    </td>
                    <td
                      style={{
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                      }}
                    >
                      <>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </Button>
                      </>
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
        <ModalHeader toggle={toggleModal}>Add new question</ModalHeader>
        <ModalBody>
          <CreateQuestion
            toggleModal={toggleModal}
            quizType={quizType}
            onQuestionCreated={onQuestionCreated}
          />
        </ModalBody>
      </Modal>
      {selectedQuestion && (
        <Modal
          className="modal-lg "
          isOpen={modalOpenEdit}
          toggle={toggleModalEdit}
        >
          <ModalHeader toggle={toggleModalEdit}>Edit question</ModalHeader>
          <ModalBody>
            <EditQuestion
              toggleModal={toggleModalEdit}
              question={selectedQuestion}
              fetchQuestions={fetchQuestions}
              quizPaperId={"ppr004"}
            />
          </ModalBody>
        </Modal>
      )}
      <Modal isOpen={settingsModalOpen} toggle={toggleSettingsModal}>
        <ModalHeader toggle={toggleSettingsModal}>Quiz Settings</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="questionsCount">Number of Questions</Label>
            <Input
              type="number"
              id="questionsCount"
              value={questionsCount}
              onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <Label for="timeSeconds">Time for Quiz (seconds)</Label>
            <Input
              type="number"
              id="timeSeconds"
              value={timeSeconds}
              onChange={(e) => setTimeSeconds(parseInt(e.target.value))}
            />
          </FormGroup>
          <Button color="primary" onClick={handleSaveSettings}>
            Save
          </Button>{" "}
          <Button color="secondary" onClick={() => setSettingsModalOpen(false)}>
            Cancel
          </Button>
        </ModalBody>
      </Modal>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default ManageExamQuiz;
