import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface FieldValue {
  id: string;
  value: string;
  label: string;
}

interface CsvUploadProps {
  onDataImported: (values: FieldValue[]) => void;
  fieldType: string;
  currentValues?: FieldValue[];
}

interface CsvRow {
  value: string;
  label: string;
}

export function CsvUpload({
  onDataImported,
  fieldType,
  currentValues = [],
}: CsvUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [mergeWithExisting, setMergeWithExisting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const generateTemplate = () => {
    const templateData = [
      ["value", "label"],
      ["high", "High Priority"],
      ["medium", "Medium Priority"],
      ["low", "Low Priority"],
      ["urgent", "Urgent"],
      ["normal", "Normal"],
    ];

    const csvContent = templateData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${fieldType.toLowerCase()}_options_template.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCsvContent = (content: string): CsvRow[] => {
    const lines = content.trim().split(/\r?\n/);
    const result: CsvRow[] = [];

    // Skip header row (first line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Enhanced CSV parsing - handles quoted fields and escaped quotes
      const fields = [];
      let current = "";
      let inQuotes = false;
      let j = 0;

      while (j < line.length) {
        const char = line[j];
        const nextChar = line[j + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote within quoted field
            current += '"';
            j += 2;
            continue;
          } else {
            // Start or end of quoted field
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          fields.push(current.trim());
          current = "";
          j++;
          continue;
        } else {
          current += char;
        }
        j++;
      }
      fields.push(current.trim());

      // Clean up quotes from fields
      const cleanFields = fields.map((field) =>
        field.replace(/^["']|["']$/g, "").trim(),
      );

      if (cleanFields.length >= 2 && cleanFields[0] && cleanFields[1]) {
        result.push({
          value: cleanFields[0],
          label: cleanFields[1],
        });
      }
    }

    return result;
  };

  const validateCsvData = (data: CsvRow[]): string | null => {
    if (data.length === 0) {
      return "CSV file appears to be empty or contains no valid data rows.";
    }

    const duplicateValues = new Set();
    const duplicates = [];

    for (const row of data) {
      if (!row.value || !row.label) {
        return "All rows must have both value and label fields filled.";
      }

      if (duplicateValues.has(row.value)) {
        duplicates.push(row.value);
      } else {
        duplicateValues.add(row.value);
      }
    }

    if (duplicates.length > 0) {
      return `Duplicate values found: ${duplicates.join(", ")}. Values must be unique.`;
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccess("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a valid CSV file.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      const content = await file.text();
      const csvData = parseCsvContent(content);

      const validationError = validateCsvData(csvData);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Convert to FieldValue format
      const newFieldValues: FieldValue[] = csvData.map((row, index) => ({
        id: `csv-${Date.now()}-${index}`,
        value: row.value,
        label: row.label,
      }));

      let finalValues: FieldValue[];

      if (mergeWithExisting && currentValues.length > 0) {
        // Merge with existing values, avoiding duplicates
        const existingValues = new Set(currentValues.map((v) => v.value));
        const uniqueNewValues = newFieldValues.filter(
          (v) => !existingValues.has(v.value),
        );
        finalValues = [...currentValues, ...uniqueNewValues];

        const skippedCount = newFieldValues.length - uniqueNewValues.length;
        setSuccess(
          `Successfully imported ${uniqueNewValues.length} new options from CSV file.${
            skippedCount > 0
              ? ` ${skippedCount} duplicate(s) were skipped.`
              : ""
          }`,
        );
      } else {
        // Replace existing values
        finalValues = newFieldValues;
        setSuccess(
          `Successfully imported ${newFieldValues.length} options from CSV file.${
            currentValues.length > 0 ? " Previous options were replaced." : ""
          }`,
        );
      }

      onDataImported(finalValues);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        "Failed to parse CSV file. Please check the file format and try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import from CSV
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file to automatically populate field options
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Need a template?</p>
              <p className="text-xs text-muted-foreground">
                Download a sample CSV file with the correct format
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label htmlFor="csv-file" className="text-sm font-medium">
            Select CSV File
          </Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              onClick={clearMessages}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="px-4"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </>
              )}
            </Button>
          </div>

          {/* Merge Option */}
          {currentValues.length > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                id="merge-options"
                checked={mergeWithExisting}
                onChange={(e) => setMergeWithExisting(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label
                htmlFor="merge-options"
                className="text-sm text-muted-foreground"
              >
                Merge with existing options (otherwise replace all)
              </Label>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Format Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">CSV Format Requirements:</p>
          <ul className="space-y-1">
            <li>• First row should contain headers: "value", "label"</li>
            <li>
              • Each option should have a unique value and descriptive label
            </li>
            <li>
              • Values will be used internally, labels will be shown to users
            </li>
            <li>• Example: "high","High Priority"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
