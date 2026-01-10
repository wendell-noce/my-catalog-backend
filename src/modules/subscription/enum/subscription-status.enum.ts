export enum SubscriptionStatus {
  FREE, // Usuário sem assinatura
  TRIALING, // Em período de trial (7 dias)
  ACTIVE, // Assinatura ativa e paga
  PAST_DUE, // Pagamento atrasado (ainda tem acesso temporário)
  CANCELLED, // Cancelada mas ainda tem acesso até fim do período
  INCOMPLETE, // Pagamento inicial falhou
  INCOMPLETE_EXPIRED, // Pagamento não completado a tempo
  UNPAID, // Múltiplas tentativas falharam
  PAUSED, // Pausada temporariamente (feature do Stripe)
}
