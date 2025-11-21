import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import Navbar from "@/components/Navbar/Navbar";
import style from "./User.module.scss";
import userNavbarData from "@/json/userNavbar.json";
import { Link } from "@tanstack/react-router";

export default function User() {
  useDocumentTitle("User");

  return (
    <>
      <Navbar />
      <main className={style.Container}>
        <div className={style.Content}>
          <h1 className={style.Heading}>Admin page is here</h1>
          <div className={style.NavLinks}>
            {userNavbarData.map((item) => (
              <Link to={item.path} key={item.title} className={style.NavLink}>
                <div className={style.Heading}>Go to:</div>
                <div className={style.Value}>{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
