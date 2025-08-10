import CubeSolver from "./pages/cube-solver";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";

export default function App() {
  return (
    <TooltipProvider>
      <CubeSolver />
      <Toaster />
    </TooltipProvider>
  );
}
