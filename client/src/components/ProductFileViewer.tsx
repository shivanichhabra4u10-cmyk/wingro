import React, { useState } from 'react';
import { ProductFileType } from '../services/productFileService';

interface ProductFileProps {
  url: string;
  type: ProductFileType | string;
  name: string;
  thumbnailUrl?: string;
}

const ProductFileViewer: React.FC<ProductFileProps> = ({
  url,
  type,
  name,
  thumbnailUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const fileType = typeof type === 'string' ? type as ProductFileType : type;
  
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  const renderFilePreview = () => {
    switch (fileType) {
      case ProductFileType.PDF:
        return (
          <div 
            className="cursor-pointer flex flex-col items-center text-center"
            onClick={handleOpen}
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2 shadow-sm hover:shadow-md transition-shadow">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              )}
            </div>
            <span className="text-sm font-medium truncate max-w-full">{name}</span>
            <span className="text-xs text-gray-500">PDF Document • Click to open</span>
          </div>
        );
        
      case ProductFileType.VIDEO:
        return (
          <div className="flex flex-col items-center text-center">
            <div className="w-full aspect-video bg-gray-100 rounded-lg relative shadow-sm">
              {thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={thumbnailUrl} 
                    alt={name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer"
                    onClick={handleOpen}
                  >
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <svg className="w-8 h-8 text-indigo-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={handleOpen}
                >
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto mt-3">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm font-medium truncate max-w-full mt-2">{name}</span>
            <span className="text-xs text-gray-500">Video • Click to play</span>
          </div>
        );
        
      case ProductFileType.PRESENTATION:
        return (
          <div 
            className="cursor-pointer flex flex-col items-center text-center"
            onClick={handleOpen}
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              )}
            </div>
            <span className="text-sm font-medium truncate max-w-full">{name}</span>
            <span className="text-xs text-gray-500">Presentation • Click to view</span>
          </div>
        );
        
      case ProductFileType.EXCEL:
      case ProductFileType.OTHER:
      default:
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center"
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-2 shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium truncate max-w-full">{name}</span>
            <span className="text-xs text-gray-500">Download File</span>
          </a>
        );
    }
  };
  
  const renderFullScreenViewer = () => {
    switch (fileType) {
      case ProductFileType.PDF:
        return (
          <div className="w-full h-full">
            <iframe 
              src={`${url}#toolbar=0&navpanes=0`} 
              title={name} 
              className="w-full h-full"
            />
          </div>
        );
        
      case ProductFileType.VIDEO:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <video 
              controls 
              autoPlay 
              className="max-w-full max-h-full shadow-lg"
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
        
      case ProductFileType.PRESENTATION:
        if (url.includes('.pdf') || url.includes('pdf')) {
          return (
            <div className="w-full h-full">
              <iframe 
                src={`${url}#toolbar=0&navpanes=0`} 
                title={name} 
                className="w-full h-full"
              />
            </div>
          );
        } else {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img
                src={thumbnailUrl || url}
                alt={name}
                className="max-w-md max-h-[70vh] mb-4 shadow-lg rounded"
              />
              <p className="text-center text-white">
                <a
                  href={url}
                  download
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Download Presentation
                </a>
              </p>
              <p className="text-center text-white text-sm mt-2">
                This presentation requires a PowerPoint or similar application to view.
              </p>
            </div>
          );
        }
        
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <div className="text-center mb-6">
                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">{name}</h3>
              <p className="text-gray-600 text-center mb-6">
                This file type cannot be previewed directly in the browser.
              </p>
              <div className="flex justify-center">
                <a
                  href={url}
                  download
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <>
      {renderFilePreview()}
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={handleClose}
              className="bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="w-full h-full max-w-5xl max-h-[90vh]">
            {renderFullScreenViewer()}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFileViewer;
