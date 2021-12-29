import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Grid, Snackbar, TextField } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import { useUser } from "../context/AuthContext";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  password: string;
}

export default function SignIn() {
  const [open, setOpen] = useState(false);
  const [signInError, setSignInError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { username, password } = data;
    try {
      await Auth.signIn(username, password);
      console.log("Success Signed in user:", amplifyUser);
      router.push("/");
      setOpen(true);
    } catch (error) {
      setSignInError(error.message);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={0}
        >
          <Grid item>
            <TextField
              id="username"
              label="Username"
              type="text"
              variant="outlined"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              {...register("username", {
                required: {
                  value: true,
                  message: "Please enter a valid username",
                },
              })}
            />
          </Grid>

          <Grid item>
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : null}
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter a valid password",
                },
                minLength: {
                  value: 8,
                  message: "Please enter a stronger password",
                },
                maxLength: {
                  value: 16,
                  message: "Please enter a stronger password",
                },
              })}
            />
          </Grid>

          <Grid style={{ marginTop: 16 }}>
            <Button variant="contained" type="submit">
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signInError}
        </Alert>
      </Snackbar>
    </>
  );
}
