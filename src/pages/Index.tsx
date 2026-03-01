import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import WorksheetControls from "@/components/WorksheetControls";
import WorksheetSheet from "@/components/WorksheetSheet";
import {
  generateWorksheet,
  defaultConfig,
  WorksheetConfig,
  GridData,
  createEmptyGrids,
} from "@/lib/worksheet-generator";

const Index = () => {
  const [config, setConfig] = useState<WorksheetConfig>(defaultConfig);
  const [grids, setGrids] = useState<GridData[]>(() => generateWorksheet(defaultConfig));
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [useCustomNumbers, setUseCustomNumbers] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    setGrids(generateWorksheet(config));
  }, [config]);

  const handleToggleCustomNumbers = useCallback(
    (val: boolean) => {
      setUseCustomNumbers(val);
      if (val) {
        // Initialize with current grids so user can edit them
      } else {
        setGrids(generateWorksheet(config));
      }
    },
    [config]
  );

  const handleGridCellChange = useCallback(
    (gridIdx: number, rowIdx: number, colIdx: number, value: number) => {
      setGrids((prev) => {
        const updated = prev.map((g, gi) =>
          gi === gridIdx
            ? {
                ...g,
                numbers: g.numbers.map((r, ri) =>
                  ri === rowIdx
                    ? r.map((c, ci) => (ci === colIdx ? value : c))
                    : r
                ),
              }
            : g
        );
        return updated;
      });
    },
    []
  );

  // Sync grids when config changes dimensions (only in custom mode)
  const handleConfigChange = useCallback(
    (newConfig: WorksheetConfig) => {
      setConfig(newConfig);
      if (useCustomNumbers) {
        const needsResize =
          newConfig.gridCount !== config.gridCount ||
          newConfig.rows !== config.rows ||
          newConfig.columns !== config.columns;
        if (needsResize) {
          setGrids(createEmptyGrids(newConfig));
        }
      }
    },
    [useCustomNumbers, config]
  );

  const handleDownloadPdf = useCallback(async () => {
    if (!sheetRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Page 1: Worksheet
      const canvas1 = await html2canvas(sheetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      pdf.addImage(canvas1.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, pdfHeight);

      // Page 2: Answer Key (if enabled)
      if (showAnswerKey && answerRef.current) {
        pdf.addPage();
        const canvas2 = await html2canvas(answerRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        pdf.addImage(canvas2.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${config.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [config.title, showAnswerKey]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <WorksheetControls
        config={config}
        onConfigChange={handleConfigChange}
        onGenerate={handleGenerate}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        showAnswerKey={showAnswerKey}
        onToggleAnswerKey={setShowAnswerKey}
        useCustomNumbers={useCustomNumbers}
        onToggleCustomNumbers={handleToggleCustomNumbers}
        grids={grids}
        onGridCellChange={handleGridCellChange}
      />
      <WorksheetSheet
        ref={sheetRef}
        title={config.title}
        grids={grids}
        difficulty={config.difficulty}
      />
      {showAnswerKey && (
        <div className="mt-8">
          <WorksheetSheet
            ref={answerRef}
            title={config.title}
            grids={grids}
            difficulty={config.difficulty}
            showAnswers
            isAnswerKey
          />
        </div>
      )}
    </div>
  );
};

export default Index;
