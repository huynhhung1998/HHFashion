// src/layouts/UserLayout.jsx
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Edit, Trash } from "lucide-react";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";

export default function UserLayout() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const usersPerPage = 10;
  const defaultAvatar = "https://via.placeholder.com/50";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.users)) data = res.data.users;
      else if (Array.isArray(res.data.data?.users)) data = res.data.data.users;
      else if (Array.isArray(res.data.data)) data = res.data.data;

      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Fetch users failed:", err?.response?.data ?? err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = [...new Set(users.map((u) => u.role).filter(Boolean))];
  const provinces = [...new Set(users.map((u) => u.province).filter(Boolean))];

  useEffect(() => {
    let data = [...users];
    if (search) {
      data = data.filter((u) =>
        u.fullname?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedRole) data = data.filter((u) => u.role === selectedRole);
    if (selectedProvince) data = data.filter((u) => u.province === selectedProvince);
    setFilteredUsers(data);
    setCurrentPage(1);
  }, [search, selectedRole, selectedProvince, users]);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeletingUser(null);
    } catch (err) {
      console.error("Xóa user thất bại:", err?.response?.data ?? err);
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      const res = await api.put(`/users/${id}`, data);
      const updatedUser = res.data?.data?.user;
      setUsers((prev) => prev.map((u) => (u._id === id ? updatedUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Cập nhật user thất bại:", err?.response?.data ?? err);
    }
  };

  const handleAddUser = async (data) => {
    try {
      const res = await api.post("/users", data);
      const newUser = res.data?.data?.user;
      setUsers((prev) => [...prev, newUser]);
      setAddingUser(false);
    } catch (err) {
      console.error("Thêm user thất bại:", err?.response?.data ?? err);
      throw err;
    }
  };

  // Role styles
  const roleStyles = {
    admin: { text: "text-red-600", bg: "bg-red-100" },
    seller: { text: "text-blue-600", bg: "bg-blue-100" },
    shipper: { text: "text-green-600", bg: "bg-green-100" },
    user: { text: "text-black", bg: "bg-gray-100" },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả vai trò</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tất cả tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          onClick={() => setAddingUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Thêm người dùng
        </button>
      </div>

      {/* Table wrapper — overflow-visible để hover-row tràn ra ngoài */}
      <div className="bg-white rounded-lg shadow relative overflow-visible">
        <table className="min-w-full border relative z-0">
          <thead>
            {/* header-row: nền xanh + spotlight chạy ngang (được render bằng ::before) */}
            <tr className="header-row relative overflow-hidden">
              <th className="p-3">
                <div className="animate-header-text">Người dùng</div>
              </th>
              <th className="p-3">
                <div className="animate-header-text">Liên hệ</div>
              </th>
              <th className="p-3">
                <div className="animate-header-text">Vai trò</div>
              </th>
              <th className="p-3">
                <div className="animate-header-text">Địa chỉ</div>
              </th>
              <th className="p-3 text-center">
                <div className="animate-header-text">Hành động</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((u) => {
                const roleKey = u.role?.toLowerCase();
                const role = roleStyles[roleKey] || roleStyles.user;
                return (
                  <tr
                    key={u._id}
                    className="border-b hover-row transition-transform duration-300"
                  >
                    {/* Người dùng (mỗi cell chứa div.cell-content để giữ text trên overlay) */}
                    <td className="p-3">
                      <div className="cell-content flex items-center gap-3">
                        <img
                          src={u.avatar || defaultAvatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span
                          className={`font-medium truncate max-w-[150px] sm:max-w-xs ${role.text}`}
                          title={u.fullname}
                        >
                          {u.fullname || u.username}
                        </span>
                      </div>
                    </td>

                    {/* Liên hệ */}
                    <td className="p-3 text-sm text-gray-600">
                      <div className="cell-content">
                        <div>{u.email}</div>
                        <div>{u.phone}</div>
                      </div>
                    </td>

                    {/* Vai trò */}
                    <td className="p-3">
                      <div className="cell-content">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${role.text} ${role.bg}`}
                          title={u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : "User"}
                        >
                          {u.role
                            ? u.role.charAt(0).toUpperCase() + u.role.slice(1)
                            : "User"}
                        </span>
                      </div>
                    </td>

                    {/* Địa chỉ */}
                    <td className="p-3 text-sm text-gray-600">
                      <div className="cell-content">{u.province || "Chưa cập nhật"}</div>
                    </td>

                    {/* Hành động */}
                    <td className="p-3 flex gap-2 justify-center">
                      <div className="cell-content flex gap-2">
                        <button onClick={() => setEditingUser(u)}>
                          <Edit className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                        </button>
                        <button onClick={() => setDeletingUser(u)}>
                          <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Không có người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {editingUser && (
        <UpdateUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onConfirm={handleUpdateUser}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={() => handleDeleteUser(deletingUser._id)}
        />
      )}
      {addingUser && (
        <AddUserModal
          isOpen={addingUser}
          onClose={() => setAddingUser(false)}
          onConfirm={handleAddUser}
        />
      )}

      {/* Styles (nhúng trong file, không cần file ngoài) */}
      <style jsx>{`
        /* ------------------------
           Header: nền xanh + spotlight chạy ngang
           - overlay (::before) chỉ ảnh hưởng nền (dùng transform để tránh reflow)
           - chữ có gradient riêng, z-index cao hơn overlay
           ------------------------ */
        .header-row {
          /* solid blue base (đổi theo ý bạn) */
          background:#0066FF;
          position: relative;
          overflow: hidden;
        }
        /* spotlight chạy ngang, dùng transform (GPU) => mượt, không reflow */
        .header-row::before {
  content: "";
  //position: absolute;
   inset: 0;
  //transform: translateX(-140%);
  // background: linear-gradient(
  //   90deg,
  //   rgba(255, 255, 255, 0) 0%,
  //   rgba(255, 255, 255, 0.8) 50%,   /* đậm hơn */
  //   rgba(255, 255, 255, 0) 100%
  // );
   background-size: 100% 100%;
  filter: blur(6px);   /* nét hơn */
  pointer-events: none;
  z-index: 1;
   animation: headerShine 2s linear infinite;
}

        .animate-header-text {
          /* chữ gradient xám -> trắng, animation độc lập */
          position: relative;
          z-index: 2; /* luôn trên overlay */
          display: inline-block;
          background: linear-gradient(90deg, 
#EEEEEE 95%, #ffffff 5%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 100%;
          animation: slideText 12s linear infinite;
        }

        @keyframes headerShine {
          0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
        }
        @keyframes slideText {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* ------------------------
           Hover row: overlay gradient xám->trắng 5 màu, scale nhẹ
           - overlay dùng ::before + transform để tránh reflow
           - text và cell-content đặt z-index cao để chữ không bị che/ảnh hưởng
           ------------------------ */
        .hover-row {
          position: relative;
          transition: transform 260ms ease, box-shadow 260ms ease;
        }

        /* overlay 5 màu (màu1 == màu5) — dùng inset negative để tràn ra ngoài */
        .hover-row::before {
          content: "";
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: 12px;
          transform: translateX(-120%);
          background: linear-gradient(
            135deg,
            #4b5563, /* màu 1 (xám đậm) */
            #9ca3af, /* màu 2 (nhạt hơn) */
            #ffffff, /* màu 3 (trắng) */
            #d1d5db, /* màu 4 (nhạt hơn) */
            #4b5563  /* màu 5 (trùng màu 1) */
          );
          background-size: 400% 400%;
          opacity: 0;
          pointer-events: none;
          z-index: 0; /* dưới nội dung */
        }

        .hover-row:hover {
          transform: scale(1.02);
          z-index: 40; /* nổi lên trên để không che bị cắt */
          box-shadow: 0 12px 30px rgba(2, 6, 23, 0.12);
        }

        .hover-row:hover::before {
          opacity: 1;
          transform: translateX(0%);
          animation: hoverGradientMove 15s linear infinite;
        }

        @keyframes hoverGradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* cell-content đứng trên overlay để chữ luôn rõ */
        .cell-content {
          position: relative;
          z-index: 2;
        }

        /* đảm bảo header/chữ có khoảng padding dễ nhìn */
        .header-row th .animate-header-text,
        .header-row td .animate-header-text {
          padding: 0.75rem; /* tương ứng p-3 */
          display: inline-block;
        }

        /* Badge và tên truncate */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* tối ưu responsive: giảm max-width tên user */
        @media (max-width: 640px) {
          .cell-content .truncate {
            max-width: 110px;
          }
        }
      `}</style>
    </div>
  );
}
