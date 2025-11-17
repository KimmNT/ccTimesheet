import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import Navbar from "@/components/Navbar/Navbar";

export default function User() {
  useDocumentTitle("User");

  return (
    <>
      <Navbar />
      <main>
        <h1>User page is here</h1>
      </main>
    </>
  );
}
