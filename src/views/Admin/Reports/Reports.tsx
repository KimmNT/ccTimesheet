import Navbar from "@/components/Navbar/Navbar";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import React from "react";

export default function Reports() {
  useDocumentTitle("Reports");
  return (
    <>
      <Navbar />
      <main>Reports</main>
    </>
  );
}
