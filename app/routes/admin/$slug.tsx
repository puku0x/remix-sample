import { useLoaderData } from 'remix';
import invariant from 'tiny-invariant';

import { getPost } from '~/post';

interface DataFunctionArgs {
  params: {
    slug: string;
  };
}

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
}

export default function PostSlug() {
  const post = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return <div dangerouslySetInnerHTML={{ __html: post.html ?? '' }} />;
}
