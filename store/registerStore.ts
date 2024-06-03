import { create } from "zustand";

type RegisterStore = {
    name: string;
    role: string;
    email: string;
    setName: (newName: string) => void;
    setRole: (newRole: string) => void;
    setEmail: (newEmail: string) => void;
};


export const useRegisterStore = create<RegisterStore>((set) => ({
    name: "",
    role: "",
    email: "",
    setName: (newName) => set({ name: newName }),
    setRole: (newRole) => set({ role: newRole }),
    setEmail: (newEmail) => set({ email: newEmail }),
}));