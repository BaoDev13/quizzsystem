// src/components/Login.js
import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container,
} from "reactstrap";
import { doSignInWithEmailAndPassWord } from "../../firebase/auth";
import background from "../../assets/img/theme/background.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await doSignInWithEmailAndPassWord(email, password);
      toast.success("Login successful!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError(err.message);
      toast.error("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="main-content"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Page content */}
        <Container className="mt-0 pb-6">
          <Row className="justify-content-end">
            <Col lg="5" md="7">
              <Card
                className="bg-secondary shadow mt-4"
                style={{ borderRadius: "32px" }}
              >
                <CardHeader style={{ borderRadius: "32px" }}>
                  <div className="header-body text-center mb-1">
                    <Row className="justify-content-center">
                      <Col>
                        <img
                          alt=""
                          src={require("../../assets/img/icons/logoquiz.png")}
                          style={{ maxWidth: "40%", height: "auto" }}
                          className="img-fluid"
                        />
                        <h1 className="text-black">Welcome!</h1>
                        <p className="text-lead text-black">
                          Let's get started. Sign in to explore
                        </p>
                      </Col>
                    </Row>
                  </div>
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5">
                  <Form role="form" onSubmit={handleLogin}>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Username"
                          type="text"
                          autoComplete="new-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                    {error && (
                      <div className="text-center text-danger mb-3">
                        <small>{error}</small>
                      </div>
                    )}
                    <div className="text-center">
                      <Button className="my-3" color="primary" type="submit">
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
