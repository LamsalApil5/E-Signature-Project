"use client";

import React, { useState, useEffect } from "react";
import DocumentForm from "./Form"; // Import DocumentForm component
import { api } from "@/Services/apiService"; // API service
import { DOCUMENTS_LIST } from "@/endpoints"; // Endpoints

export interface Document {
  id?: string; // Optional for new documents
  title: string;
  contentFile: File | null; // This holds the file uploaded by the user
  createdAt: string; // ISO string format for created date
  updatedAt: string; // ISO string format for updated date
}

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await api.list<Document[]>(
          `${DOCUMENTS_LIST}?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (response.data && Array.isArray(response.data)) {
          setDocuments(response.data.flat());
        } else {
          alert("No data returned from the server.");
        }
      } catch (error: any) {
        alert("Error fetching documents: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalDocuments = async () => {
      try {
        const response = await api.list<Document[]>(DOCUMENTS_LIST);
        setTotalDocuments(response.data.length);
      } catch (error: any) {
        alert("Error fetching total document count: " + error.message);
      }
    };

    fetchDocuments();
    fetchTotalDocuments();
  }, [currentPage, itemsPerPage]);

  const handleSaveDocument = (document: Document) => {
    if (document.id) {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === document.id ? { ...doc, ...document } : doc
        )
      );
    } else {
      setDocuments((prevDocuments) => [
        ...prevDocuments,
        { ...document, id: Math.random().toString(36).substring(7) },
      ]);
    }
    setShowModal(false);
  };

  const handleDeleteDocument = async () => {
    if (documentToDelete) {
      try {
        await api.delete(`${DOCUMENTS_LIST}/${documentToDelete.id}`);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== documentToDelete.id)
        );
        setShowDeleteModal(false);
      } catch (error: any) {
        alert("Error deleting document: " + error.message);
      }
    }
  };

  const handleAddNewDocument = () => {
    setDocumentToEdit(null); // Reset documentToEdit to null for a new document
    setShowModal(true); // Show modal to add a new document
  };

  const handleEditDocument = (document: Document) => {
    setDocumentToEdit(document); // Set the document to be edited
    setShowModal(true); // Show modal to edit the document
  };

  const handleOpenDeleteModal = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="p-6 px-64 max-w-full">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <button
          onClick={handleAddNewDocument}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Document
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="border p-2">{document.title}</td>
                <td className="border p-2">{document.createdAt}</td>
                <td className="border p-2 flex space-x-2">
                  <button
                    onClick={() => handleEditDocument(document)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(document)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
          {Math.min(itemsPerPage * currentPage, totalDocuments)} of{" "}
          {totalDocuments} documents
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage(
                Math.min(
                  currentPage + 1,
                  Math.ceil(totalDocuments / itemsPerPage)
                )
              )
            }
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Document Form Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-xl w-full">
            <DocumentForm
              documentToEdit={documentToEdit} // Pass the document to edit, or null for new
              onSave={handleSaveDocument} // Callback to handle save
              onCancel={() => setShowModal(false)} // Callback to close modal without saving
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div>
          <h3>Are you sure you want to delete this document?</h3>
          <button onClick={handleDeleteDocument}>Yes</button>
          <button onClick={closeDeleteModal}>No</button>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
