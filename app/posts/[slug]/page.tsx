import React from 'react'
import { getPostBySlug, getPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import MDXContent from "@/components/mdx-content";
import { formatDate } from "@/lib/utils";
import Head from "next/head";
import { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await getPosts()
  const slugs = posts.map(post => ({ slug: post.slug }))

  return slugs
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post)
    notFound()

  const { metadata } = post
  const { title, image, summary, keywords } = metadata

  const data = {
    title,
    description: summary,
    keywords,
    openGraph: {
      title,
      description: summary,
      type: 'article'
    },
    twitter: {
      title,
      description: summary,
    }
  }

  if (image) {
    data.openGraph.images = [
      {
        url: image,
        width: 1200,
        height: 600
      }
    ]

    data.twitter.images = [
      {
        url: image,
        width: 1200,
        height: 600
      }
    ]
  }

  return data
}

export default async function Post({ params }: { params: { slug: string } }) {

  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post)
    notFound()

  const { metadata, content } = post
  const { title, image, author, publishedAt, summary, keywords } = metadata

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={summary} />
        <meta name="keywords" content={keywords} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content='article' />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={summary} />
        <meta name="twitter:image" content={image} />

      </Head>
      <section className='pb-24 pt-32'>
        <div className='container max-w-3xl'>
          <Link
            href='/posts'
            className='mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground'
          >
            <ArrowLeftIcon className='h-5 w-5'/>
            <span>Back to posts</span>
          </Link>

          {image && (
            <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
              <Image
                src={image}
                alt={title || ''}
                className='object-cover'
                fill
              />
            </div>
          )}

          <header>
            <h1 className='title'>{title}</h1>
            <p className='mt-3 text-xs text-muted-foreground'>
              {author} / {formatDate(publishedAt ?? '')}
            </p>
          </header>

          <main className='prose mt-16 dark:prose-invert'>
            <MDXContent source={content}/>
          </main>

          {/*<footer className='mt-16'>*/}
          {/*  <NewsletterForm/>*/}
          {/*</footer>*/}
        </div>
      </section>
    </>
  )
}