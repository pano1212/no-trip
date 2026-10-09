import { useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { AppView, BottomBar } from "./components/BottomBar";
import { AppHeader } from "./components/AppHeader";
import { AppBootScreen } from "./components/AppBootScreen";
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
import { PaymentGroup } from "./types/finance";

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
    return <AppBootScreen label="Checking your session" />;
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
  const [tripBeingEdited, setTripBeingEdited] = useState<PaymentGroup | null>(null);
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

      {activeView !== "expenses" &&
        activeView !== "addtrip" &&
        activeView !== "viewall" &&
        activeView !== "profile" && (
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
        <TripsScreen
          trips={finance.groupedTotals}
          onSelectFund={finance.setSelectedGroupId}
          onChangeView={() => setActiveView("home")}
          onAddExpense={() => {
            setTripBeingEdited(null);
            setActiveView("addtrip");
          }}
          onEditTrip={(trip) => {
            setTripBeingEdited(trip);
            finance.setSelectedGroupId(trip.id);
            setActiveView("addtrip");
          }}
          onDeleteTrip={finance.removeGroup}
        />
      )}

      {activeView === "profile" && (
        <ProfilePage
          user={user}
          tripCount={finance.groupedTotals.length}
          expenseCount={finance.payments.length}
          totalSpent={finance.allSaved}
          totalBudget={finance.groupedTotals.reduce((sum, trip) => sum + (trip.budget || 0), 0)}
          preferredCurrency={finance.selectedGroup?.currency}
          onChangeView={setActiveView}
          onLogout={async () => {
            if (auth) {
              await signOut(auth);
            }
          }}
        />
      )}

      {activeView === "expenses" && (
        <PaymentPanel
          selectedFund={finance.selectedGroup}
          selectedFundId={finance.selectedGroupId}
          payments={finance.selectedPayments}
          totalSaved={finance.totalSaved}
          defaultDate={finance.defaultPaymentDate}
          defaultTime={finance.defaultPaymentTime}
          onCreatePayment={finance.addPayment}
          onRemovePayment={finance.removePayment}
          onClose={() => setActiveView("home")}
        />
      )}
      {activeView === "addtrip" && (
        <FundPanel
          funds={finance.groupedTotals}
          selectedFundId={finance.selectedGroupId}
          tripToEdit={tripBeingEdited ?? undefined}
          onCreateFund={finance.addGroup}
          onUpdateFund={finance.updateGroup}
          onSelectFund={finance.setSelectedGroupId}
          onClose={() => {
            setTripBeingEdited(null);
            setActiveView("trips");
          }}
        />
      )}

      {activeView === "viewall" && (
        <ViewAll
          selectedFund={finance.selectedGroup}
          payments={finance.selectedPayments}
          onBack={() => setActiveView("home")}
        />
      )}

      {activeView !== "expenses" && activeView !== "addtrip" && (
        <BottomBar activeView={activeView} onChangeView={setActiveView} />
      )}


    </main>
  );
}
