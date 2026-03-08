import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="rounded-xl border bg-card p-5 card-shadow hover:card-shadow-hover transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p
              className={`text-xs font-medium ${
                changeType === "positive"
                  ? "text-success"
                  : changeType === "negative"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  children: ReactNode;
  title: string;
  className?: string;
  delay?: number;
}

export function StatCard({ children, title, className = "", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`rounded-xl border bg-card card-shadow ${className}`}
    >
      <div className="border-b px-5 py-3">
        <h3 className="font-display text-sm font-semibold text-card-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}
