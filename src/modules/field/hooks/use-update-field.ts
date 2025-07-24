import { useMutation } from "@tanstack/react-query";
import { updateField } from "../api/field-api";
import { Field, UpdateFieldRequest } from "../types";

export const useUpdateField = () => {
  return useMutation<Field, Error, { id: string; data: UpdateFieldRequest }>({
    mutationFn: ({ id, data }) => updateField(id, data),
  });
};
