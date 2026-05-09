"use client";

import { Card, Flex, Table, Typography } from "antd";

type CommentItem = {
  key: string;
  id: string;
  text: string;
  author: string;
};

const comments: CommentItem[] = [
  { id: "CMT-001", text: "Please confirm clause 4.2 wording.", author: "Alice Chen" },
  { id: "CMT-002", text: "Add legal owner to the signature block.", author: "David Lin" },
  { id: "CMT-003", text: "Looks good after revision.", author: "Sophia Zhang" },
].map((item) => ({ ...item, key: item.id }));

export default function CommentsPage() {
  return (
    <Flex vertical gap={18} style={{ width: "100%", maxWidth: 1120, margin: "0 auto" }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        Comments
      </Typography.Title>
      <Card>
        <Table<CommentItem>
          dataSource={comments}
          pagination={false}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              width: 140,
            },
            {
              title: "Comment",
              dataIndex: "text",
            },
            {
              title: "Author",
              dataIndex: "author",
              width: 180,
            },
          ]}
        />
      </Card>
    </Flex>
  );
}
