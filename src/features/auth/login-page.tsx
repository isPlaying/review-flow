"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Flex, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import { useAuthControllerLogin } from "@/api/generated/reviewflow";
import { type ApiError, setUnauthorizedHandler } from "@/lib/http";

import styles from "./login-page.module.css";

type LoginFormValues = {
  username: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const loginMutation = useAuthControllerLogin();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      remember: true,
    },
  });

  useEffect(() => {
    setUnauthorizedHandler(() => {
      router.replace("/login");
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      await loginMutation.mutateAsync({
        data: {
          username: values.username,
          password: values.password,
        },
      });

      messageApi.success(`Welcome back, ${values.username}`);
      router.push("/");
    } catch (error) {
      const apiError = error as Partial<ApiError>;
      const errorMessage =
        typeof apiError.message === "string"
          ? apiError.message
          : "Sign in failed. Please check username or password.";
      messageApi.error(errorMessage);
    }
  };

  return (
    <main className={styles.page}>
      {contextHolder}
      <div className={styles.glowA} />
      <div className={styles.glowB} />
      <Card className={styles.card}>
        <Flex vertical gap={20} style={{ width: "100%" }}>
          <Flex vertical gap={6}>
            <Typography.Text className={styles.badge}>REVIEWFLOW</Typography.Text>
            <Typography.Title level={2} style={{ margin: 0 }} className={styles.title}>
              Sign in
            </Typography.Title>
            <Typography.Text type="secondary" className={styles.subtitle}>
              Continue to ReviewFlow workspace
            </Typography.Text>
          </Flex>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Flex vertical gap={14} style={{ width: "100%" }}>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <Flex vertical gap={6}>
                    <Input
                      {...field}
                      size="large"
                      placeholder="Username"
                      autoComplete="username"
                      prefix={<UserOutlined />}
                      status={errors.username ? "error" : ""}
                    />
                    {errors.username ? (
                      <Alert showIcon type="error" message={errors.username.message} />
                    ) : null}
                  </Flex>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <Flex vertical gap={6}>
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="Password"
                      autoComplete="current-password"
                      prefix={<LockOutlined />}
                      status={errors.password ? "error" : ""}
                    />
                    {errors.password ? (
                      <Alert showIcon type="error" message={errors.password.message} />
                    ) : null}
                  </Flex>
                )}
              />

              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                )}
              />

              <Button
                size="large"
                htmlType="submit"
                type="primary"
                loading={isSubmitting || loginMutation.isPending}
                block
                className={styles.submitBtn}
              >
                Sign in
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </main>
  );
}
