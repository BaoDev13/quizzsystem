import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
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
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const CreateQuestionM = ({ toggleModal, quizType, onQuestionCreated }) => {
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
    };

    fetchQuizPapers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(question, "text/html");
    const questionText = parsedHtml.body.textContent || "";
    const questionData = {
      question: questionText,
      correct_answer: correctAnswer,
    };

    try {
      // Thêm câu hỏi vào collection "questions" và lấy ID mới
      const selectedQuizPaper = typeData.find((item) => item.title === type);
      if (!selectedQuizPaper) {
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
      await updateDoc(countDocRef, {
        questions_count: currentCount + 1,
      });

      // Thêm các câu trả lời vào collection "answers" trong document của câu hỏi với ID mới
      for (let [identifier, answer] of Object.entries(answers)) {
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

      toast.success("Question added successfully!");
      setQuestion("");
      setAnswers({ A: "", B: "", C: "", D: "" });
      setCorrectAnswer("");
      toggleModal();
      onQuestionCreated();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Add new question failed!");
    }
  };

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
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
              data="Enter content question!"
              onReady={(editor) => {}}
              onChange={(event, editor) => setQuestion(editor.getData())}
            />
          </FormGroup>

          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="answerA">Answer A</Label>
                <Input
                  type="text"
                  id="answerA"
                  name="A"
                  placeholder="Enter answer A"
                  value={answers.A}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="answerB">Answer B</Label>
                <Input
                  type="text"
                  id="answerB"
                  name="B"
                  placeholder="Enter answer B"
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
                <Label for="answerC">Answer C</Label>
                <Input
                  type="text"
                  id="answerC"
                  name="C"
                  placeholder="Enter answer C"
                  value={answers.C}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="answerD">Answer D</Label>
                <Input
                  type="text"
                  id="answerD"
                  name="D"
                  placeholder="Enter answer D"
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
              <DropdownToggle caret disabled>
                {type || "Please select question type"}
              </DropdownToggle>
              <DropdownMenu>
                {typeData.map((item, index) => (
                  <DropdownItem onClick={() => setType(item.title)} key={index}>
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
      </Container>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default CreateQuestionM;
