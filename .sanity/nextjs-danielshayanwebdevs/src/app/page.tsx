import Image from "next/image";
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/app/client"; // adjust this if your client is elsewhere

// Inline helper for building Sanity image URLs
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const POSTS_QUERY = `*[
  _type == "post" && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  publishedAt,
  image {
    asset->{
      _id,
      url
    },
    alt
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-8">
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/${post.slug.current}`}>
              <div className="space-y-2">
                {post.image?.asset?.url && (
                  <Image
                    src={urlFor(post.image).width(800).height(450).url()}
                    alt={post.image?.alt || post.title}
                    width={800}
                    height={450}
                    className="rounded-lg object-cover"
                  />
                )}
                <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
