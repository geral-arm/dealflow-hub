import { motion } from "framer-motion";

interface PipelineStage {
  name: string;
  count: number;
  value: string;
  color: string;
}

const stages: PipelineStage[] = [
  { name: "Oportunidade", count: 24, value: "€1.2M", color: "bg-info" },
  { name: "Proposta", count: 18, value: "€890K", color: "bg-warning" },
  { name: "Negociação", count: 12, value: "€650K", color: "bg-accent" },
  { name: "Aprovação", count: 8, value: "€420K", color: "bg-secondary" },
  { name: "Fechado", count: 15, value: "€780K", color: "bg-success" },
];

export function DealPipeline() {
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <motion.div
          key={stage.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">{stage.name}</span>
          <div className="flex-1">
            <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                className={`h-full ${stage.color} rounded-md flex items-center px-3`}
              >
                <span className="text-xs font-bold text-card">{stage.count}</span>
              </motion.div>
            </div>
          </div>
          <span className="w-16 shrink-0 text-right text-xs font-semibold text-card-foreground">{stage.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
