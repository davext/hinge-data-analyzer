import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, Shield, Sparkles, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

export default function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback(
    async (file) => {
      if (!file || file.type !== "application/json") {
        alert("Please upload a valid JSON file");
        return;
      }

      setIsLoading(true);
      setFileName(file.name);

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        onDataLoaded(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error parsing JSON file. Please check the file format.");
      } finally {
        setIsLoading(false);
      }
    },
    [onDataLoaded]
  );

  const loadSampleData = useCallback(async () => {
    setIsLoading(true);
    setFileName("sample-matches.json");

    try {
      const response = await fetch("/matches.json");
      if (!response.ok) {
        throw new Error("Failed to load sample data");
      }
      const data = await response.json();
      onDataLoaded(data);
    } catch (error) {
      console.error("Error loading sample data:", error);
      alert("Error loading sample data. Please try again.");
      setFileName("");
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setFileName("");
    onDataLoaded(null);
  }, [onDataLoaded]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Upload Your Hinge Data</h2>
          <p className="text-muted-foreground">
            Upload your matches.json file to analyze your Hinge data
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-lg mb-6">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm">
              Your Privacy is Protected
            </h3>
            <p className="text-green-700 dark:text-green-300 text-xs mt-1">
              All data processing happens locally in your browser. We don't
              store, collect, or transmit your personal data to any servers.
              Your information stays completely private and secure on your
              device.
            </p>
          </div>
        </div>

        {fileName ? (
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragging
                  ? "Drop your file here"
                  : "Drag and drop your Matches.json file"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <Button asChild variant="outline" disabled={isLoading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  {isLoading ? "Processing..." : "Choose File"}
                </label>
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-muted-foreground/20"></div>
              <span className="px-3 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-muted-foreground/20"></div>
            </div>

            {/* Sample Data Section */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      <Sparkles className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    Try it with sample data
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                    See what your analytics could look like with anonymized demo
                    data
                  </p>
                  <Button
                    onClick={loadSampleData}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      "Explore Sample Data"
                    )}
                  </Button>
                  <div className="flex items-center justify-center mt-3 text-xs text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>No personal data required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
