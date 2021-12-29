import { ButtonBase, Grid, Paper, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { ReactElement } from "react";
import { Post } from "../API";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import IconButton from "@material-ui/core/IconButton";
import dateConverter from "../functions/dateConverter";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  post: Post;
}

function PostPreview({ post }: Props): ReactElement {
  const router = useRouter();

  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={3}
        style={{ padding: 12, marginTop: 24 }}
      >
        {/* Upvotes container */}
        <Grid item style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <ImArrowUp />
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <Typography variant="h6">
                    {(post.upvotes - post.downvotes).toString()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item textAlign="center">
              <ImArrowDown />
            </Grid>
          </Grid>
        </Grid>
        {/* Contents preview */}
        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by <b>{post.owner}</b>{" "}
                  {post.createdAt && dateConverter(post.createdAt)}h ago
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post.title}</Typography>
              </Grid>
              <Grid
                item
                style={{
                  maxHeight: 32,
                  overflowY: "hidden",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="body1">{post.contents}</Typography>
              </Grid>
              {!post.image && (
                <Grid
                  item
                  style={{
                    overflowY: "hidden",
                    overflowX: "hidden",
                  }}
                >
                  <Image
                    src={"https://source.unsplash.com/random"}
                    height={700}
                    width={500}
                    layout="intrinsic"
                  />
                </Grid>
              )}
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PostPreview;
