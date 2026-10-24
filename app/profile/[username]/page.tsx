import { INITIAL_MOCK_USERS } from "@/lib/mockData";
import ProfileView from "@/app/features/profile/components/ProfileView";

export function generateStaticParams() {
  return INITIAL_MOCK_USERS.flatMap((user) => [
    { username: `@${user.username}` },
  ]);
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfileView username={username} />;
}
