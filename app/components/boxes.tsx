export function ColBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
      {children}
    </div>
  );
}

export function RowBox({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
      <div className={`flex flex-row items-center justify-center gap-1 md:gap-2 ${className}`}>
        {children}
        </div>
    );
    }