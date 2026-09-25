import { describe, expect, it } from "vitest";
import { collectContent, validateContent } from "@/content/validate";
import { allServices, categories, detailedServices, serviceHref } from "@/content/services";
import { nav } from "@/content/site";

describe("content contract", () => {
  it("current content passes validation", () => {
    expect(() => validateContent()).not.toThrow();
  });

  it("rejects duplicate slugs, placeholder copy and bad links", () => {
    const c = structuredClone(collectContent());
    c.categories[0].services.push({ ...c.categories[0].services[0] });
    c.categories[1].description = "Lorem ipsum dolor sit amet, consectetur.";
    c.nav.push({ label: "Broken", href: "/no-trailing-slash" });
    let message = "";
    try {
      validateContent(c);
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toMatch(/duplicate service slug "high-risk-pregnancy"/);
    expect(message).toMatch(/categories\.1\.description: placeholder text/);
    expect(message).toMatch(/trailing slash/);
  });

  it("has the 28 services from the brief, grouped into 4 categories", () => {
    expect(categories).toHaveLength(4);
    expect(allServices).toHaveLength(28);
  });

  it("links only services that have a page", () => {
    for (const s of allServices) expect(Boolean(serviceHref(s.slug))).toBe(Boolean(s.detail));
    expect(detailedServices.length).toBeGreaterThan(0);
  });

  it("points every category nav item at a real category", () => {
    const categoryPaths = new Set(categories.map((c) => `/expertise/${c.slug}/`));
    for (const item of nav.filter((n) => n.href.startsWith("/expertise/") && n.href !== "/expertise/")) {
      expect(categoryPaths.has(item.href)).toBe(true);
    }
  });
});
