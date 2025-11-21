import { Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar/Navbar";
import style from "./Admin.module.scss";
import adminNavData from "@/json/adminNavbar.json";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

export default function Admin() {
  useDocumentTitle("Admin");
  return (
    <>
      <Navbar />
      <main className={style.Container}>
        <div className={style.Content}>
          <h1 className={style.Heading}>Admin page is here</h1>
          <div className={style.NavLinks}>
            {adminNavData.map((item) => (
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
