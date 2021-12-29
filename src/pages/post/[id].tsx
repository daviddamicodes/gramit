import React, { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { withSSRContext } from "aws-amplify";
import { listPosts, getPost } from "../../graphql/queries";
import { GetPostQuery, ListPostsQuery, Post } from "../../API";
import PostPreview from "../../components/PostPreview";
import { Container } from "@material-ui/core";
import PostComment from "../../components/PostComment";

interface Props {
  post: Post;
}

export default function IndividualPost({ post }: Props): ReactElement {
  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      {post.comments.items.map((comment) => (
        <PostComment key={comment.id} comment={comment} />
      ))}
    </Container>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const SSR = withSSRContext();

  const postQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery };

  // by returning { props: {posts} }, the Individual post component
  // will receive `post` as a prop at build time

  return {
    props: {
      posts: postQuery.data.getPost as Post,
    },
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();

  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  const paths = response.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: "blocking" };
};
