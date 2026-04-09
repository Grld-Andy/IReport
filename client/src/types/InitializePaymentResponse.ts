export interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    reference: string;
  };
}