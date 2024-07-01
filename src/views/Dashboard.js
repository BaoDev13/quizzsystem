import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Bar, Doughnut } from "react-chartjs-2"; // Import Doughnut chart
import Chart from "chart.js";
import moment from "moment";

import { chartOptions, parseOptions } from "variables/charts.js";
import MyIcon from "../assets/img/icons/true-or-false.png";

const Dashboard = (props) => {
  const [totalDailyQuestions, setTotalDailyQuestions] = useState(0);
  const [totalTrueFalseQuestions, setTotalTrueFalseQuestions] = useState(0);
  const [totalMathQuestions, setTotalMathQuestions] = useState(0);
  const [totalExamQuestions, setTotalExamQuestions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userRegistrations, setUserRegistrations] = useState([]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    const fetchData = async () => {
      const questionsDailyRef = collection(db, "quizpapers/ppr001/questions");
      const questionsDailySnapshot = await getDocs(questionsDailyRef);
      setTotalDailyQuestions(questionsDailySnapshot.size);

      const questionsTrueFalseRef = collection(
        db,
        "quizpapers/ppr002/questions"
      );
      const questionsTrueFalseSnapshot = await getDocs(questionsTrueFalseRef);
      setTotalTrueFalseQuestions(questionsTrueFalseSnapshot.size);

      const questionsMathRef = collection(db, "quizpapers/ppr003/questions");
      const questionsMathSnapshot = await getDocs(questionsMathRef);
      setTotalMathQuestions(questionsMathSnapshot.size);

      const questionsExamRef = collection(db, "quizpapers/ppr004/questions");
      const questionsExamSnapshot = await getDocs(questionsExamRef);
      setTotalExamQuestions(questionsExamSnapshot.size);

      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, orderBy("createdAt"));
      const usersSnapshot = await getDocs(usersQuery);
      setTotalUsers(usersSnapshot.size);

      const registrations = usersSnapshot.docs.map((doc) => ({
        date: doc.data().createdAt.toDate(),
        count: 1,
      }));

      setUserRegistrations(registrations);
    };

    fetchData();
  }, []);

  // Tạo dữ liệu cho biểu đồ lượt đăng ký theo tháng
  const aggregateRegistrationsByMonth = (registrations) => {
    const aggregated = registrations.reduce((acc, curr) => {
      const month = moment(curr.date).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += curr.count;
      return acc;
    }, {});

    const months = Object.keys(aggregated);
    const counts = Object.values(aggregated);

    return { months, counts };
  };

  const { months, counts } = aggregateRegistrationsByMonth(userRegistrations);

  // Dữ liệu cho biểu đồ hình tròn
  const totalQuestions =
    totalDailyQuestions +
    totalTrueFalseQuestions +
    totalMathQuestions +
    totalExamQuestions;
  const dataPie = {
    labels: ["Daily", "True/False", "Math", "Exam"],
    datasets: [
      {
        label: "Question Types",
        data: [
          ((totalDailyQuestions / totalQuestions) * 100).toFixed(2),
          ((totalTrueFalseQuestions / totalQuestions) * 100).toFixed(2),
          ((totalMathQuestions / totalQuestions) * 100).toFixed(2),
          ((totalExamQuestions / totalQuestions) * 100).toFixed(2),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsPie = {
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const userData = {
    labels: months,
    datasets: [
      {
        label: "User Registrations",
        data: counts,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const userOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
    },
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3" className="mb-5">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total daily question
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalDailyQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fa-solid fa-clipboard-question"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total True/False question
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalTrueFalseQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <img
                            src={MyIcon}
                            alt="My Icon"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total math question
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalMathQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fa-solid fa-calculator"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total exam question
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalExamQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-file-circle-question"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Questions
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalDailyQuestions +
                            totalTrueFalseQuestions +
                            totalMathQuestions +
                            totalExamQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fa-solid fa-question"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Registered Devices
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalUsers}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fa-solid fa-users"></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">User Registrations</h2>
              </CardHeader>
              <CardBody>
                {/* Bar Chart */}
                <div className="chart">
                  <Bar data={userData} options={userOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h2 className="mb-0">Question</h2>
              </CardHeader>
              <CardBody>
                {/* Doughnut Chart */}
                <div className="chart">
                  <Doughnut data={dataPie} options={optionsPie} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5"></Row>
      </Container>
    </>
  );
};

export default Dashboard;
