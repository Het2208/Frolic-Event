import { useEffect, useState } from "react";
import axios from "axios";

export default function InstituteList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Institute List</h1>

      {users.map(user => (
        <div key={user._id}>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
