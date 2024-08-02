import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";


export default async function Home() {


    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    console.log(posts);
 

  return (
    <main className="flex w-full flex-col gap-5">
      <PostEditor />
      {
        posts.map(post => <Post key={post.id} post={post} />)
      }
    </main>
  );
}