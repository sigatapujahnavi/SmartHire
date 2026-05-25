// client/src/components/layout/DashboardLayout.jsx
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <Sidebar />
      <TopBar title={title} />
      <main className="ml-[156px] pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}