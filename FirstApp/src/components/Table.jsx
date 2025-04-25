import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import loadingGif from "../assets/loading.gif";

function Table() {
  const [acknowledged, setAcknowledged] = useState({});
  const [resolved, setResolved] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
        console.log(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAcknowledge = (id) => {
    setAcknowledged((prevAcknowledge) => ({
      ...prevAcknowledge,
      [id]: !prevAcknowledge[id],
    }));
  };

  useEffect(() => {
    console.log("Updated acknowledged", acknowledged);
  }, [acknowledged]);

  const handleResolve = (id) => {
    setResolved((prevResolved) => ({
      ...prevResolved,
      [id]: !prevResolved[id],
    }));
  };

  useEffect(() => {
    console.log("Updated resolved", resolved);
  }, [resolved]);

  if (loading)
    return <img className="mx-auto" src={loadingGif} alt="Loading..." />;

  return (
    <table className="border-2 w-full">
      <thead className="border-b-2">
        <tr className="p-2">
          <th className="p-2 text-center">ID</th>
          <th className="p-2 text-center">Patient Name</th>
          <th className="p-2 text-center">Gesture Message</th>
          <th className="p-2 text-center">Date & Time</th>
          <th className="p-2 text-center">Request Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="p-2">
            <td className="p-2 text-center">{user.id}</td>
            <td className="p-2 text-center">{user.name}</td>
            <td className="p-2 text-center">{user.gesture}</td>
            <td className="p-2 text-center">
              {user.date?.toDate ? user.date.toDate().toLocaleString() : "N/A"}
            </td>
            <td className="p-2 text-center">
              <div className="flex justify-evenly text-[#336B81]">
                <button
                  className={`border-1 text-center px-2 w-[130px] rounded-2xl border-[#336B81] hover:cursor-pointer active:scale-110 duration-100 transform-all ${
                    acknowledged[user.id] ? "bg-green-200" : ""
                  }`}
                  onClick={() => handleAcknowledge(user.id)}
                >
                  {acknowledged[user.id] ? "Acknowledged" : "Acknowledge"}
                </button>
                <button
                  className={`border-1 text-center px-2 w-[130px] rounded-2xl border-[#336B81] hover:cursor-pointer active:scale-110 duration-100 transform-all ${
                    resolved[user.id] ? "bg-yellow-200" : ""
                  }`}
                  onClick={() => handleResolve(user.id)}
                >
                  {resolved[user.id] ? "Resolved" : "Resolve"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
