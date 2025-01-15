"use client";

import { Suspense } from "react";
import CreditSimulator from "./components/creditSimulator";

export default function SimulacaoCreditoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CreditSimulator />
    </Suspense>
  );
}
