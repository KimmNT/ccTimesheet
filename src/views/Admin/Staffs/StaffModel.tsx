import type { Staff } from "@/lib/staff/modal";
import style from "./StaffModel.module.scss";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useCreateStaff } from "@/utils/hooks/User/useCreateStaff";
import { useDeleteStaff } from "@/utils/hooks/User/useDeleteStaff";
import { useEditStaff } from "@/utils/hooks/User/useEditStaff";

type Props = {
  isCreate: boolean;
  isEdit: boolean;
  isDelete: boolean;
  onClose: () => void;
  selectedStaff?: Staff | null;
};

const ROLE_OPTIONS = ["Admin", "User"] as const;

export default function StaffModel(props: Props) {
  const { isCreate, isEdit, isDelete, onClose, selectedStaff } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { createStaff, isLoading, error } = useCreateStaff();
  const {
    deleteStaff,
    isLoading: isDeleteLoading,
    error: deleteError,
  } = useDeleteStaff();

  const {
    editStaff,
    isLoading: isEditLoading,
    error: editError,
  } = useEditStaff();

  const [userName, setUserName] = useState(selectedStaff?.userName || "");
  const [userEmail, setUserEmail] = useState(selectedStaff?.userEmail || "");
  const [userContact, setUserContact] = useState(
    selectedStaff?.userContact || ""
  );
  const [userBank, setUserBank] = useState(selectedStaff?.userBank || "");
  const [userSalary, setUserSalary] = useState(selectedStaff?.userSalary || "");
  const [userPassword, setUserPassword] = useState(
    selectedStaff?.userPassword || ""
  );
  const [role, setRole] = useState(selectedStaff?.role || "User");
  const [status, setStatus] = useState<boolean>(selectedStaff?.status ?? true);

  const handleCreate = async () => {
    const staffData = {
      userName,
      userEmail,
      userContact,
      userBank,
      userSalary,
      userPassword,
      role: role.toLowerCase(),
      status,
    };

    const newStaffId = await createStaff(staffData);
    if (newStaffId) {
      onClose();
    }
  };

  const handleEdit = () => {
    if (selectedStaff?.id) {
      const staffData = {
        userName,
        userEmail,
        userContact,
        userBank,
        userSalary,
        userPassword,
        role: role.toLowerCase(),
        status,
      };

      editStaff(selectedStaff.id, staffData).then((success) => {
        if (success) {
          onClose();
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedStaff?.id) {
      deleteStaff(selectedStaff.id).then((success) => {
        if (success) {
          onClose();
        }
      });
    }
  };

  return (
    <div className={style.PageContainer}>
      <div className={style.Content}>
        <div className={style.Header}>
          {isCreate && <h2 className={style.Heading}>Add New Staff Member</h2>}
          {isEdit && <h2 className={style.Heading}>Edit Staff Member</h2>}
          {isDelete && <h2 className={style.Heading}>Delete Staff Member</h2>}
          <button type="button" className={style.CloseButton} onClick={onClose}>
            <X className={style.CloseIcon} />
          </button>
        </div>
        <div className={style.Body}>
          {(isCreate || isEdit) && (
            <>
              <label className={style.Label}>
                Name:
                <input
                  ref={inputRef}
                  type="text"
                  className={style.Input}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label className={style.Label}>
                User name:
                <input
                  type="text"
                  className={style.Input}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="User name"
                />
              </label>
              <label className={style.Label}>
                Password:
                <input
                  type="text"
                  className={style.Input}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </label>
              <div className={style.Label}>
                Role:
                <div className={style.List}>
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={clsx(
                        style.ListItem,
                        role.toLowerCase() === option.toLowerCase() &&
                          style.ActiveListItem
                      )}
                      onClick={() => setRole(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <label className={style.Label}>
                Contact:
                <input
                  type="text"
                  className={style.Input}
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="Contact number"
                />
              </label>
              <label className={style.Label}>
                Bank Details:
                <input
                  type="text"
                  className={style.Input}
                  value={userBank}
                  onChange={(e) => setUserBank(e.target.value)}
                  placeholder="Bank account number"
                />
              </label>
              <label className={style.Label}>
                Salary:
                <input
                  type="text"
                  className={style.Input}
                  value={userSalary}
                  onChange={(e) => setUserSalary(e.target.value)}
                  placeholder="Salary amount"
                />
              </label>
              <div className={style.Label}>
                Status:
                <div className={style.List}>
                  <button
                    type="button"
                    className={clsx(
                      style.ListItem,
                      status && style.ActiveListItem
                    )}
                    onClick={() => setStatus(true)}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      style.ListItem,
                      !status && style.ActiveListItem
                    )}
                    onClick={() => setStatus(false)}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </>
          )}
          {isDelete && (
            <p>
              Are you sure you want to delete staff member "
              {selectedStaff?.userName}"?
            </p>
          )}
        </div>
        <div className={style.Actions}>
          <button type="button" onClick={onClose} className={style.CloseAction}>
            Cancel
          </button>
          <button
            type="button"
            className={style.ConfirmAction}
            onClick={
              isCreate ? handleCreate : isEdit ? handleEdit : handleDelete
            }
            disabled={isLoading}
          >
            {isLoading || isDeleteLoading || isEditLoading
              ? "Loading..."
              : isCreate
                ? "Add"
                : isEdit
                  ? "Update"
                  : "Delete"}
          </button>
        </div>
        {error ||
          editError ||
          (deleteError && <p className={style.Error}>{error}</p>)}
      </div>
    </div>
  );
}
