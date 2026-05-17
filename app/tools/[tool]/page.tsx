import { Metadata } from "next";
import { getToolById, utilityTools } from "@/lib/tools";
import { ToolPageClient } from "@/components/tools/ToolPageClient";

export function generateStaticParams() {
  return utilityTools.map((tool) => ({ tool: tool.id }));
}

export async function generateMetadata({ params }: { params: { tool: string } }): Promise<Metadata> {
  const tool = getToolById(params.tool);
  if (!tool) {
    return { title: "Tool — Conversion Hub", description: "Utility tool not found." };
  }
  return {
    title: `${tool.title} — Conversion Hub`,
    description: tool.description,
    alternates: { canonical: `https://conversionhub.com/tools/${tool.id}` },
    openGraph: { title: `${tool.title} — Conversion Hub`, description: tool.description, url: `https://conversionhub.com/tools/${tool.id}`, type: "website" },
  };
}

export default function ToolDetailPage({ params }: { params: { tool: string } }) {
  const tool = getToolById(params.tool);
  if (!tool) {
    return (
      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-10 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Tool not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">Return to the tools list to select a valid converter.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <ToolPageClient toolId={tool.id} />
    </section>
  );
}
