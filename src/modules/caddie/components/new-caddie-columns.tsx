import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Column } from "@/shared/types/table";
import { NewCaddieApplication } from "../types/new-caddie";
import { NEW_CADDIE_CONSTANTS } from "../constants/new-caddie";

interface NewCaddieColumnsProps {
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

export const createNewCaddieColumns = ({
  onApprove,
  onReject,
}: NewCaddieColumnsProps): Column<NewCaddieApplication>[] => [
  {
    key: "name",
    title: "이름",
    width: 240,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return (
        <Link
          href={`/caddies/${record.id}`}
          className="text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
        >
          {value as string}
        </Link>
      );
    },
  },
  {
    key: "phone",
    title: "연락처",
    flex: true,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "email",
    title: "이메일",
    flex: true,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "requestDate",
    title: "요청일자",
    flex: true,
    align: "center",
    render: (value, record) => {
      if (record.isEmpty) return null;
      return <span className="text-gray-800">{value as string}</span>;
    },
  },
  {
    key: "actions",
    title: "",
    width: 136,
    align: "center",
    render: (_, record) => {
      if (record.isEmpty) return null;
      return (
        <div className="flex items-center gap-1 h-8">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(record.id, record.name);
            }}
            disabled={record.status !== "pending"}
            className="h-6 px-2 text-xs min-w-[36px]"
          >
            {NEW_CADDIE_CONSTANTS.APPROVAL_BUTTON_TEXT}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onReject(record.id, record.name);
            }}
            disabled={record.status !== "pending"}
            className="h-6 px-2 text-xs min-w-[36px]"
          >
            {NEW_CADDIE_CONSTANTS.REJECT_BUTTON_TEXT}
          </Button>
        </div>
      );
    },
  },
];
