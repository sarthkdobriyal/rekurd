"use client"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { submitPost } from "./actions"
import { useSession } from "@/app/(main)/SessionProvider"
import UserAvatar from "@/components/UserAvatar"
import { cn } from "@/lib/utils"
import LoadingButton from "@/components/LoadingButton"
import "./styles.css";

export default function PostEditor() {

    const { user } = useSession();
    const editor = useEditor({
        extensions : [
            StarterKit.configure({
                bold:false,
                italic:false,
            }),
            Placeholder.configure({
                placeholder: "Write something amazing..."
            })
        ]
    })


    const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";


    async function onSubmit() {
        await submitPost(input);
        editor?.commands.clearContent();
    }


    return <div  className="flex flex-col h-fit w-full gap-5 rounded-2xl bg-card p-5 shadow-sm">
         <div className="flex gap-5">
        
        <div  className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto outline-none border-none rounded-2xl bg-background px-5 py-3",
              // isDragActive && "outline-dashed",
            )}
            // onPaste={onPaste}
          />
        </div>
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
      </div>
      <div className="flex items-center justify-end gap-3">
      <LoadingButton
          onClick={onSubmit}
          // loading={mutation.isPending}
          // disabled={!input.trim() || isUploading}
          className="min-w-20"
          >
          Post
        </LoadingButton>
      </div> 
    </div>


}