import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminUsersPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ isOpen: false, action: "", userId: "", userName: "" });

  const API_BASE = "http://localhost:4000/admin";

  // Fetch all users
  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users || []);
      else console.error("Failed to fetch users:", data.message);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const performAction = async () => {
    if (!modal.userId) return;
    try {
      const token = localStorage.getItem("token");
      let res;
      if (modal.action === "promote") {
        res = await fetch(`${API_BASE}/users/${modal.userId}/promote`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modal.action === "demote") {
        res = await fetch(`${API_BASE}/users/${modal.userId}/demote`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modal.action === "delete") {
        res = await fetch(`${API_BASE}/users/${modal.userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || `Failed to ${modal.action} user`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModal({ isOpen: false, action: "", userId: "", userName: "" });
    }
  };

  const openModal = (action, userId, userName) => {
    setModal({ isOpen: true, action, userId, userName });
  };

  const closeModal = () => {
    setModal({ isOpen: false, action: "", userId: "", userName: "" });
  };

  if (!user) return <p>Please login to manage users.</p>;
  if (loading) return <p>Loading users...</p>;
  if (!users || users.length === 0) return <p>No users found.</p>;

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) =>
            u ? (
              <tr key={u._id} className="text-center">
                <td className="border px-4 py-2">{u.name || "N/A"}</td>
                <td className="border px-4 py-2">{u.email || "N/A"}</td>
                <td className="border px-4 py-2">{u.role || "N/A"}</td>
                <td className="border px-4 py-2 space-x-2">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => openModal("promote", u._id, u.name)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Promote
                    </button>
                  )}
                  {u.role === "admin" && user && u._id !== user.userId && (
                    <button
                      onClick={() => openModal("demote", u._id, u.name)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Demote
                    </button>
                  )}
                  {user && u._id !== user.userId && (
                    <button
                      onClick={() => openModal("delete", u._id, u.name)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {/* Full window confirmation modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-xl font-bold mb-4">
              Are you sure you want to {modal.action} <br /> "{modal.userName}"?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={performAction}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;