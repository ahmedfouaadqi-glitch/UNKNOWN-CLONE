export type ModerationResult = { status: "allow" | "review" | "reject"; code: string };
export function moderateText(input: unknown): ModerationResult;
