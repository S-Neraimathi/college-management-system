import { create } from "zustand";
type ChangePasswordStore = {
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    setPassword: (newPassword: string) => void;
    setConfirmPassword: (newConfirmPassword: string) => void;
    setShowPassword: (show: boolean) => void;
    setShowConfirmPassword: (show: boolean) => void;
};

export const useChangePasswordStore = create<ChangePasswordStore>((set) => ({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    setPassword: (newPassword) => set({ password: newPassword }),
    setConfirmPassword: (newConfirmPassword) => set({ confirmPassword: newConfirmPassword }),
    setShowPassword: (show) => set({ showPassword: show }),
    setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
}));
