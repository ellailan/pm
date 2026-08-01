import { Portfolio, PORTFOLIO_COLORS } from "@/types";

interface PortfolioBadgeProps {
  portfolio: Portfolio;
  className?: string;
}

export function PortfolioBadge({ portfolio, className }: PortfolioBadgeProps) {
  const color = PORTFOLIO_COLORS[portfolio];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 font-bold text-[10px] uppercase rounded shadow ${className || ""}`}
      style={{ backgroundColor: color, color: 'white' }}
    >
      {portfolio}
    </span>
  );
}
