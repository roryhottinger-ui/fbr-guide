// ─────────────────────────────────────────────────────────────
// App state (Zustand) with AsyncStorage persistence.
// Holds eligibility answers/result, checklist answers, and the
// checked-state map. All local on-device — no data leaves the app.
// ─────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { RawChecklistAnswers } from '@/content/checklistQuestions';
import type { EligibilityAnswerKey, EligibilityResult } from '@/types';

interface AppState {
  // Eligibility
  eligibilityAnswers: Partial<Record<EligibilityAnswerKey, string>>;
  eligibilityResult: EligibilityResult | null;
  setEligibilityAnswer: (key: EligibilityAnswerKey, value: string) => void;
  setEligibilityResult: (result: EligibilityResult | null) => void;
  resetEligibility: () => void;

  // Checklist
  checklistAnswers: RawChecklistAnswers;
  checked: Record<string, boolean>;
  setChecklistAnswer: (key: string, value: string) => void;
  toggleChecked: (id: string) => void;
  resetChecklist: () => void;

  // Timeline reminders (Phase 6)
  submittedDate: string | null; // ISO date
  setSubmittedDate: (iso: string | null) => void;

  // Onboarding / disclaimer
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;

  // Hydration flag (persist middleware)
  _hydrated: boolean;
  setHydrated: () => void;

  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      eligibilityAnswers: {},
      eligibilityResult: null,
      setEligibilityAnswer: (key, value) =>
        set((s) => ({ eligibilityAnswers: { ...s.eligibilityAnswers, [key]: value } })),
      setEligibilityResult: (result) => set({ eligibilityResult: result }),
      resetEligibility: () => set({ eligibilityAnswers: {}, eligibilityResult: null }),

      checklistAnswers: {},
      checked: {},
      setChecklistAnswer: (key, value) =>
        set((s) => ({ checklistAnswers: { ...s.checklistAnswers, [key]: value } })),
      toggleChecked: (id) => set((s) => ({ checked: { ...s.checked, [id]: !s.checked[id] } })),
      resetChecklist: () => set({ checklistAnswers: {}, checked: {} }),

      submittedDate: null,
      setSubmittedDate: (iso) => set({ submittedDate: iso }),

      disclaimerAccepted: false,
      acceptDisclaimer: () => set({ disclaimerAccepted: true }),

      _hydrated: false,
      setHydrated: () => set({ _hydrated: true }),

      resetAll: () =>
        set({
          eligibilityAnswers: {},
          eligibilityResult: null,
          checklistAnswers: {},
          checked: {},
          submittedDate: null,
        }),
    }),
    {
      name: 'fbr-guide-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        eligibilityAnswers: s.eligibilityAnswers,
        eligibilityResult: s.eligibilityResult,
        checklistAnswers: s.checklistAnswers,
        checked: s.checked,
        submittedDate: s.submittedDate,
        disclaimerAccepted: s.disclaimerAccepted,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
