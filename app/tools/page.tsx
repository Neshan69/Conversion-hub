import Link from "next/link";
import { Metadata } from "next";
import { utilityTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools — Conversion Hub",
  description: "Modern converter tools for binary, hex, unicode, date calculations, GPA, and more.",
  alternates: {
    canonical: "https://conversionhub.com/tools",
  },
  openGraph: {
    title: "Tools — Conversion Hub",
    description: "Modern converter tools for binary, hex, unicode, date calculations, GPA, and more.",
    url: "https://conversionhub.com/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-background/80 p-8 shadow-xl shadow-primary/10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Utility Ecosystem</p>
          <h1 className="text-4xl font-semibold text-foreground">Global tools for modern conversions</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            Explore powerful conversion tools built for accuracy, performance, and mobile-first use. Each utility includes instant results and clear explanations.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {utilityTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="group rounded-[2rem] border border-border/70 bg-card/80 p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-2xl"
          >
            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">{tool.id.replace(/-/g, " ")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">{tool.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
