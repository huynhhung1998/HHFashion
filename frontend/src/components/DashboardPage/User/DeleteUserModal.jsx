import { Button } from "../../ui/button";

export default function DeleteUserModal({ user, onConfirm, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
        <p className="mb-6">
          Bạn có chắc muốn xóa người dùng{" "}
          <span className="font-medium">{user.fullname || user.username}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
