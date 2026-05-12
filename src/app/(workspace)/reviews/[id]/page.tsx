"use client";

import { Button, Card, Col, Empty, Flex, Row, Spin, Tag, Typography } from "antd";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const PdfDocument = dynamic(() => import("react-pdf").then((module) => module.Document), {
  ssr: false,
});
const PdfPage = dynamic(() => import("react-pdf").then((module) => module.Page), {
  ssr: false,
});

const PANEL_HEIGHT = "clamp(520px, calc(100vh - 240px), 820px)";
const PREVIEW_MIN_HEIGHT = 680;
const PREVIEW_CARD_BODY_STYLE = { padding: 12, height: PANEL_HEIGHT, overflow: "auto" } as const;
const COMMENTS_CARD_BODY_STYLE = { height: PANEL_HEIGHT, padding: 16 } as const;
const COMMENT_LIST_CONTAINER_STYLE = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  paddingRight: 4,
} as const;
const PAGE_CARD_BODY_STYLE = { padding: 8 } as const;
const PAGE_WRAPPER_STYLE = {
  position: "relative",
  width: "fit-content",
  lineHeight: 0,
  display: "inline-block",
} as const;

type CommentAnchor = {
  page: number;
  text: string;
};

type ReviewComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  anchor?: CommentAnchor;
};

type ReviewDocument = {
  id: string;
  name: string;
  status: "In Review" | "Pending" | "Approved";
  pdfUrl: string;
  comments: ReviewComment[];
};

