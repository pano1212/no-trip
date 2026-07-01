import { useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { AppView, BottomBar } from "./components/BottomBar";
import { AppHeader } from "./components/AppHeader";
import { FundPanel } from "./components/FundPanel";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { HistorySidebar } from "./components/HistorySidebar";
import { LoginPage } from "./components/LoginPage";
import { OverviewPage } from "./components/OverviewPage";
import { PaymentPanel } from "./components/PaymentPanel";
import { RegisterPage } from "./components/RegisterPage";
import { useFinance } from "./hooks/useFinance";
import { auth } from "./lib/firebase";
import { TripsScreen } from "./components/Trip";
import ProfilePage from "./components/Profile";
import ViewAll from "./components/viewAll";

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(auth));
  const [authPage, setAuthPage] = useState<"login" | "forgot-password" | "register">("login");

  useEffect(() => {
    if (!auth) {
      setIsCheckingAuth(false);
      return;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAuthPage("login");
      }
      setIsCheckingAuth(false);
    });
  }, []);

  if (isCheckingAuth) {
    return (
      <main className="mx-auto grid min-h-screen w-full max-w-160 items-center px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6">
        <section
          className="grid gap-7 rounded-[42px] bg-white/80 p-7 shadow-[0_8px_24px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[34px]"
          aria-label="Loading authentication"
        >
          <div className="mb-1.5">
            <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Trip finance</p>
            <h2 className="mt-2 font-display text-[clamp(1.55rem,5vw,1.9rem)] font-black text-[#162225]">
              Checking session
            </h2>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    if (authPage === "forgot-password") {
      return <ForgotPasswordPage onBackToLogin={() => setAuthPage("login")} />;
    }

    if (authPage === "register") {
      return <RegisterPage onBackToLogin={() => setAuthPage("login")} />;
    }

    return <LoginPage onForgotPassword={() => setAuthPage("forgot-password")} onRegister={() => setAuthPage("register")} />;
  }

  return <DashboardApp user={user} />;
}


function DashboardApp({ user }: { user: User }) {
  const finance = useFinance(user.uid);
  const [activeView, setActiveView] = useState<AppView>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <main className="mx-auto min-h-screen w-full max-w-160 px-5 pb-28 pt-4 max-[520px]:px-4">
      <HistorySidebar
        isOpen={isSidebarOpen}
        funds={finance.groupedTotals}
        payments={finance.payments}
        selectedFundId={finance.selectedGroupId}
        onClose={() => setIsSidebarOpen(false)}
        onCreateExpense={() => setActiveView("expenses")}
        onSelectFund={finance.setSelectedGroupId}
        onChangeView={setActiveView}
        onLogout={async () => {
          if (auth) {
            await signOut(auth);
          }
        }}
      />

      {activeView !== "expenses" && activeView !== "addtrip" && (
        <AppHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenProfile={() => setActiveView("profile")}
          fund={finance.selectedGroup}
        />
      )}

      {activeView === "home" && (
        <OverviewPage
          selectedFund={finance.selectedGroup}
          payments={finance.payments}
          totalSaved={finance.totalSaved}
          remaining={finance.remaining}
          onAddExpense={() => setActiveView("expenses")}
          onOpenViewALl={() => setActiveView("viewall")}
        />
      )}

      {activeView === "trips" && (
        <TripsScreen trips={finance.groupedTotals}
          onSelectFund={finance.setSelectedGroupId}
          onChangeView={() => setActiveView("home")}
          onAddExpense={() => setActiveView("addtrip")}></TripsScreen>
        // <FundPanel
        //   funds={finance.groupedTotals}
        //   selectedFundId={finance.selectedGroupId}
        //   onCreateFund={finance.addGroup}
        //   onSelectFund={finance.setSelectedGroupId}
        //   onClose={() => setActiveView("home")}
        // />
      )}

      {activeView === "profile" && (
        <ProfilePage />
      )}

      {activeView === "expenses" && (
        <PaymentPanel
          selectedFund={finance.selectedGroup}
          selectedFundId={finance.selectedGroupId}
          payments={finance.selectedPayments}
          totalSaved={finance.totalSaved}
          defaultDate={finance.defaultPaymentDate}
          onCreatePayment={finance.addPayment}
          onRemovePayment={finance.removePayment}
          onClose={() => setActiveView("home")}
        />
      )}
      {activeView === "addtrip" && (
        <FundPanel
          funds={finance.groupedTotals}
          selectedFundId={finance.selectedGroupId}
          onCreateFund={finance.addGroup}
          onSelectFund={finance.setSelectedGroupId}
          onClose={() => setActiveView("trips")}
        />
      )}

      {activeView === "viewall" && (
        <ViewAll
          funds={finance.groupedTotals}
          onChangeView={() => setActiveView("expenses")}
          onSelectFund={finance.setSelectedGroupId}
          payments={finance.payments} />
      )}

      {activeView !== "expenses" && (
        <BottomBar activeView={activeView} onChangeView={setActiveView} />
      )}


    </main>
  );
}
