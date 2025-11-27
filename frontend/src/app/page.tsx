import BlogCard from '../components/homepage/BlogCard';
import HomeStyle from '@/components/homepage/HomeComp';
import { SERVER_ADDR } from './utils/atom';

async function getPosts() {
  const res = await fetch(`${SERVER_ADDR}/api/posts/random`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <main className="relative px-4 py-8 max-w-6xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl text-center text-white tracking-wide mb-4 font-semibold">
            ReadME
          </h1>
        </header>

        <section className="flex flex-col gap-4">
          <div className="mb-4">
            <HomeStyle />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post: { 
              title: string; 
              wordCount: number; 
              id: string;
              imageUrl: string;
              content : string
            }, index: number) => (
              <BlogCard key={post.id || index} post={post} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}