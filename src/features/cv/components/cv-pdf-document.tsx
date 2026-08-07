import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { educationTypeIds } from "@/constants/catalog-ids";
import type { CvData, Skill } from "@/types/domain";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111",
    lineHeight: 1.4,
  },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  title: { fontSize: 11, marginBottom: 8 },
  meta: { fontSize: 9, color: "#444", marginBottom: 16 },
  section: { marginTop: 12 },
  heading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 3,
  },
  itemTitle: { fontFamily: "Helvetica-Bold", marginBottom: 2 },
  itemMeta: { fontSize: 9, color: "#555", marginBottom: 3 },
  text: { marginBottom: 6 },
  skillLine: { marginBottom: 3 },
});

function mmYyyy(month?: number | null, year?: number | null, current?: boolean) {
  if (current) return "Actualidad";
  if (!month || !year) return "";
  return `${String(month).padStart(2, "0")}/${year}`;
}

function dateRange(
  startMonth?: number | null,
  startYear?: number | null,
  endMonth?: number | null,
  endYear?: number | null,
  isCurrent?: boolean,
) {
  const start = mmYyyy(startMonth, startYear);
  const end = mmYyyy(endMonth, endYear, isCurrent);
  if (!start && !end) return "";
  if (!end) return start;
  if (!start) return end;
  return `${start} - ${end}`;
}

function skillNames(skills: Skill[]) {
  return skills.map((s) => s.label || s.name).filter(Boolean).join(", ");
}

function groupSkillsByType(skills: Skill[]) {
  const byType = new Map<
    string,
    { typeName: string; typeSortOrder: number; names: string[] }
  >();

  for (const skill of skills) {
    const name = skill.label || skill.name;
    if (!name) continue;
    const existing = byType.get(skill.typeId);
    if (existing) {
      existing.names.push(name);
    } else {
      byType.set(skill.typeId, {
        typeName: skill.typeName,
        typeSortOrder: skill.typeSortOrder,
        names: [name],
      });
    }
  }

  return [...byType.values()].sort(
    (a, b) =>
      a.typeSortOrder - b.typeSortOrder || a.typeName.localeCompare(b.typeName),
  );
}

const exportableEducationTypeIds = new Set<string>([
  educationTypeIds.career,
  educationTypeIds.certificationProgram,
]);

export function CvPdfDocument({
  data,
  labels,
}: {
  data: CvData;
  labels: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
  };
}) {
  const person = data.person;
  const name = person
    ? `${person.firstName} ${person.lastName}`
    : "Curriculum Vitae";

  const skillGroups = groupSkillsByType(data.skills);
  const educations = data.educations.filter((item) =>
    exportableEducationTypeIds.has(item.typeId),
  );
  const projects = data.projects.filter((item) => item.isFeatured);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{name}</Text>
        {person?.professionalTitle ? (
          <Text style={styles.title}>{person.professionalTitle}</Text>
        ) : null}
        <Text style={styles.meta}>
          {[person?.email, ...data.socialLinks.map((s) => s.url)]
            .filter(Boolean)
            .join(" | ")}
        </Text>

        {person?.about ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.summary}</Text>
            <Text style={styles.text}>{person.about}</Text>
          </View>
        ) : null}

        {skillGroups.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.skills}</Text>
            {skillGroups.map((group) => (
              <Text key={group.typeName} style={styles.skillLine}>
                {group.typeName}: {group.names.join(", ")}
              </Text>
            ))}
          </View>
        ) : null}

        {data.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.experience}</Text>
            {data.experiences.map((item) => {
              const dates = dateRange(
                item.startMonth,
                item.startYear,
                item.endMonth,
                item.endYear,
                item.isCurrent,
              );
              const meta = [item.typeName, item.modalityName, dates]
                .filter(Boolean)
                .join(" · ");
              const technologies = skillNames(item.skills);

              return (
                <View key={item.id} wrap={false}>
                  <Text style={styles.itemTitle}>
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                  </Text>
                  {meta ? <Text style={styles.itemMeta}>{meta}</Text> : null}
                  {item.description ? (
                    <Text style={styles.text}>{item.description}</Text>
                  ) : null}
                  {technologies ? (
                    <Text style={styles.itemMeta}>
                      Tecnologías: {technologies}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {educations.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.education}</Text>
            {educations.map((item) => {
              const dates = dateRange(
                item.startMonth,
                item.startYear,
                item.endMonth,
                item.endYear,
                item.isCurrent,
              );
              const meta = [item.typeName, dates].filter(Boolean).join(" · ");
              const technologies = skillNames(item.skills);

              return (
                <View key={item.id} wrap={false}>
                  <Text style={styles.itemTitle}>
                    {item.title}
                    {item.organization?.name
                      ? ` — ${item.organization.name}`
                      : ""}
                  </Text>
                  {meta ? <Text style={styles.itemMeta}>{meta}</Text> : null}
                  {item.description ? (
                    <Text style={styles.text}>{item.description}</Text>
                  ) : null}
                  {technologies ? (
                    <Text style={styles.itemMeta}>
                      Tecnologías: {technologies}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.projects}</Text>
            {projects.map((item) => {
              const dates = dateRange(
                item.startMonth,
                item.startYear,
                item.endMonth,
                item.endYear,
              );
              const technologies = skillNames(item.skills);
              const url = item.liveUrl || item.githubUrl;

              return (
                <View key={item.id} wrap={false}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  {dates ? <Text style={styles.itemMeta}>{dates}</Text> : null}
                  {item.description ? (
                    <Text style={styles.text}>{item.description}</Text>
                  ) : null}
                  {technologies ? (
                    <Text style={styles.itemMeta}>
                      Tecnologías: {technologies}
                    </Text>
                  ) : null}
                  {url ? <Text style={styles.itemMeta}>{url}</Text> : null}
                </View>
              );
            })}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
