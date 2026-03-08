import { AppLayout } from "@/components/AppLayout";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export function ModulePage({ title, description, icon: Icon, features }: ModulePageProps) {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card card-shadow p-8"
        >
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-semibold text-card-foreground">Módulo em desenvolvimento</h2>
            <p className="text-sm text-muted-foreground">
              Este módulo será implementado com as seguintes funcionalidades:
            </p>
            <ul className="text-left space-y-2 mt-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
