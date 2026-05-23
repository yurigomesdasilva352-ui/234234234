import logoUrl from "@/assets/dl-logo.png";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoUrl}
        alt="DL Remoções"
        className={showText ? "h-9 w-auto object-contain" : "h-9 w-9 object-contain"}
      />
      {showText && (
        <div className="leading-tight sr-only">
          <div className="font-display font-bold tracking-tight text-[15px]">DL Remoções</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">EMS Operations</div>
        </div>
      )}
    </div>
  );
}
