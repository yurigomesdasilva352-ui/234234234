import { PRIORITY_META, Priority } from "@/lib/mock/data";
export function PriorityChip({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md ring-1 ${m.bg} ${m.color} ${m.ring}`}>
      <span className="size-1.5 rounded-full bg-current animate-blip" />
      {m.label}
    </span>
  );
}
