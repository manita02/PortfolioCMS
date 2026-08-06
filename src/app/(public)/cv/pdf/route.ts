import { renderToBuffer } from "@react-pdf/renderer";
import { CvPdfDocument } from "@/features/cv/components/cv-pdf-document";
import { getCvData } from "@/services/cv.service";

export async function GET(request: Request) {
  const data = await getCvData();
  const download = new URL(request.url).searchParams.get("download") === "1";

  const buffer = await renderToBuffer(
    CvPdfDocument({
      data,
      labels: {
        summary: "Resumen",
        experience: "Experiencia",
        education: "Educación",
        skills: "Habilidades",
        projects: "Proyectos",
      },
    }),
  );

  const filename = data.person
    ? `CV-${data.person.firstName}-${data.person.lastName}.pdf`
    : "CV.pdf";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": download
        ? `attachment; filename="${filename}"`
        : `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
