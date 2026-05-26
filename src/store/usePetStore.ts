import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PetType = 'dog' | 'cat' | null;
export type PetSize = 'small' | 'medium' | 'large' | null;

interface PetProfile {
  name: string;
  type: PetType;
  breed: string;
  size: PetSize;
  age: number | null;
  imageUrl?: string;
}

interface PetStore {
  profile: PetProfile | null;
  setProfile: (profile: PetProfile) => void;
  clearProfile: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'pet-profile-storage',
    }
  )
);
