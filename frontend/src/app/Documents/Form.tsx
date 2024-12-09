import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaEye } from "react-icons/fa";

const DocumentForm: React.FC<{
  documentToEdit: any;
  onSave: any;
  onCancel: any;
}> = ({ documentToEdit, onSave, onCancel }) => {
  const methods = useForm();
  const { control, handleSubmit, setValue, watch } = methods;
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    if (documentToEdit) {
      setValue("title", documentToEdit.title);
      setPdfFile(documentToEdit.contentFile || null);
    } else {
      setValue("title", "");
    }
  }, [documentToEdit, setValue]);

  const handleSave = (data: any) => {
    const { title, contentFile } = data;
    if (title.trim() === "") {
      alert("Title is required");
      return;
    }
    const newDocument = {
      id: documentToEdit?.id,
      title,
      contentFile: contentFile || documentToEdit?.contentFile,
      createdAt: documentToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(newDocument);
  };

  const watchedFile = watch("contentFile");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <FormItem>
          <FormLabel>Title:</FormLabel>
          <FormControl>
            <Controller
              name="title"
              control={control}
              defaultValue={documentToEdit?.title || ""}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter document title"
                  required
                  className="border p-2 rounded"
                />
              )}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Content File:</FormLabel>
          <FormControl>
            <Controller
              name="contentFile"
              control={control}
              render={({ field }) => (
                <>
                  {documentToEdit?.contentFile && !watchedFile && (
                    <div className="flex items-center space-x-2">
                      <p>Current file: {documentToEdit.contentFile}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    {...field}
                    className="border p-2 rounded"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setPdfFile(file); // Update the pdfFile state
                      field.onChange(file);
                    }}
                  />
                </>
              )}
            />
          </FormControl>
        </FormItem>

        <div className="button-group flex justify-between mt-4">
          <Button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {documentToEdit ? "Save Changes" : "Create Document"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DocumentForm;
