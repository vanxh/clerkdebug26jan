import { trpc } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await trpc.user.me.query({});

  if (!user) {
    // This is a hack to make sure the user is created after the first login
    setInterval(() => {
      revalidatePath("/");
    }, 1000);
  }

  return <div>{children}</div>;
}
