import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-[400px] min-h-[700px] bg-card rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-border">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 border border-muted-foreground rounded-sm relative">
              <div className="absolute inset-0.5 bg-primary rounded-[1px]" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
