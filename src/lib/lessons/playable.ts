export function playableLessonWhere() {
  return {
    status: "published" as const,
    mediaAsset: {
      is: {
        status: "uploaded" as const,
      },
    },
  };
}
