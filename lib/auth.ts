import { useSession, useUser } from "@clerk/nextjs";

export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

type AuthUserState = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: ReturnType<typeof useUser>["user"] | null;
};

type AuthSessionState = {
  session: ReturnType<typeof useSession>["session"] | null;
};

const useClerkUserState = (): AuthUserState => {
  const { isLoaded, isSignedIn, user } = useUser();
  return { isLoaded, isSignedIn: Boolean(isSignedIn), user };
};

const useFallbackUserState = (): AuthUserState => ({
  isLoaded: true,
  isSignedIn: false,
  user: null,
});

const useClerkSessionState = (): AuthSessionState => {
  const { session } = useSession();
  return { session };
};

const useFallbackSessionState = (): AuthSessionState => ({
  session: null,
});

export const useAuthUser = isClerkConfigured
  ? useClerkUserState
  : useFallbackUserState;

export const useAuthSession = isClerkConfigured
  ? useClerkSessionState
  : useFallbackSessionState;
