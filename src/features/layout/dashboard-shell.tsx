"use client";

import {
  DownOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Flex, Layout, Menu, message, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useState } from "react";

import { useAuthControllerLogout } from "@/api/generated/reviewflow";
import type { ApiError } from "@/lib/http";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: (
      <Link href="/" prefetch={false}>
        Dashboard
      </Link>
    ),
  },
  {
    key: "/documents",
    icon: <FileTextOutlined />,
    label: (
      <Link href="/documents" prefetch={false}>
        Documents
      </Link>
    ),
  },
  {
    key: "/comments",
    icon: <MessageOutlined />,
    label: (
      <Link href="/comments" prefetch={false}>
        Comments
      </Link>
    ),
  },
];

export function DashboardShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const logoutMutation = useAuthControllerLogout();
  const [collapsed, setCollapsed] = useState(false);
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "signout",
      label: logoutMutation.isPending ? "Signing out..." : "Sign out",
      danger: true,
      disabled: logoutMutation.isPending,
    },
  ];

  const selectedKey = [...menuItems]
    .sort((a, b) => b.key.length - a.key.length)
    .map((item) => item.key)
    .find((key) => pathname === key || pathname.startsWith(`${key}/`));

  return (
    <Layout style={{ minHeight: "100vh", background: "#f2f6fc" }}>
      {contextHolder}
      <Sider
        theme="light"
        width={248}
        collapsed={collapsed}
        collapsedWidth={80}
        trigger={null}
        style={{
          background: "linear-gradient(180deg, #f9fbff 0%, #f4f7ff 100%)",
          boxShadow: "inset -1px 0 0 rgba(148, 163, 184, 0.15)",
        }}
      >
        <Flex vertical gap={24} style={{ width: "100%", padding: "20px 16px" }}>
          <Flex align="center" justify={collapsed ? "center" : "space-between"} gap={8}>
            {!collapsed ? (
              <>
                <Avatar
                  shape="square"
                  icon={<FileSearchOutlined />}
                  style={{ background: "#1677ff" }}
                />
                <Typography.Text strong style={{ flex: 1 }}>
                  ReviewFlow
                </Typography.Text>
              </>
            ) : null}
            <Button
              type="text"
              size="small"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
          </Flex>
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={menuItems}
            style={{
              borderInlineEnd: "none",
              background: "transparent",
            }}
          />
        </Flex>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "rgba(255, 255, 255, 0.78)",
            backdropFilter: "blur(8px)",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            zIndex: 2,
          }}
        >
          <div />
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: async ({ key }) => {
                if (key === "signout") {
                  try {
                    await logoutMutation.mutateAsync();
                    messageApi.success("Signed out.");
                    router.replace("/login");
                  } catch (error) {
                    const apiError = error as Partial<ApiError>;
                    if (apiError.status === 401) {
                      router.replace("/login");
                      return;
                    }
                    messageApi.error("Sign out failed. Please try again.");
                  }
                }
              },
            }}
            trigger={["click"]}
          >
            <Button type="text" style={{ height: "auto", paddingInline: 8 }}>
              <Flex align="center" gap={10}>
                <Avatar size="small" style={{ background: "#1677ff" }}>
                  RC
                </Avatar>
                <Flex vertical align="flex-start" gap={0}>
                  <Typography.Text strong style={{ lineHeight: 1.2 }}>
                    Robin Chen
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12, lineHeight: 1.1 }}>
                    Reviewer
                  </Typography.Text>
                </Flex>
                <DownOutlined style={{ fontSize: 12, color: "#6b7280" }} />
              </Flex>
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ background: "#f2f6fc", padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
