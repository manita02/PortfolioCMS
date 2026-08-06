import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CvData } from "@/types/domain";

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
});

function mmYyyy(month?: number | null, year?: number | null, current?: boolean) {
  if (current) return "Actualidad";
  if (!month || !year) return "";
  return `${String(month).padStart(2, "0")}/${year}`;
}

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

        {data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.skills}</Text>
            <Text style={styles.text}>
              {data.skills.map((s) => s.name).join(", ")}
            </Text>
          </View>
        ) : null}

        {data.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.experience}</Text>
            {data.experiences.map((item) => (
              <View key={item.id} wrap={false}>
                <Text style={styles.itemTitle}>
                  {item.title}
                  {item.organization?.name
                    ? ` — ${item.organization.name}`
                    : ""}
                </Text>
                <Text style={styles.itemMeta}>
                  {mmYyyy(item.startMonth, item.startYear)} -{" "}
                  {mmYyyy(item.endMonth, item.endYear, item.isCurrent)}
                </Text>
                {item.description ? (
                  <Text style={styles.text}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.educations.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.education}</Text>
            {data.educations.map((item) => (
              <View key={item.id} wrap={false}>
                <Text style={styles.itemTitle}>
                  {item.title}
                  {item.organization?.name
                    ? ` — ${item.organization.name}`
                    : ""}
                </Text>
                <Text style={styles.itemMeta}>
                  {mmYyyy(item.startMonth, item.startYear)} -{" "}
                  {mmYyyy(item.endMonth, item.endYear, item.isCurrent)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>{labels.projects}</Text>
            {data.projects.map((item) => (
              <View key={item.id} wrap={false}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.text}>
                  {item.summary || item.description}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
