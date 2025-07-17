import { useMutation } from "@tanstack/react-query";
import { deleteField } from "../api/field-api";

export const useDeleteField = () => {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteField,
  });
};
