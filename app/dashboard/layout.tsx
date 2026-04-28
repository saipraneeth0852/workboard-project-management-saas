import { PlanProvider } from "@/features/dashboard/contexts/PlanContext";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    return (
      <PlanProvider hasProPlan={false} hasEnterprisePlan={false}>
        {children}
      </PlanProvider>
    );
  }

  const { has } = await auth();
  const hasProPlan = has({ plan: "pro_user" });
  const hasEnterprisePlan = has({ plan: "enterprise_user" });

  return (
    <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>
      {children}
    </PlanProvider>
  );
}
