import { forwardRef } from "react";
import { GridData } from "@/lib/worksheet-generator";
import WorksheetGrid from "./WorksheetGrid";

interface WorksheetSheetProps {
  title: string;
  grids: GridData[];
  difficulty: string;
  showAnswers?: boolean;
  isAnswerKey?: boolean;
}

const WorksheetSheet = forwardRef<HTMLDivElement, WorksheetSheetProps>(
  ({ title, grids, difficulty, showAnswers = false, isAnswerKey = false }, ref) => {
    const levelLabel =
      difficulty === "easy" ? "Level 1" : difficulty === "medium" ? "Level 2" : "Level 3";

    return (
      <div
        ref={ref}
        className="print-sheet bg-card w-[210mm] min-h-[297mm] mx-auto shadow-lg p-[12mm_15mm] font-sans overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-1">
          <h1 className="text-xl font-bold tracking-wide uppercase font-mono text-foreground">
            {title}
          </h1>
          {isAnswerKey && (
            <p className="text-sm font-bold font-mono text-destructive mt-1">
              — ANSWER KEY —
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Off: AH-149,3rd Street,Anna Nagar, Chennai - 600 040. Contact: 9841235234 
          </p>
        </div>

        {/* Info Fields */}
        {!isAnswerKey && (
          <div className="flex justify-between mt-4 mb-2 text-sm font-mono text-foreground">
            <div className="flex gap-6">
              <span>
                <strong>Name:</strong>{" "}
                <span className="inline-block border-b border-grid-border w-40" />
              </span>
              <span>
                <strong>Date:</strong>{" "}
                <span className="inline-block border-b border-grid-border w-32" />
              </span>
            </div>
            <div className="flex gap-6">
              <span>
                <strong>Start Time:</strong>{" "}
                <span className="inline-block border-b border-grid-border w-24" />
              </span>
              <span>
                <strong>End Time:</strong>{" "}
                <span className="inline-block border-b border-grid-border w-20" />
              </span>
            </div>
          </div>
        )}

        <div className="text-center my-3 text-sm font-semibold font-mono text-foreground">
          {levelLabel} — {isAnswerKey ? "Answer Key" : "Exam Paper"}
        </div>

        {/* Grids */}
        <div className="space-y-2">
          {grids.map((grid, idx) => (
            <WorksheetGrid key={idx} grid={grid} index={idx} showAnswers={showAnswers} />
          ))}
        </div>

        {/* Footer */}
        {!isAnswerKey && (
          <div className="flex justify-between items-end mt-8 text-sm font-mono text-muted-foreground">
            <div className="border border-grid-border rounded-full w-12 h-12" />
            <span className="font-semibold">Instructor&apos;s Signature</span>
          </div>
        )}
      </div>
    );
  }
);

WorksheetSheet.displayName = "WorksheetSheet";

export default WorksheetSheet;
