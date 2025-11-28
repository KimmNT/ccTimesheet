import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import style from "./Account.module.scss";
import Navbar from "@/components/Navbar/Navbar";
import { useUserStore } from "@/store/useUserStore";
import { useGetSpecificStaff } from "@/utils/hooks/User/useGetSpecificStaff";
import { useCallback, useEffect, useState } from "react";
import type { Staff } from "@/lib/staff/modal";
import { Eye, EyeClosed, Pen } from "lucide-react";
import PasswordUpdateDialog from "./PasswordUpdateDialog";

export default function Account() {
  useDocumentTitle("Account");
  const user = useUserStore((state) => state.user);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPasswordUpdateDialogOpen, setIsPasswordUpdateDialogOpen] =
    useState<boolean>(false);

  const { getSpecificStaff } = useGetSpecificStaff();

  const handleGetStaff = useCallback(async () => {
    if (user && user.userId) {
      const staffData = await getSpecificStaff(user.userId);
      setStaff(staffData || null);
    }
  }, [getSpecificStaff, user]);

  useEffect(() => {
    handleGetStaff();
  }, [handleGetStaff, isPasswordUpdateDialogOpen]);

  return (
    <>
      <Navbar />
      <main className={style.PageContainer}>
        <div className={style.Content}>
          <div className={style.Item}>
            <div className={style.ItemHeading}>Account Settings</div>
            <div className={style.ItemContent}>
              <div className={style.Info}>
                <div className={style.Title}>Name</div>
                <div className={style.Value}>{staff?.userName}</div>
              </div>
              <div className={style.BreakLine}></div>
              <div className={style.Info}>
                <div className={style.Title}>User name</div>
                <div className={style.Value}>{staff?.userEmail}</div>
              </div>
              <div className={style.BreakLine}></div>

              <div className={style.Info}>
                <div className={style.Title}>Password</div>
                <div className={style.ValueContainer}>
                  <div className={style.Value}>
                    {isPasswordVisible ? staff?.userPassword : "*********"}
                  </div>
                  <button
                    type="button"
                    className={style.ValueContoller}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    {isPasswordVisible ? (
                      <Eye className={style.ValueIcon} />
                    ) : (
                      <EyeClosed className={style.ValueIcon} />
                    )}
                  </button>
                  <button
                    type="button"
                    className={style.ValueContoller}
                    onClick={() => setIsPasswordUpdateDialogOpen(true)}
                  >
                    <Pen className={style.ValueIcon} />
                  </button>
                </div>
              </div>
              <div className={style.BreakLine}></div>

              <div className={style.Info}>
                <div className={style.Title}>Contact</div>
                <div className={style.Value}>
                  {staff?.userContact === "" ? "..." : staff?.userContact}
                </div>
              </div>
              <div className={style.BreakLine}></div>

              <div className={style.Info}>
                <div className={style.Title}>Salary</div>
                <div className={style.Value}>
                  {staff?.userSalary === "" ? "..." : staff?.userSalary}¥
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPasswordUpdateDialogOpen && (
          <PasswordUpdateDialog
            userId={user?.userId ?? ""}
            onClose={() => setIsPasswordUpdateDialogOpen(false)}
            password={staff?.userPassword ?? ""}
          />
        )}
      </main>
    </>
  );
}
