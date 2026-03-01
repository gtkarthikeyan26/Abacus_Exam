import { GridData, computeColumnSums } from "@/lib/worksheet-generator";

interface WorksheetGridProps {
  grid: GridData;
  index: number;
  showAnswers?: boolean;
}

const WorksheetGrid = ({ grid, showAnswers = false }: WorksheetGridProps) => {
  const cols = grid.numbers[0]?.length ?? 0;
  const sums = showAnswers ? computeColumnSums(grid) : null;

  return (
    <div className="mb-6">
      <table className="border-collapse border-2 border-grid-border w-full font-mono mx-auto">
        <tbody>
          {grid.numbers.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((num, cIdx) => (
                <td
                  key={cIdx}
                  className="border border-grid-border text-center text-grid-number font-semibold py-1.5 text-base px-2 border-solid"
                >
                  {num}
                </td>
              ))}
            </tr>
          ))}
          {grid.hasAnswerRow && (
            <tr>
              {Array.from({ length: cols }).map((_, cIdx) => (
                <td
                  key={cIdx}
                  className={`border border-grid-border min-w-[2.5rem] text-center font-semibold text-base py-1.5 ${
                    showAnswers
                      ? "bg-accent text-foreground font-bold"
                      : "bg-grid-empty h-8"
                  }`}
                >
                  {sums ? sums[cIdx] : ""}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorksheetGrid;
