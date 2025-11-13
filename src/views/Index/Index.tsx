import Navbar from "@/components/Navbar/Navbar";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

export default function Index() {
  useDocumentTitle("Home");
  return (
    <>
      <Navbar />
      <main>Index</main>
    </>
  );
}
