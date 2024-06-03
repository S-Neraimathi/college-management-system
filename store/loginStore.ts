import { create } from "zustand";
type LoginStore = {
    showPassword: boolean;
    email: string;
    password: string;
    setShowPassword: (show: boolean) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
    showPassword: false,
    email: "",
    password: "",
    setShowPassword: (show) => set({ showPassword: show }),
    setEmail: (email) => set({ email: email }),
    setPassword: (password) => set({ password: password }),
}));