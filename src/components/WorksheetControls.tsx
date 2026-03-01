import { WorksheetConfig, Difficulty, GridData } from "@/lib/worksheet-generator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Download, Edit3 } from "lucide-react";

interface WorksheetControlsProps {
  config: WorksheetConfig;
  onConfigChange: (config: WorksheetConfig) => void;
  onGenerate: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  showAnswerKey: boolean;
  onToggleAnswerKey: (val: boolean) => void;
  useCustomNumbers: boolean;
  onToggleCustomNumbers: (val: boolean) => void;
  grids: GridData[];
  onGridCellChange: (gridIdx: number, rowIdx: number, colIdx: number, value: number) => void;
}

const WorksheetControls = ({
  config,
  onConfigChange,
  onGenerate,
  onDownloadPdf,
  isGeneratingPdf,
  showAnswerKey,
  onToggleAnswerKey,
  useCustomNumbers,
  onToggleCustomNumbers,
  grids,
  onGridCellChange,
}: WorksheetControlsProps) => {
  const update = (partial: Partial<WorksheetConfig>) =>
    onConfigChange({ ...config, ...partial });

  return (
    <div className="no-print bg-controls-bg border border-controls-border rounded-lg p-6 mb-8 max-w-[210mm] mx-auto">
      <h2 className="text-lg font-semibold font-mono mb-4 text-foreground">
        Worksheet Settings
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        {/* Title */}
        <div className="col-span-2 md:col-span-3 lg:col-span-5">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Grid Count */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Grids
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={config.gridCount}
            onChange={(e) => update({ gridCount: Math.max(1, Math.min(10, +e.target.value)) })}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Rows */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Rows
          </label>
          <input
            type="number"
            min={2}
            max={6}
            value={config.rows}
            onChange={(e) => update({ rows: Math.max(2, Math.min(6, +e.target.value)) })}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Columns */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Columns
          </label>
          <input
            type="number"
            min={4}
            max={12}
            value={config.columns}
            onChange={(e) => update({ columns: Math.max(4, Math.min(12, +e.target.value)) })}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Difficulty
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => update({ difficulty: e.target.value as Difficulty })}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="easy">Easy (1–9)</option>
            <option value="medium">Medium (±9)</option>
            <option value="hard">Hard (mixed)</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 mb-5">
        <div className="flex items-center gap-2">
          <Switch
            checked={showAnswerKey}
            onCheckedChange={onToggleAnswerKey}
            id="answer-key"
          />
          <label htmlFor="answer-key" className="text-sm font-medium text-foreground cursor-pointer">
            Include Answer Key
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={useCustomNumbers}
            onCheckedChange={onToggleCustomNumbers}
            id="custom-numbers"
          />
          <label htmlFor="custom-numbers" className="text-sm font-medium text-foreground cursor-pointer">
            Custom Numbers
          </label>
        </div>
      </div>

      {/* Custom Numbers Editor */}
      {useCustomNumbers && (
        <div className="mb-5 border border-controls-border rounded-md p-4 bg-background">
          <h3 className="text-sm font-semibold font-mono text-foreground mb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Grid Numbers
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {grids.map((grid, gIdx) => (
              <div key={gIdx}>
                <p className="text-xs font-mono text-muted-foreground mb-1">Grid {gIdx + 1}</p>
                <table className="border-collapse">
                  <tbody>
                    {grid.numbers.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((num, cIdx) => (
                          <td key={cIdx} className="p-0.5">
                            <input
                              type="number"
                              value={num}
                              onChange={(e) =>
                                onGridCellChange(gIdx, rIdx, cIdx, +e.target.value || 0)
                              }
                              className="w-12 h-8 text-center text-sm font-mono border border-input rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!useCustomNumbers && (
          <Button onClick={onGenerate} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate New Sheet
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {isGeneratingPdf ? "Generating…" : "Download as PDF"}
        </Button>
      </div>
    </div>
  );
};

export default WorksheetControls;
