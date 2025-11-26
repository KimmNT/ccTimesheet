import Navbar from "@/components/Navbar/Navbar";
import style from "./Staffs.module.scss";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import { useGetAllStaff } from "@/utils/hooks/User/useGetAllStaff";
import { Eye, EyeOff, Pen, Plus, Trash2, X } from "lucide-react";
import clsx from "clsx";
import Loading from "@/components/Loading/Loading";
import { useRef, useState } from "react";
import StaffDialog from "./StaffDialog";
import type { Staff } from "@/lib/staff/modal";

const STATUS_OPTIONS = ["All", "Active", "Inactive"] as const;
const ROLE_OPTIONS = ["All", "Admin", "User"] as const;

const DEFAULT_STAFF: Staff = {
  id: "",
  role: "",
  userBank: "",
  userContact: "",
  userEmail: "",
  userName: "",
  userPassword: "",
  userSalary: "",
};

export default function Staffs() {
  useDocumentTitle("Staffs");
  const inputRef = useRef<HTMLInputElement>(null);

  const { staff, loading, error, refetch } = useGetAllStaff();
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const togglePasswordVisibility = (id: string) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const [filterByName, setFilterByName] = useState("");
  const [filterByRole, setFilterByRole] = useState<"Admin" | "User" | "All">(
    "All"
  );
  const [filterByStatus, setFilterByStatus] = useState<
    "Active" | "Inactive" | "All"
  >("All");

  const staffListFiltered = staff.filter((member) => {
    const roleMatch =
      filterByRole === "All" ||
      member.role.toLowerCase() === filterByRole.toLowerCase();

    const nameMatch =
      filterByName === "" ||
      member.userName.toLowerCase().includes(filterByName.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(filterByName.toLowerCase());

    const statusMatch =
      filterByStatus === "All" ||
      member.status === (filterByStatus === "Active");

    return roleMatch && nameMatch && statusMatch;
  });

  const [isStaffModelOpen, setIsStaffModelOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff>(DEFAULT_STAFF);

  const openStaffModel = (
    isCreate: boolean,
    isEdit: boolean,
    isDelete: boolean,
    staff?: Staff
  ) => {
    setIsCreate(isCreate);
    setIsEdit(isEdit);
    setIsDelete(isDelete);
    setIsStaffModelOpen(true);
    setSelectedStaff(staff || DEFAULT_STAFF);
  };

  const handleCloseStaffModel = () => {
    setIsStaffModelOpen(false);
    refetch();
  };

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={style.Header}>
            <h1 className={style.Heading}>Staffs Management</h1>
            <button
              type="button"
              className={style.ActionButton}
              onClick={() => openStaffModel(true, false, false, DEFAULT_STAFF)}
            >
              <Plus className={style.ActionIcon} />
              <div className={style.ActionHeading}>Add Staff</div>
            </button>
          </div>
          <div className={style.FilterContainer}>
            <div className={style.SearchContainer}>
              <input
                ref={inputRef}
                type="text"
                value={filterByName}
                onChange={(e) => setFilterByName(e.target.value)}
                placeholder="Search by name or user name"
              />
              {filterByName.length > 0 && (
                <button
                  type="button"
                  className={style.ClearButton}
                  onClick={() => {
                    setFilterByName("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <X className={style.ClearIcon} />
                </button>
              )}
            </div>
            <div className={style.FilterGroupContainer}>
              <div className={style.FilterItemOptions}>
                {ROLE_OPTIONS.map((role, index) => (
                  <button
                    type="button"
                    key={index}
                    className={clsx(
                      style.FilterButton,
                      filterByRole === role && style.ActiveFilterButton
                    )}
                    onClick={() => setFilterByRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className={style.FilterItemOptions}>
                {STATUS_OPTIONS.map((status, index) => (
                  <button
                    type="button"
                    key={index}
                    className={clsx(
                      style.FilterButton,
                      filterByStatus === status && style.ActiveFilterButton
                    )}
                    onClick={() => setFilterByStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {loading && <Loading color="#000" />}
          {error && <p className={style.Error}>Error: {error}</p>}
          {!loading && !error && (
            <>
              {staffListFiltered.length === 0 ? (
                <p className={style.NotFound}>No staff members found.</p>
              ) : (
                <div className={style.TableContainer}>
                  <table className={style.StaffTable}>
                    <thead className={style.TableHeader}>
                      <tr className={style.Row}>
                        <th className={style.HeaderCell}>Name</th>
                        <th className={style.HeaderCell}>User name</th>
                        <th className={style.HeaderCell}>Password</th>
                        <th className={style.HeaderCell}>Role</th>
                        <th className={style.HeaderCell}>Contact Info</th>
                        <th className={style.HeaderCell}>Bank Account</th>
                        <th className={style.HeaderCell}>Salary</th>
                        <th className={style.HeaderCell}>Status</th>
                        <th className={style.HeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={style.TableBody}>
                      {staffListFiltered.map((member) => (
                        <tr key={member.id} className={style.Row}>
                          <td className={style.Value}>{member.userName}</td>
                          <td className={style.Value}>{member.userEmail}</td>
                          <td className={clsx(style.Value, style.PasswordCell)}>
                            <span>
                              {passwordVisibility[member.id]
                                ? member.userPassword
                                : "•".repeat(8)}
                            </span>
                            <button
                              onClick={() =>
                                togglePasswordVisibility(member.id)
                              }
                              className={clsx(
                                style.Button,
                                style.PasswordToggleButton
                              )}
                            >
                              {passwordVisibility[member.id] ? (
                                <EyeOff className={style.PasswordToggleIcon} />
                              ) : (
                                <Eye className={style.PasswordToggleIcon} />
                              )}
                            </button>
                          </td>
                          <td className={style.Value}>{member.role}</td>
                          <td className={style.Value}>{member.userContact}</td>
                          <td className={style.Value}>{member.userBank}</td>
                          <td className={style.Value}>{member.userSalary}</td>
                          <td className={style.Value}>
                            <span
                              className={clsx(
                                style.Status,
                                member.status ? style.Active : style.Inactive
                              )}
                            >
                              {member.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className={style.Value}>
                            <button
                              className={clsx(style.Button)}
                              onClick={() =>
                                openStaffModel(false, true, false, member)
                              }
                            >
                              <Pen className={style.EditIcon} />
                            </button>
                            <button
                              className={clsx(style.Button)}
                              onClick={() =>
                                openStaffModel(false, false, true, member)
                              }
                            >
                              <Trash2 className={style.DeleteIcon} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* <button onClick={refetch} className={style.RefreshButton}>
                Refresh
              </button> */}
            </>
          )}
        </div>
        {isStaffModelOpen && (
          <StaffDialog
            isCreate={isCreate}
            isEdit={isEdit}
            isDelete={isDelete}
            selectedStaff={selectedStaff}
            onClose={handleCloseStaffModel}
          />
        )}
      </main>
    </>
  );
}
