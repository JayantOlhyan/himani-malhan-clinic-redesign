import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchItems } from "@/lib/search";

const index = buildSearchIndex();
const top = (q: string) => searchItems(index, q)[0]?.title;

describe("site search", () => {
  it("indexes every service, category, clinic and FAQ", () => {
    expect(index.filter((i) => i.kind === "Service")).toHaveLength(28);
    expect(index.filter((i) => i.kind === "Area of care")).toHaveLength(4);
    expect(index.filter((i) => i.kind === "Clinic")).toHaveLength(2);
    expect(new Set(index.map((i) => `${i.href}|${i.title}`)).size).toBe(index.length);
  });

  it.each([
    ["pcod", "PCOD / PCOS Treatment"],
    ["c-section", "Caesarean Section"],
    ["ivf", "Infertility Treatment"],
    ["high risk", "High-Risk Pregnancy"],
    ["fibroid", "Fibroid & Ovarian Cyst Treatment"],
    ["hpv", "HPV Vaccination"],
    ["menopause", "Perimenopause & Menopause Management"],
    ["abortion", "Abortion / MTP Services"],
  ])("finds %s → %s", (q, expected) => {
    expect(top(q)).toBe(expected);
  });

  it("finds clinics by timing and locality words", () => {
    expect(searchItems(index, "timings").some((r) => r.kind === "Clinic")).toBe(true);
    expect(top("sector 39")).toMatch(/Medsarc/);
  });

  it("requires every word to match and handles empty input", () => {
    expect(searchItems(index, "pregnancy zzzz")).toEqual([]);
    expect(searchItems(index, "   ")).toEqual([]);
  });

  it("links services without pages to their anchor on the category page", () => {
    const s = index.find((i) => i.title === "Normal Delivery")!;
    expect(s.href).toBe("/expertise/pregnancy-maternity/#normal-delivery");
  });
});
