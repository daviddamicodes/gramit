import { Grid, Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import { Comment } from "../API";
import dateConverter from "../functions/dateConverter";

interface Props {
  comment: Comment;
}

function PostComment({ comment }: Props): ReactElement {
  console.log("comment:", comment);
  return (
    <Paper style={{ width: "100%", minHeight: 128, padding: 8 }} elevation={1}>
      {comment && (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Typography variant="body1">
              <b>{comment.owner}</b> - {dateConverter(comment.createdAt)}h ago
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">{comment.content}</Typography>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default PostComment;
