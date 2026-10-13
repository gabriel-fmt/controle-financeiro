import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que celulares na mesma rede carreguem os scripts do servidor local.
  // Mantenha a lista restrita ao IP desta máquina em vez de liberar toda a rede.
  allowedDevOrigins: ["192.168.15.3"],
};

export default nextConfig;
