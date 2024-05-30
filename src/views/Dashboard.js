import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js";

import { chartOptions, parseOptions } from "variables/charts.js";

const Dashboard = (props) => {
  const [totalDailyQuestions, setTotalDailyQuestions] = useState(0);
  const [totalHistoricalQuestions, setTotalHistoricalQuestions] = useState(0);
  const [totalMathQuestions, setTotalMathQuestions] = useState(0);
  const [totalExamQuestions, setTotalExamQuestions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    const fetchData = async () => {
      const questionsDailyRef = collection(db, "quizpapers/ppr001/questions");
      const questionsDailySnapshot = await getDocs(questionsDailyRef);
      setTotalDailyQuestions(questionsDailySnapshot.size);

      const questionsHistoricalRef = collection(
        db,
        "quizpapers/ppr002/questions"
      );
      const questionsHistoricalSnapshot = await getDocs(questionsHistoricalRef);
      setTotalHistoricalQuestions(questionsHistoricalSnapshot.size);

      const questionsMathRef = collection(db, "quizpapers/ppr003/questions");
      const questionsMathSnapshot = await getDocs(questionsMathRef);
      setTotalMathQuestions(questionsMathSnapshot.size);

      const questionsExamRef = collection(db, "quizpapers/ppr004/questions");
      const questionsExamSnapshot = await getDocs(questionsExamRef);
      setTotalExamQuestions(questionsExamSnapshot.size);

      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      setTotalUsers(usersSnapshot.size);
    };

    fetchData();
  }, []);

  // Tạo dữ liệu cho biểu đồ lượt đăng ký
  const userData = {
    labels: ["Total Users"],
    datasets: [
      {
        label: "Total Users",
        data: [totalUsers],
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
                          <i className="fas fa-chart-bar" />
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
                          Total historical question
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalHistoricalQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
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
                          <i className="fas fa-users" />
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
                          <i className="fas fa-percent" />
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
                            totalHistoricalQuestions +
                            totalMathQuestions +
                            totalExamQuestions}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
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
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
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
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">User Registrations</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar data={userData} options={userOptions} />
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
