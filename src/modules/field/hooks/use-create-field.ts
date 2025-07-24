import { useMutation } from "@tanstack/react-query";
import { createField } from "../api/field-api";
import { CreateFieldRequest, Field } from "../types";

export const useCreateField = () => {
  return useMutation<Field, Error, CreateFieldRequest>({
    mutationFn: createField,
  });
};
