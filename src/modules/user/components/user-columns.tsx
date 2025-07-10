import React from "react";
import { Column } from "@/shared/types/table";
import { User } from "../types";
import { USER_CONSTANTS, USER_ROLE_LABELS } from "../constants";

export const userColumns: Column<User>[] = [
  {
    key: "no",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.NO,
    width: 80,
    align: "center",
    render: (_value, _record, index) => <div>{index + 1}</div>,
  },
  {
    key: "username",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.USERNAME,
    width: 160,
    align: "center",
    render: (value) => <div>{value as string}</div>,
  },
  {
    key: "name",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.NAME,
    width: 160,
    align: "center",
    render: (value) => <div>{value as string}</div>,
  },
  {
    key: "phone",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.PHONE,
    width: 160,
    align: "center",
    render: (value) => <div>{value as string}</div>,
  },
  {
    key: "email",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.EMAIL,
    width: 320,
    align: "center",
    render: (value) => <div>{value as string}</div>,
  },
  {
    key: "role",
    title: USER_CONSTANTS.UI_TEXT.COLUMNS.ROLE,
    width: 160,
    align: "center",
    render: (value) => {
      const role = value as keyof typeof USER_ROLE_LABELS;
      return <div>{USER_ROLE_LABELS[role] || value}</div>;
    },
  },
];
