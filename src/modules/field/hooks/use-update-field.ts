import { useMutation } from "@tanstack/react-query";
import { updateField } from "../api/field-api";
import { FieldData, UpdateFieldRequest } from "../types";

export const useUpdateField = () => {
  return useMutation<
    FieldData,
    Error,
    { id: string; data: UpdateFieldRequest }
  >({
    mutationFn: ({ id, data }) => updateField(id, data),
  });
};
