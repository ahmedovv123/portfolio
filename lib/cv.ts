/* eslint-disable */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PostMetadata } from "@/lib/posts";

const rootDirectory = path.join(process.cwd(), 'content', 'cv')

export type CV = {
  content: string
}

export async function getCV(): Promise<CV | null> {
  try {
    const filePath = path.join(rootDirectory, `cv.mdx`)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
    const { content } = matter(fileContent)
    return { content }
  } catch (error) {
    return null
  }
}