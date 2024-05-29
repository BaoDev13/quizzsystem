// CreateQuizPaper.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase"; // Điều chỉnh đường dẫn này nếu cần thiết
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { Button, Card, CardBody, CardHeader, Container, Form, Input } from "reactstrap";

const CreateQuizPaper = () => {
  const [quizPaperData, setQuizPaperData] = useState({
    Description: "",
    image_url: "",
    questions_count: 0,
    time_seconds: 0,
    title: "",
  });
  const [maxId, setMaxId] = useState(0);

  useEffect(() => {
    const fetchMaxId = async () => {
      const quizpapersCollectionRef = collection(db, "quizpapers");
      const q = query(quizpapersCollectionRef);
      const querySnapshot = await getDocs(q);

      let maxId = 0;
      querySnapshot.forEach((doc) => {
        const docId = doc.id;
        const idNumber = parseInt(docId.replace("ppr", ""), 10);
        if (idNumber > maxId) {
          maxId = idNumber;
        }
      });

      setMaxId(maxId);
    };

    fetchMaxId();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuizPaperData({ ...quizPaperData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newId = `ppr${(maxId + 1).toString().padStart(3, "0")}`;

    const quizPaperDataWithId = {
      id: newId,
      ...quizPaperData,
      questions_count: Number(quizPaperData.questions_count),
      time_seconds: Number(quizPaperData.time_seconds),
    };

    try {
      // Tạo tài liệu mới trong collection "quizpapers"
      const quizpapersCollectionRef = collection(db, "quizpapers");
      const docRef = doc(quizpapersCollectionRef, newId);
      await setDoc(docRef, quizPaperDataWithId);

      alert("Tạo quiz paper thành công!");
      setQuizPaperData({
        Description: "",
        image_url: "",
        questions_count: 0,
        time_seconds: 0,
        title: "",
      });
      setMaxId(maxId + 1);
    } catch (error) {
      console.error("Error creating document: ", error);
      alert("Tạo quiz paper thất bại!");
    }
  };

  return (
    <>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="mb-0">Tạo Quiz Paper Mới</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={quizPaperData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                type="textarea"
                name="Description"
                placeholder="Description"
                value={quizPaperData.Description}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="image_url"
                placeholder="Image URL"
                value={quizPaperData.image_url}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="questions_count"
                placeholder="Questions Count"
                value={quizPaperData.questions_count}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="time_seconds"
                placeholder="Time in Seconds"
                value={quizPaperData.time_seconds}
                onChange={handleInputChange}
                required
              />
              <Button type="submit" color="primary">
                Tạo Quiz Paper
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CreateQuizPaper;
