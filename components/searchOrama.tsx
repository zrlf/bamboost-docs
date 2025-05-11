"use client";

import { OramaClient } from "@oramacloud/client";
import type { SharedProps } from "fumadocs-ui/components/dialog/search";
import SearchDialog from "fumadocs-ui/components/dialog/search-orama";

const client = new OramaClient({
  endpoint: "https://cloud.orama.run/v1/indexes/bamboost-tqx8ce",
  api_key: "4q8kdpIidr7wY0F9uJnaVYSTX2yPLHBZ",
});

export function CustomSearchDialog(props: SharedProps) {
  return (
    <SearchDialog
      {...props}
      client={client}
      showOrama
      allowClear
      tags={[
        { name: "API", value: "api-bamboost" },
        { name: "Documentation", value: "docs" },
      ]}
    />
  );
}
