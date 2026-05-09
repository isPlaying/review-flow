"use client";

import { Button, Card, Col, Flex, Row, Statistic, Table, Tag, Typography } from "antd";

type ReviewItem = {
  key: string;
  name: string;
  owner: string;
  status: "In Review" | "Pending" | "Approved";
  updatedAt: string;
};

const reviewData: ReviewItem[] = [
  {
    key: "1",
    name: "Master Service Agreement.pdf",
    owner: "Alice Chen",
    status: "In Review",
    updatedAt: "2026-05-08 10:12",
  },
  {
    key: "2",
    name: "NDA_Startup_V2.pdf",
    owner: "David Lin",
    status: "Pending",
    updatedAt: "2026-05-08 09:41",
  },
  {
    key: "3",
    name: "Procurement Policy.pdf",
    owner: "Sophia Zhang",
    status: "Approved",
    updatedAt: "2026-05-07 18:05",
  },
];

export default function DashboardPage() {
  return (
    <Flex vertical gap={20} style={{ width: "100%", maxWidth: 1120, margin: "0 auto" }}>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Typography.Title>
        <Button type="primary">New Review</Button>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Total Documents" value={42} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="In Review" value={9} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Pending Comments" value={17} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Documents">
        <Table<ReviewItem>
          pagination={false}
          dataSource={reviewData}
          columns={[
            {
              title: "Document",
              dataIndex: "name",
            },
            {
              title: "Owner",
              dataIndex: "owner",
            },
            {
              title: "Status",
              dataIndex: "status",
              render: (status: ReviewItem["status"]) => {
                const colorMap = {
                  "In Review": "blue",
                  Pending: "gold",
                  Approved: "green",
                } as const;

                return <Tag color={colorMap[status]}>{status}</Tag>;
              },
            },
            {
              title: "Updated",
              dataIndex: "updatedAt",
            },
          ]}
        />
      </Card>
    </Flex>
  );
}
