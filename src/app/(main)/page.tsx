import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import TrendsSidebar from '../../components/TrendsSidebar';
import ForYouFeed from "./ForYouFeed";

export default  function Home() {


  return (
    <main className="flex w-full gap-5">
      <div className="flex w-full flex-col gap-5 lg:w-2/3">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
