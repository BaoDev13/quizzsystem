import React, { useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";
import { updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";

const EditQuestionTF = ({ toggleModal, question, fetchQuestions }) => {
  const [editedQuestion, setEditedQuestion] = useState({
    question: question.question,
    answers: { ...question.answers },
    correct_answer: question.correct_answer,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (question) {
      setEditedQuestion({
        question: question.question,
        answers: { ...question.answers },
        correct_answer: question.correct_answer,
      });
    }
  }, [question]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleSaveQuestion = async () => {
    try {
      const questionDocRef = doc(
        db,
        `quizpapers/ppr002/questions/${question.id}`
      );
      await updateDoc(questionDocRef, {
        question: editedQuestion.question,
        correct_answer: editedQuestion.correct_answer,
      });

      const answersRef = collection(
        db,
        `quizpapers/ppr002/questions/${question.id}/answers`
      );

      for (const [key, value] of Object.entries(editedQuestion.answers)) {
        const answerDocRef = doc(answersRef, key);
        await updateDoc(answerDocRef, { answer: value });
      }

      fetchQuestions();
      toast.success("Update question successful!");
      toggleModal();
    } catch (error) {
      toast.error("Error saving question: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({ ...editedQuestion, [name]: value });
  };

  const handleAnswerChange = (e, answerKey) => {
    const { value } = e.target;
    setEditedQuestion({
      ...editedQuestion,
      answers: { ...editedQuestion.answers, [answerKey]: value },
    });
  };

  const handleCorrectAnswerChange = (correctAnswer) => {
    setEditedQuestion({ ...editedQuestion, correct_answer: correctAnswer });
  };

  return (
    <>
      <Container>
        <FormGroup>
          <Label for="question">Question</Label>
          <Input
            type="textarea"
            name="question"
            id="question"
            value={editedQuestion.question}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="optionA">Option A</Label>
          <Input
            type="textarea"
            name="A"
            id="optionA"
            value={editedQuestion.answers.A}
            onChange={(e) => handleAnswerChange(e, "A")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="optionB">Option B</Label>
          <Input
            type="textarea"
            name="B"
            id="optionB"
            value={editedQuestion.answers.B}
            onChange={(e) => handleAnswerChange(e, "B")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="correctAnswer">Correct Answer</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {editedQuestion.correct_answer || "Select Answer"}
            </DropdownToggle>
            <DropdownMenu>
              {["A", "B"].map((answer) => (
                <DropdownItem
                  key={answer}
                  onClick={() => handleCorrectAnswerChange(answer)}
                >
                  {answer}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
        <Button color="primary" onClick={handleSaveQuestion}>
          Save
        </Button>{" "}
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </Container>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default EditQuestionTF;
