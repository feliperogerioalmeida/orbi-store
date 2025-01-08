import { Users, Settings, FileText, BarChart2 } from "lucide-react";

export const masterLinks = [
  { href: "/master/dashboard", label: "Dashboard Master", icon: BarChart2 },
  { href: "/master/users", label: "Gerenciar Usuários", icon: Users },
  { href: "/master/activity-log", label: "Log de Atividades", icon: FileText },
  {
    href: "/master/upgrades",
    label: "Relatórios de Upgrades",
    icon: BarChart2,
  },
  { href: "/master/app-reviews", label: "Avaliações do App", icon: FileText },
];

export const admLinks = [
  { href: "/adm/dashboard", label: "Dashboard Adm", icon: BarChart2 },
  { href: "/adm/orders", label: "Gestão de Pedidos", icon: FileText },
  { href: "/adm/stock", label: "Gestão de Estoque", icon: Settings },
  { href: "/adm/reports", label: "Relatórios", icon: BarChart2 },
  { href: "/adm/settings", label: "Configurações da Loja", icon: Settings },
  { href: "/adm/upgrades", label: "Upgrades", icon: FileText },
];
