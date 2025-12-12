import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { DragDropUpload } from "@/modules/upload/components/DragDropUpload";
import { FlipbookViewer, useFlipbookStore } from "@/modules/flipbook";
import { generateSampleImagePages } from "@/modules/flipbook/utils/sampleData";

function App() {
  const { pages, setPages, reset } = useFlipbookStore();

  useEffect(() => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 to-indigo-700">
      <Toaster position="top-right" richColors />

      {/* Simple Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">FlipBook Studio</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Professional Document Viewer</p>
            </div>
          </div>

          <div className="flex gap-3">
            {pages.length === 0 ? (
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Load Sample
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {pages.length === 0 ? (
          <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Upload Your Document
              </h2>
              <p className="text-white/90 text-lg">
                Transform PDFs and Excel files into beautiful flipbooks
              </p>
            </div>

            <DragDropUpload
              onUpload={setPages}
              accept=".pdf,.xlsx,.xls"
              maxSize={50}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-white/80">Process instantly in browser</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">100% Secure</h3>
                <p className="text-sm text-white/80">Files stay on your device</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white">
                <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Easy to Use</h3>
                <p className="text-sm text-white/80">Drag, drop, and view</p>
              </div>
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
