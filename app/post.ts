import path from 'path';
import fs from 'fs/promises';
import { processMarkdown } from '@ryanflorence/md';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';

export interface Post {
  slug: string;
  title: string;
  html?: string;
}

export interface PostCreateDto {
  slug: string;
  title: string;
  markdown: string;
}

export interface PostMarkdownAttributes {
  title: string;
}

const postsPath = path.join(__dirname, '../posts');

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts(): Promise<Post[]> {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter<PostMarkdownAttributes>(
        file.toString()
      );

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug + '.md');
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  return {
    slug,
    title: attributes.title,
    html: await processMarkdown(body),
  };
}

export async function createPost(post: PostCreateDto) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;

  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md);

  return getPost(post.slug);
}
