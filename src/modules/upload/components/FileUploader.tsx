import { useState } from "react";
import { validateFile } from "@/modules/upload/utils/fileValidator";
import type { DocumentPage } from "@/modules/document/types/document";
// import { pdfEngine } from "@/modules/document/engines/pdfEngine";
// import { excelEngine } from "@/modules/document/engines/excelEngine";

type Props = {
  onLoad: (pages: DocumentPage[]) => void;
};

export const FileUploader = ({ onLoad: _onLoad }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // TODO: Install pdfjs-dist and xlsx for full functionality
      // For now, show error message
      setError(
        "PDF/Excel processing requires additional dependencies. Use 'Load Sample' instead."
      );

      // let pages: DocumentPage[] = [];
      // if (file.type === "application/pdf") {
      //   pages = await pdfEngine.parse(file);
      // } else {
      //   pages = await excelEngine.parse(file);
      // }
      // onLoad(pages);
    } catch (err) {
      setError("Failed to process document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <input
          type="file"
          accept=".pdf,.xls,.xlsx"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
        />

        {loading && <p className="mt-4 text-blue-600">Processing file…</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> PDF/Excel upload requires additional
            dependencies. Click <strong>"Load Sample"</strong> button above to
            test the flipbook viewer.
          </p>
        </div>
      </div>
    </div>
  );
};
