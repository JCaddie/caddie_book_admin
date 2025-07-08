import WorkDetailPageContent from "@/app/(admin)/works/[id]/work-detail-page-content";

interface WorkDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params;

  return <WorkDetailPageContent workId={id} />;
}
