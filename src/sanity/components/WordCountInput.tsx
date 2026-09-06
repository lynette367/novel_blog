import React from "react";
import { useFormValue } from "sanity";
import { Card, Text, Flex, Badge, Box } from "@sanity/ui";

export function WordCountInput() {
  const content = (useFormValue(["content"]) as string) || "";

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const noSpaceChars = content.replace(/\s+/g, "").length;
  const totalChars = content.length;
  // Estimated reading time (average English reading speed: 200-250 words/min)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return (
    <Card
      padding={3}
      radius={2}
      tone={words > 0 ? "primary" : "default"}
      border
      style={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
    >
      <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
        <Flex align="center" gap={2} wrap="wrap">
          <Box>
            <Text size={2} weight="semibold">
              Word Count
            </Text>
          </Box>
          <Box>
            <Badge tone={words > 0 ? "positive" : "default"}>
              {words.toLocaleString()} {words === 1 ? "word" : "words"}
            </Badge>
          </Box>
        </Flex>
        {words > 0 && (
          <Text size={1} muted>
            ⏱️ Est. reading time: ~{readingTimeMinutes} min
          </Text>
        )}
      </Flex>
    </Card>
  );
}
