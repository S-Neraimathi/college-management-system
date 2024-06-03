import { create } from 'zustand';
type AuthStore = {
    roleName: string;
    setRole: (role: string) => void;
    mail: string;
    setMail: (mail: string) => void;
    logStatus: boolean,
    setLogStatus: (status: boolean) => void;
};
export const useAuthStore = create<AuthStore>((set) => ({
    roleName: "",
    setRole: (role) => set({ roleName: role }),
    mail: "",
    setMail: (mail) => set({ mail: mail }),
    logStatus: false,
    setLogStatus: (status) => set({ logStatus: status }),
}));