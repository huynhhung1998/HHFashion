import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function EditUserModal({ user, onClose, onSave }) {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  if (!user) return null;

  const handleSubmit = () => {
    const updatedUser = { ...user, fullname, email, phone };
    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h2>

        <div className="space-y-4 mb-6">
          <Input
            placeholder="Họ và tên"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}