const reviewDocs: Record<string, ReviewDocument> = {
  "DOC-1021": {
    id: "DOC-1021",
    name: "Master Service Agreement.pdf",
    status: "In Review",
    pdfUrl: "https://arxiv.org/pdf/1708.08021",
    comments: [],
  },
  "DOC-1022": {
    id: "DOC-1022",
    name: "NDA_Startup_V2.pdf",
    status: "Pending",
    pdfUrl: "https://arxiv.org/pdf/1604.02480",
    comments: [],
  },
  "DOC-1023": {
    id: "DOC-1023",
    name: "Procurement Policy.pdf",
    status: "Approved",
    pdfUrl: "https://arxiv.org/pdf/1604.02480",
    comments: [],
  },
};

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const docId = params?.id ?? "";
  const initialDoc = reviewDocs[docId];
  const [numPages, setNumPages] = useState(0);
  const [comments, setComments] = useState<ReviewComment[]>(initialDoc?.comments ?? []);
  const [isPdfBootstrapping, setIsPdfBootstrapping] = useState(true);
  const [firstPageRendered, setFirstPageRendered] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfBaseWidth, setPdfBaseWidth] = useState(0);

  useEffect(() => {
    setComments(initialDoc?.comments ?? []);
  }, [initialDoc]);

  useEffect(() => {
    let active = true;

    const setupWorker = async () => {
      if (typeof window === "undefined") return;

      const { pdfjs } = await import("react-pdf");
      if (!active) return;

      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    };

    void setupWorker();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const node = previewContainerRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setPdfBaseWidth((currentWidth) => currentWidth || Math.floor(entry.contentRect.width));
    });

    observer.observe(node);
    setPdfBaseWidth(
      (currentWidth) => currentWidth || Math.floor(node.getBoundingClientRect().width),
    );
    return () => observer.disconnect();
  }, []);

  const reviewStatusColor = useMemo(() => {
    if (!initialDoc) return "default";
    return {
      "In Review": "blue",
      Pending: "gold",
      Approved: "green",
    }[initialDoc.status];
  }, [initialDoc]);

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  }, []);
  const pageWidth = pdfBaseWidth > 0 ? Math.max(320, Math.floor(pdfBaseWidth - 16)) : undefined;
  const showPdfLoadingMask = isPdfBootstrapping || !firstPageRendered;
  const pageNumbers = useMemo(
    () => Array.from({ length: numPages }, (_, index) => index + 1),
    [numPages],
  );
  const handleDocumentLoadSuccess = useCallback((event: { numPages: number }) => {
    setNumPages(event.numPages);
    setIsPdfBootstrapping(false);
    setFirstPageRendered(false);
  }, []);

  if (!initialDoc) {
    return (
      <Flex vertical gap={16} style={{ width: "100%", maxWidth: 1120, margin: "0 auto" }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Review
        </Typography.Title>
        <Card>
          <Empty description="Document not found" />
        </Card>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={16} style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
      <Flex align="center" justify="space-between" wrap>
        <Flex vertical gap={4}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {initialDoc.name}
          </Typography.Title>
          <Flex align="center" gap={8}>
            <Typography.Text type="secondary">{initialDoc.id}</Typography.Text>
            <Tag color={reviewStatusColor}>{initialDoc.status}</Tag>
          </Flex>
        </Flex>
      </Flex>

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} xl={16}>
          <Card title="PDF Preview" styles={{ body: PREVIEW_CARD_BODY_STYLE }}>
            <div
              ref={previewContainerRef}
              style={{ position: "relative", minHeight: PREVIEW_MIN_HEIGHT }}
            >
              {showPdfLoadingMask ? (
                <Flex
                  vertical
                  align="center"
                  justify="center"
                  gap={12}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    background: "rgba(255, 255, 255, 0.88)",
                  }}
                >
                  <Spin size="large" />
                  <Typography.Text type="secondary">Loading PDF preview...</Typography.Text>
                </Flex>
              ) : null}
              <Flex vertical align="center" gap={12}>
                <PdfDocument
                  file={initialDoc.pdfUrl}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  loading={<Typography.Text type="secondary">Loading PDF...</Typography.Text>}
                  error={<Typography.Text type="danger">Failed to load PDF.</Typography.Text>}
                >
                  {pageNumbers.map((pageNumber) => (
                    <Card
                      key={`page-${pageNumber}`}
                      size="small"
                      style={{ width: "fit-content", maxWidth: "100%" }}
                      styles={{ body: PAGE_CARD_BODY_STYLE }}
                    >
                      <div
                        data-page-wrapper
                        data-page-number={pageNumber}
                        style={PAGE_WRAPPER_STYLE}
                      >
                        <PdfPage
                          pageNumber={pageNumber}
                          width={pageWidth}
                          renderAnnotationLayer={false}
                          renderTextLayer
                          onRenderSuccess={() => {
                            if (pageNumber === 1) {
                              setFirstPageRendered(true);
                            }
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </PdfDocument>
              </Flex>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="Comments" styles={{ body: COMMENTS_CARD_BODY_STYLE }}>
            <Flex vertical gap={14} style={{ height: "100%", minHeight: 0 }}>
              <Typography.Text type="secondary">
                Comments for this document are shown here.
              </Typography.Text>

              <div style={COMMENT_LIST_CONTAINER_STYLE}>
                {comments.length === 0 ? (
                  <Empty description="No comments yet" />
                ) : (
                  <Flex vertical gap={10}>
                    {comments.map((comment) => (
                      <Card
                        key={comment.id}
                        size="small"
                        style={{ borderRadius: 8 }}
                        styles={{ body: { padding: "10px 12px" } }}
                      >
                        <Flex vertical gap={6}>
                          <Flex align="center" justify="space-between">
                            <Typography.Text strong>{comment.author}</Typography.Text>
                            <Flex align="center" gap={8}>
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {comment.createdAt}
                              </Typography.Text>
                              <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => deleteComment(comment.id)}
                              >
                                Delete
                              </Button>
                            </Flex>
                          </Flex>
                          {comment.anchor ? (
                            <Tag color="blue">Page {comment.anchor.page}</Tag>
                          ) : null}
                          <Typography.Text>{comment.content}</Typography.Text>
                          {comment.anchor ? (
                            <Typography.Text type="secondary">
                              {comment.anchor.text}
                            </Typography.Text>
                          ) : null}
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                )}
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
}
