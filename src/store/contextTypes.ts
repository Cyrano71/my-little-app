export type AppContextType = {
  handleChange: (e: React.FormEvent<HTMLInputElement>, name: string) => void;
  connectWallet: () => void;
  currentAccount: string;
  setFormData: (addressTo: string, amount: string) => void;
  formData: {
    addressTo: string;
    amount: string;
  };
  sendTransaction: (connectedAccount: string) => void;
  isLoading: boolean;
};
