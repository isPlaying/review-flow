"use client";

import { Card, Flex, Table, Tag, Typography } from "antd";

type DocumentItem = {
  key: string;
  id: string;
  name: string;
  status: "In Review" | "Pending" | "Approved";
};

const items: DocumentItem[] = [
  { id: "DOC-1021", name: "Master Service Agreement.pdf", status: "In Review" },
  { id: "DOC-1022", name: "NDA_Startup_V2.pdf", status: "Pending" },
  { id: "DOC-1023", name: "Procurement Policy.pdf", status: "Approved" },
].map((item) => ({ ...item, key: item.id }) as DocumentItem);

export default function DocumentsPage() {
  return (
    <Flex vertical gap={18} style={{ width: "100%", maxWidth: 1120, margin: "0 auto" }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        Documents
      </Typography.Title>
      <Card>
        <Table<DocumentItem>
          dataSource={items}
          pagination={false}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              width: 140,
            },
            {
              title: "Document",
              dataIndex: "name",
            },
            {
              title: "Status",
              dataIndex: "status",
              width: 140,
              render: (status: DocumentItem["status"]) => <Tag>{status}</Tag>,
            },
          ]}
        />
      </Card>
    </Flex>
  );
}
