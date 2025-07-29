import { Outlet } from "react-router-dom"; // ✅ Import this
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Page Content */}
      <main className="min-h-[calc(100vh-64px)] bg-gray-50">
        <Outlet /> {/* ✅ This renders the nested route's component */}
      </main>
    </>
  );
}
