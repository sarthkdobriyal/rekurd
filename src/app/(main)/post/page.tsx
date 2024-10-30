import PostEditor from "@/components/posts/editor/PostEditor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function page() {
  return (
    <div className="w-full h-full flex flex-col"> 
    <div className="flex py-4 my-3 items-center  border-b px-4">
      <Link href={`/`}>
    <ArrowLeft />
      </Link>
    <div className="font-medium text-xl mx-auto ">Post</div>
  </div>
  <div className="h-full w-full flex justify-center items-center">

    <PostEditor />
  </div>
    </div>
  )
}

export default page