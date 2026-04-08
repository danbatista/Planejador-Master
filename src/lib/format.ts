export function formatMoney(cents: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    ...options,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function sessionStatusPt(status: string) {
  const m: Record<string, string> = {
    scheduled: "Agendada",
    completed: "Concluída",
    cancelled: "Cancelada",
    no_show: "Não compareceu",
  };
  return m[status] ?? status.replace(/_/g, " ");
}

export function paymentMethodPt(method: string) {
  const map: Record<string, string> = {
    pix: "Pix",
    credit_card: "Cartão",
    cash: "Dinheiro",
    bank_transfer: "Transferência",
  };
  return map[method] ?? method.replace(/_/g, " ");
}

export function paymentStatusPt(status: string) {
  const m: Record<string, string> = {
    paid: "Pago",
    pending: "Pendente",
    overdue: "Em atraso",
  };
  return m[status] ?? status;
}

export function monthLabelPt(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
}
