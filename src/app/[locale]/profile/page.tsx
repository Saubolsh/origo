import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ProfilePageClient } from "@/features/auth";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfilePageClient />;
}
