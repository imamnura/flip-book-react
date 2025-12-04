import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { FileUploader } from "@/modules/upload/components/FileUploader";
import { DragDropUpload } from "@/modules/upload/components/DragDropUpload";
import { FlipbookViewer, useFlipbookStore } from "@/modules/flipbook";
import { generateSampleImagePages } from "@/modules/flipbook/utils/sampleData";
import { Button } from "@/shared/ui";

function App() {
  const { pages, setPages, reset } = useFlipbookStore();

  useEffect(() => {
    // Reset on unmount
    return () => {
      setPages([]);
    };
  }, [setPages]);

  const handleLoadSample = () => {
    const samplePages = generateSampleImagePages(12);
    setPages(samplePages);
    toast.success("Sample document loaded!", {
      description: "12 pages ready to view",
    });
  };

  const handleReset = () => {
    reset();
    toast.info("Document cleared");
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Toast Container */}
      <Toaster position="top-right" richColors expand={true} />

      {/* Header with Glassmorphism */}
      <header className="relative backdrop-blur-xl bg-white/80 border-b border-white/20 px-8 py-5 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FlipBook Studio
            </h1>
            <p className="text-xs text-gray-600">
              Professional Document Viewer
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {pages.length === 0 ? (
            <Button
              onClick={handleLoadSample}
              variant="primary"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Load Sample
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-all"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Document
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {pages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-3xl w-full space-y-8">
              {/* Welcome Section */}
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  Upload Your Document
                </h2>
                <p className="text-lg text-white/90 drop-shadow">
                  Transform PDFs and Excel files into beautiful interactive
                  flipbooks
                </p>
              </div>

              {/* Drag & Drop Upload */}
              <DragDropUpload
                onUpload={setPages}
                accept=".pdf,.xlsx,.xls,.doc,.docx"
                maxSize={50}
              />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-white/80">
                    Process documents instantly in your browser
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">100% Secure</h3>
                  <p className="text-sm text-white/80">
                    Files stay on your device, never uploaded
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Easy to Use</h3>
                  <p className="text-sm text-white/80">
                    Drag, drop, and view in seconds
                  </p>
                </div>
              </div>

              {/* Legacy File Uploader (hidden but available) */}
              <details className="text-sm text-white/70 hover:text-white/90 transition-colors">
                <summary className="cursor-pointer text-center">
                  Show advanced uploader
                </summary>
                <div className="mt-4 p-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl">
                  <FileUploader onLoad={setPages} />
                </div>
              </details>
            </div>
          </div>
        ) : (
          <FlipbookViewer
            showControls={true}
            showThumbnails={true}
            enableKeyboard={true}
            enableZoom={true}
            enableFullscreen={true}
            enableAutoFlip={true}
          />
        )}
      </main>
    </div>
  );
}

export default App;
