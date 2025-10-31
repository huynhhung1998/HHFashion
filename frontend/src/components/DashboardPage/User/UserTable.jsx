import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserTable({ users, onEdit, onDelete, onRoleChange }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Người dùng</TableHead>
          <TableHead>Liên hệ</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="flex items-center gap-2">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.fullname}
                className="w-8 h-8 rounded-full"
              />
              {user.fullname}
            </TableCell>
            <TableCell>
              <div>{user.email}</div>
              <div className="text-sm text-gray-500">{user.phone}</div>
            </TableCell>
            <TableCell>
              <Select
                defaultValue={user.role}
                onValueChange={(value) => onRoleChange(user._id, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Khách hàng</SelectItem>
                  <SelectItem value="seller">Nhân viên</SelectItem>
                  <SelectItem value="shipper">Shipper</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {user.isActive ? (
                <span className="text-green-600 font-medium">Hoạt động</span>
              ) : (
                <span className="text-red-500 font-medium">Tạm khóa</span>
              )}
            </TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(user)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
