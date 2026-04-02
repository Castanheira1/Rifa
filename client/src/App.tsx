import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { Link } from "wouter";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCriarRifa from "./pages/AdminCriarRifa";
import AdminGerenciarRifa from "./pages/AdminGerenciarRifa";
import RifasPublicas from "./pages/RifasPublicas";
import RifaDetalhe from "./pages/RifaDetalhe";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/rifas" component={RifasPublicas} />
      <Route path="/rifa/:id" component={RifaDetalhe} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/criar-rifa" component={AdminCriarRifa} />
      <Route path="/admin/rifa/:id" component={AdminGerenciarRifa} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster richColors />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
