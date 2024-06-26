import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Card, CardHeader, Container, Table, Spinner } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("name", "asc"));
        const usersSnapshot = await getDocs(q);
        const userData = usersSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          index: index + 1,
          email: doc.data().email,
          name: doc.data().name,
          profilepic: doc.data().profilepic,
          createdAt: doc.data().createdAt.toDate(),
        }));
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching users: ", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body"></div>
        </Container>
      </div>
      <Container className="mt--7" fluid>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="mb-0">View User</h3>
          </CardHeader>
          <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Avatar</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Date created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <Spinner color="info" />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.index}</td>
                    <td>
                      {user.profilepic ? (
                        <img
                          src={user.profilepic}
                          alt={user.name}
                          style={{ width: 50, borderRadius: "50%" }}
                        />
                      ) : (
                        "No Photo"
                      )}
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.createdAt.toString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
      <ToastContainer autoClose={1000} />
    </>
  );
};

export default ViewUser;
