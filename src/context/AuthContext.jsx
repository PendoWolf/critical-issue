import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const defaultUser = {
  name: "Alex Rivera",
  email: "alex@northwind.io",
  company: "Northwind Analytics",
  role: "Growth Lead",
  plan: "growth",
  onboarded: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [onboardingDraft, setOnboardingDraft] = useState({
    company: "",
    role: "",
    useCase: "",
    channels: [],
    dataset: "",
  });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      onboardingDraft,
      setOnboardingDraft,
      login: (email = defaultUser.email) => {
        const userData = { ...defaultUser, email, onboarded: true };
        setUser(userData);
        pendo.identify({
          visitor: {
            id: userData.email,
            email: userData.email,
            full_name: userData.name,
            company: userData.company,
            role: userData.role,
            plan: userData.plan,
            onboarded: userData.onboarded,
          },
          account: {
            id: userData.company,
            name: userData.company,
          },
        });
      },
      signup: (payload) => {
        const userData = { ...defaultUser, ...payload, onboarded: false };
        setUser(userData);
        pendo.identify({
          visitor: {
            id: userData.email,
            email: userData.email,
            full_name: userData.name,
            company: userData.company,
            role: userData.role,
            plan: userData.plan,
            onboarded: userData.onboarded,
          },
          account: {
            id: userData.company,
            name: userData.company,
          },
        });
      },
      completeOnboarding: () => {
        setUser((prev) => (prev ? { ...prev, onboarded: true } : prev));
      },
      logout: () => {
        pendo.clearSession();
        setUser(null);
      },
      updatePlan: (plan) =>
        setUser((prev) => (prev ? { ...prev, plan } : prev)),
    }),
    [user, onboardingDraft],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
