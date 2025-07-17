import { useMutation } from "@tanstack/react-query";
import { createField } from "../api/field-api";
import { CreateFieldRequest, FieldData } from "../types";

export const useCreateField = () => {
  return useMutation<FieldData, Error, CreateFieldRequest>({
    mutationFn: createField,
  });
};
