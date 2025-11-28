import userNavbar from "@/json/userNavbar.json";
import adminNavbar from "@/json/adminNavbar.json";
import { Link, useNavigate } from "@tanstack/react-router";
import { clearSession, getUserRole } from "@/utils/auth/sessionManager";
import style from "./Navbar.module.scss";
import { useUserStore } from "@/store/useUserStore";
import {
  LogOut,
  Users,
  ClipboardList,
  Clock,
  Download,
  User2Icon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

// Map titles to icons
const navIcons: Record<string, LucideIcon> = {
  Staffs: Users,
  Attendance: ClipboardList,
  Reports: Download,
  "Clock In/Out": Clock,
  "My Attendance": ClipboardList,
  Account: User2Icon,
};

export default function Navbar() {
  const role = getUserRole();
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  const currentPath = window.location.pathname;

  const navbar = role === "admin" ? adminNavbar : userNavbar;

  const handleLogout = () => {
    clearSession();
    clearUser();
    navigate({ to: "/login" });
  };

  return (
    <div className={style.NavbarContainer}>
      <div className={style.NavLinks}>
        {navbar.map((nav, index) => {
          const IconComponent = navIcons[nav.title];
          return (
            <div key={index}>
              <Link
                to={nav.path}
                className={clsx(
                  style.NavLink,
                  currentPath === nav.path && style.ActiveNavLink
                )}
              >
                <IconComponent className={style.NavIcon} />
                <span className={style.NavText}>{nav.title}</span>
              </Link>
            </div>
          );
        })}
        <div className={style.UserSection}>
          <div className={style.UserInfo}>
            <p className={style.UserName}>{user?.userName}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={style.LogoutButton}
          >
            <LogOut className={style.Icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
