export interface CreateCustomerDTO {
  email: string;
  name: string;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionDTO {
  customerId: string;
  priceId: string; // ID do preço no gateway (ex: price_xxx no Stripe)
  trialPeriodDays?: number;
  metadata?: Record<string, any>;
}

export interface CreatePaymentDTO {
  customerId: string;
  amount: number; // em centavos (ex: 5000 = R$ 50,00)
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionDTO {
  subscriptionId: string;
  newPriceId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface IPaymentGateway {
  // Criar cliente no gateway
  createCustomer(data: CreateCustomerDTO): Promise<{
    id: string;
    email: string;
  }>;

  // Criar assinatura
  createSubscription(data: CreateSubscriptionDTO): Promise<{
    id: string;
    status: string;
    currentPeriodEnd: Date;
  }>;

  // Cancelar assinatura
  cancelSubscription(subscriptionId: string): Promise<{
    id: string;
    status: string;
  }>;

  // Criar pagamento único (para pro-rata, por exemplo)
  createPayment(data: CreatePaymentDTO): Promise<{
    id: string;
    status: string;
    amount: number;
  }>;

  // Atualizar assinatura (para upgrade/downgrade)
  updateSubscription(data: UpdateSubscriptionDTO): Promise<{
    id: string;
    status: string;
  }>;

  // Buscar assinatura
  getSubscription(subscriptionId: string): Promise<{
    id: string;
    status: string;
    currentPeriodEnd: Date;
  }>;
}
