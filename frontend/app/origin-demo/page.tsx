// src/app/origin-demo/page.tsx
import { Button } from "@shared/ui/button";

export default function OriginDemoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-14 px-6 py-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Origin UI + Tailwind v4</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Build beautiful UIs fast
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
          Copy–paste friendly components compatible with shadcn/ui and OKLCH tokens.
          This page showcases a few common patterns composed with your current setup.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button size="sm">Get started</Button>
          <Button variant="outline" size="sm">
            Components
          </Button>
        </div>
      </section>

      {/* Feature grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Accessible",
            desc: "Composed with semantic HTML and headless primitives.",
          },
          {
            title: "Theming",
            desc: "Driven by OKLCH tokens defined in your globals.css.",
          },
          {
            title: "Composable",
            desc: "Utilities + variants make customization straightforward.",
          },
          {
            title: "Performant",
            desc: "Lean styles via Tailwind v4 and on-demand CSS generation.",
          },
          {
            title: "Consistent",
            desc: "Shared UI primitives ensure cohesive experiences.",
          },
          {
            title: "DX focused",
            desc: "Integrates with shadcn CLI and your alias structure.",
          },
        ].map((f) => (
          <article
            key={f.title}
            className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm"
          >
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* CTA strip */}
      <section className="flex flex-col items-center justify-between gap-3 rounded-lg border bg-accent/40 p-5 text-accent-foreground sm:flex-row">
        <div>
          <h4 className="text-sm font-medium">Ready to explore more components?</h4>
          <p className="text-sm text-muted-foreground">Visit originui.com and paste into your project.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Docs</Button>
          <Button size="sm" variant="outline">
            Browse components
          </Button>
        </div>
      </section>
    </main>
  );
}
