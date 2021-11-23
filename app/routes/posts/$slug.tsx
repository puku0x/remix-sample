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

  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
}
