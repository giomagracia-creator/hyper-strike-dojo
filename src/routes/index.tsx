import { createFileRoute } from "@tanstack/react-router";
import { HyperStrike } from "@/components/hyper-strike";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HyperStrike />;
}
