import { defineConfig } from "orval";

export default defineConfig({
  reviewflow: {
    input: {
      target: "http://localhost:8000/docs-json",
    },
    output: {
      mode: "split",
      target: "./src/api/generated/reviewflow.ts",
      schemas: "./src/api/generated/model",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/lib/orval-mutator.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: false,
        },
      },
    },
  },
});
