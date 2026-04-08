import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ProgressEntry } from "@/types/database";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  h1: { fontSize: 20, marginBottom: 12 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  p: { marginBottom: 4, lineHeight: 1.4 },
  box: { marginTop: 8, padding: 8, borderWidth: 1, borderColor: "#e2e8f0" },
});

type DogRow = {
  name: string;
  breed: string | null;
  age_months: number | null;
  training_goals: string | null;
  behavioral_problems: string | null;
};

export function DogReportDocument({
  dog,
  client,
  progress,
}: {
  dog: DogRow;
  client: { name: string; email: string | null; phone: string | null } | null;
  progress: ProgressEntry[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Relatório de adestramento — {dog.name}</Text>
        <Text style={styles.p}>Tutor: {client?.name ?? "—"}</Text>
        {client?.email ? <Text style={styles.p}>E-mail: {client.email}</Text> : null}
        {client?.phone ? <Text style={styles.p}>Telefone: {client.phone}</Text> : null}
        <Text style={styles.h2}>Perfil do cão</Text>
        {dog.breed ? <Text style={styles.p}>Raça: {dog.breed}</Text> : null}
        {dog.age_months != null ? (
          <Text style={styles.p}>Idade: {dog.age_months} meses</Text>
        ) : null}
        {dog.training_goals ? (
          <Text style={styles.p}>Objetivos: {dog.training_goals}</Text>
        ) : null}
        {dog.behavioral_problems ? (
          <Text style={styles.p}>Foco comportamental: {dog.behavioral_problems}</Text>
        ) : null}
        <Text style={styles.h2}>Resumo da evolução</Text>
        {progress.length === 0 ? (
          <Text style={styles.p}>Nenhum registro ainda.</Text>
        ) : (
          progress.map((e) => (
            <View key={e.id} style={styles.box} wrap={false}>
              <Text style={{ fontWeight: "bold" }}>
                {e.title || e.entry_type} —{" "}
                {new Date(e.recorded_at).toLocaleDateString("pt-BR")}
              </Text>
              {e.body ? <Text style={styles.p}>{e.body}</Text> : null}
              {e.instructor_comment ? (
                <Text style={styles.p}>Adestrador: {e.instructor_comment}</Text>
              ) : null}
              {e.session_result ? (
                <Text style={styles.p}>Aula: {e.session_result}</Text>
              ) : null}
            </View>
          ))
        )}
        <Text style={{ marginTop: 16, fontSize: 9, color: "#64748b" }}>
          Gerado pelo PataPro — recomendações: constância, sessões objetivas e reforço
          positivo. Sugestões com IA podem ser integradas por API no futuro.
        </Text>
      </Page>
    </Document>
  );
}
