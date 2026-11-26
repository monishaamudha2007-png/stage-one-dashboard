import { describe, expect, it } from "vitest";
import { validateUrl } from "@/lib/validate-url";
import { highlightSegments } from "@/lib/highlight";

describe("url validation", () => {
  it("accepts a link without a scheme", () => expect(validateUrl("example.com/a")).toBeNull());
  it("rejects empty input", () => expect(validateUrl("  ")).not.toBeNull());
  it("rejects non-http schemes", () => expect(validateUrl("ftp://example.com")).not.toBeNull());
});

describe("message highlighting", () => {
  it("marks the exact flagged substring", () => {
    const segs = highlightSegments("Pay now or else", ["Pay now"]);
    expect(segs[0]).toEqual({ text: "Pay now", flagIndex: 0 });
  });
});
