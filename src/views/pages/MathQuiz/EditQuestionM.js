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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  CKBox,
  CKBoxImageEdit,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  PictureEditing,
  RemoveFormat,
  SelectAll,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import "../../../assets/css/style.css";

const EditQuestionM = ({ toggleModal, question, fetchQuestions }) => {
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
        `quizpapers/ppr003/questions/${question.id}`
      );
      await updateDoc(questionDocRef, {
        question: editedQuestion.question,
        correct_answer: editedQuestion.correct_answer,
      });

      const answersRef = collection(
        db,
        `quizpapers/ppr003/questions/${question.id}/answers`
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

  const handleInputChange = (event, editor) => {
    let data = editor.getData();
    data = data.replace(/<\/?p[^>]*>/g, "");
    setEditedQuestion({ ...editedQuestion, question: data });
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

          <CKEditor
            editor={ClassicEditor}
            config={{
              plugins: [
                AccessibilityHelp,
                Alignment,
                Autoformat,
                AutoImage,
                AutoLink,
                Autosave,
                BlockQuote,
                Bold,
                CKBox,
                CKBoxImageEdit,
                CloudServices,
                Code,
                CodeBlock,
                Essentials,
                FindAndReplace,
                FontBackgroundColor,
                FontColor,
                FontFamily,
                FontSize,
                FullPage,
                GeneralHtmlSupport,
                Heading,
                Highlight,
                HorizontalLine,
                HtmlComment,
                HtmlEmbed,
                ImageBlock,
                ImageCaption,
                ImageInline,
                ImageInsert,
                ImageInsertViaUrl,
                ImageResize,
                ImageStyle,
                ImageTextAlternative,
                ImageToolbar,
                ImageUpload,
                Indent,
                IndentBlock,
                Italic,
                Link,
                LinkImage,
                List,
                ListProperties,
                Markdown,
                MediaEmbed,
                PageBreak,
                Paragraph,
                PasteFromMarkdownExperimental,
                PasteFromOffice,
                PictureEditing,
                RemoveFormat,
                SelectAll,
                ShowBlocks,
                SourceEditing,
                SpecialCharacters,
                SpecialCharactersArrows,
                SpecialCharactersCurrency,
                SpecialCharactersEssentials,
                SpecialCharactersLatin,
                SpecialCharactersMathematical,
                SpecialCharactersText,
                Strikethrough,
                Style,
                Subscript,
                Superscript,
                Table,
                TableCaption,
                TableCellProperties,
                TableColumnResize,
                TableProperties,
                TableToolbar,
                TextTransformation,
                TodoList,
                Underline,
                Undo,
              ],
              toolbar: {
                items: [
                  "undo",
                  "redo",
                  "|",
                  "sourceEditing",
                  "showBlocks",
                  "findAndReplace",
                  "selectAll",
                  "|",
                  "heading",
                  "style",
                  "|",
                  "fontSize",
                  "fontFamily",
                  "fontColor",
                  "fontBackgroundColor",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "subscript",
                  "superscript",
                  "code",
                  "removeFormat",
                  "|",
                  "specialCharacters",
                  "horizontalLine",
                  "pageBreak",
                  "link",
                  "insertImage",
                  "ckbox",
                  "mediaEmbed",
                  "insertTable",
                  "highlight",
                  "blockQuote",
                  "codeBlock",
                  "htmlEmbed",
                  "|",
                  "alignment",
                  "|",
                  "bulletedList",
                  "numberedList",
                  "todoList",
                  "indent",
                  "outdent",
                  "|",
                  "accessibilityHelp",
                ],
                shouldNotGroupWhenFull: true,
              },
            }}
            data={editedQuestion.question}
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
          <Label for="optionC">Option C</Label>
          <Input
            type="textarea"
            name="C"
            id="optionC"
            value={editedQuestion.answers.C}
            onChange={(e) => handleAnswerChange(e, "C")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="optionD">Option D</Label>
          <Input
            type="textarea"
            name="D"
            id="optionD"
            value={editedQuestion.answers.D}
            onChange={(e) => handleAnswerChange(e, "D")}
          />
        </FormGroup>
        <FormGroup>
          <Label for="correctAnswer">Correct Answer</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {editedQuestion.correct_answer || "Select Answer"}
            </DropdownToggle>
            <DropdownMenu>
              {["A", "B", "C", "D"].map((answer) => (
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

export default EditQuestionM;
