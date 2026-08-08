import { CvDownloadButton } from "@/components/shared/cv-download-button";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "CV",
    description: "Curriculum vitae en formato PDF.",
    path: "/cv",
  });
}

export default async function CvPage() {
  const generatedPdf = "/cv/pdf";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-16 sm:px-6 sm:pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">CV</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Curriculum vitae en formato PDF.
          </p>
        </div>
        <CvDownloadButton variant="default" size="default" showIcon={false} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/60 px-4 py-3">
          <p className="text-sm font-medium">Visor de CV</p>
        </div>
        <iframe
          title="Visor de CV"
          src={generatedPdf}
          className="h-[min(80vh,900px)] w-full bg-background"
        />
      </div>
    </div>
  );
}
