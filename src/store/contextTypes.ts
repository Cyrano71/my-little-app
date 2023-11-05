export type AppContextType = {
  handleChange: (e: React.FormEvent<HTMLInputElement>, name: string) => void;
  connectWallet: (metamask?: any) => void;
  currentAccount: string;
  setFormData: (addressTo: string, amount: string) => void;
  formData: {
    addressTo: string;
    amount: string;
  };
  sendTransaction: (metamask?: any, connectedAccount?: string) => void;
  isLoading: boolean;
};
