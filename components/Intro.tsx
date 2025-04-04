/* eslint-disable */

import Image from 'next/image'
// @ts-ignore
import authorImage from "@/public/images/authors/IMG_2928.JPG"

export default function Intro() {
  return (
    <section className='flex flex-col-reverse items-center gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h1 className='title no-underline'>Hey, I&#39;m Ahmet.</h1>
        <p className='mt-3 font-light text-muted-foreground'>
          I&#39;m a Senior Frontend Developer with 4 years of experience based in Varna, Bulgaria. I&#39;m
          passionate about learning new technologies and sharing knowledge with
          others.
        </p>
      </div>
      <div className='relative'>
        <Image
          className='flex-1 rounded-lg'
          src={authorImage}
          alt='Ahmet Ahmedov'
          width={175}
          height={175}
          priority
        />
      </div>
    </section>
  )
}
