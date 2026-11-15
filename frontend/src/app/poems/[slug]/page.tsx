import { poems as allPoems } from "#site/content";
import { notFound } from "next/navigation";
import PoemReader from "@/components/PoemReader";

export const generateStaticParams = async () =>
  allPoems.map((poem) => ({ slug: poem.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const poem = allPoems.find((p) => p.slug === slug);

  if (!poem) return { title: "Poem Not Found | Haunted Forest" };
  return {
    title: `${poem.title} | Poems | Haunted Forest`,
    description: poem.excerpt,
  };
};

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poem = allPoems.find((p) => p.slug === slug);

  if (!poem) {
    notFound();
  }

  // Sort poems by date for chronological anthology navigation
  const sortedPoems = allPoems
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = sortedPoems.findIndex((p) => p.slug === slug);
  const prevPoem = currentIndex > 0 ? sortedPoems[currentIndex - 1] : null;
  const nextPoem =
    currentIndex < sortedPoems.length - 1 ? sortedPoems[currentIndex + 1] : null;

  return (
    <PoemReader
      poem={poem}
      prevPoem={prevPoem}
      nextPoem={nextPoem}
    />
  );
}
