import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileTextIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Component for viewing PDF documents in a modal window
 * @component
 * @returns {JSX.Element} Rendered PDF viewer component
 */
const PDFViewer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* PDF viewer trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="z-50 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white/100 transition-colors"
        aria-label="Open resume PDF viewer"
        aria-expanded={isOpen}
      >
        <FileTextIcon className="w-6 h-6 text-gray-800" aria-hidden="true" />
      </button>

      {/* Modal overlay with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-label="Resume PDF Viewer"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] fixed bottom-px"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close PDF viewer"
              >
                <XIcon className="w-6 h-6" aria-hidden="true" />
              </button>
              
              {/* PDF document container */}
              <div className="h-full p-8 overflow-auto">
                {isOpen && (
                  <Document
                    file="https://smeckman.github.io/resources/resume.pdf"
                    className="flex flex-col items-center"
                    loading={
                      <div className="flex items-center justify-center h-full" role="status">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" aria-label="Loading PDF"></div>
                      </div>
                    }
                    error={
                      <div className="text-red-500" role="alert">
                        Failed to load PDF. Please try again.
                      </div>
                    }
                  >
                    {/* PDF pages */}
                    <div className="p-4 mb-2 bg-gray-200" role="document">
                      <Page
                        pageNumber={1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                        aria-label="Resume page 1"
                      />
                    </div>
                    <div className="p-4 bg-gray-200">
                      <Page
                        pageNumber={2}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                        aria-label="Resume page 2"
                      />
                    </div>
                  </Document>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Disable server-side rendering for PDF viewer
export default dynamic(() => Promise.resolve(PDFViewer), {
  ssr: false
});
