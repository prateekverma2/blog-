import BlogPost from "@/components/blogpage/BlogPost";
import TTScomponent from "@/components/blogpage/TtsComp";
import axios from "axios";
import { SERVER_ADDR } from "@/app/utils/atom";
import { BlogData } from "@/app/utils/types";
import Citations from "@/components/blogpage/Citations"

async function fetchBlogData(id: string): Promise<BlogData | null> {
  try {
    const response = await axios.get(`${SERVER_ADDR}/api/posts/${id}`);
    console.log("Fetched Blog Data:", response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blogData = await fetchBlogData(params.slug);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {blogData ? <BlogPost blogData={blogData} /> : <h1>Blog not found</h1>}
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <div className="bg-card rounded-lg shadow-sm p-4 border">
            <h3 className="text-lg font-medium mb-3">Audio Version</h3>
            <TTScomponent params={{ id: params.slug }} />
          </div>

          <Citations citations={blogData?.citations} />
        </div>
      </div>
    </div>
  );
}


