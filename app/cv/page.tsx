import { getCV } from '@/lib/cv'
import MDXContent from "@/components/mdx-content";
import React from "react";
import { notFound } from "next/navigation";

export default async function PostsPage() {
  const cv = await getCV()

  if (!cv)
    notFound()

  const { content } = cv

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>

        <main className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content}/>
        </main>
      </div>
    </section>
  )
}