import { useMutation } from "@tanstack/react-query";
import { deleteField, deleteFieldsBulk } from "../api/field-api";

export const useDeleteField = () => {
  return useMutation<boolean, Error, string>({
    mutationFn: deleteField,
  });
};

export const useDeleteFieldsBulk = () => {
  return useMutation<boolean, Error, string[]>({
    mutationFn: deleteFieldsBulk,
  });
};
