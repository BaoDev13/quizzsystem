import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Container,
  Card,
  CardBody,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(null);
  const [isConfirmPasswordMatch, setIsConfirmPasswordMatch] = useState(null);

  const handleOldPasswordChange = async (e) => {
    const { value } = e.target;
    setOldPassword(value);

    const user = auth.currentUser;
    if (user && value) {
      const credential = EmailAuthProvider.credential(user.email, value);
      try {
        await reauthenticateWithCredential(user, credential);
        setIsOldPasswordCorrect(true);
      } catch (error) {
        setIsOldPasswordCorrect(false);
      }
    } else {
      setIsOldPasswordCorrect(null);
    }
  };

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setIsConfirmPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setIsConfirmPasswordMatch(value === newPassword);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      toast.error("No user is signed in");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsOldPasswordCorrect(null);
      setIsConfirmPasswordMatch(null);
    } catch (error) {
      toast.error("Error updating password: " + error.message);
    }
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">{/* Card stats */}</div>
        </Container>
      </div>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="mb-0">Change Password</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleChangePassword}>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    required
                  />
                  {isOldPasswordCorrect !== null && (
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        {isOldPasswordCorrect ? (
                          <FaCheck className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </InputGroupText>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  {isConfirmPasswordMatch !== null && (
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        {isConfirmPasswordMatch ? (
                          <FaCheck className="text-success" />
                        ) : (
                          <FaTimes className="text-danger" />
                        )}
                      </InputGroupText>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </FormGroup>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
