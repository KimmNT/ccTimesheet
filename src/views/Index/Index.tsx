import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

export default function Index() {
  useDocumentTitle("Home");
  return (
    <>
      <main>Index</main>
    </>
  );
}
