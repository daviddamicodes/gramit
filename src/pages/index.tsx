import { Container, Typography } from "@material-ui/core";
import { QueryBuilderSharp } from "@material-ui/icons";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";
import { ListPostsQuery, Post } from "../API";
import { maxWidth } from "@material-ui/system";
import PostPreview from "../components/PostPreview";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({
        query: listPosts,
      })) as {
        data: ListPostsQuery;
        errors: any[];
      };

      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromApi();
  }, []);

  console.log("USER:", user);
  console.log("POSTS:", posts);
  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}
