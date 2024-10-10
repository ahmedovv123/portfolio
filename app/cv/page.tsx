import { getCV } from '@/lib/cv'
import PostsWithSearch from '@/components/posts-with-search'
import MDXContent from "@/components/mdx-content";
import React from "react";

export default async function PostsPage() {
  const cv = await getCV()
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