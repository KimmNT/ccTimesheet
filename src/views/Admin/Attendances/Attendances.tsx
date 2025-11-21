import Navbar from "@/components/Navbar/Navbar";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

export default function Attendances() {
  useDocumentTitle("Attendances");
  return (
    <>
      <Navbar />
      <main>Attendances</main>
    </>
  );
}
