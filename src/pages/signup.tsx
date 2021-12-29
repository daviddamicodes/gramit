import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Grid, TextField } from "@material-ui/core";
import { Auth } from "aws-amplify";
import Snackbar from "@mui/material/Snackbar";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (error) {
      console.error(error);
      setSignUpError(error.message);
      setOpen(true);
    }
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  console.log("The value of the user from the hooks is:", user);

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Success Signed in user:", amplifyUser);
      if (amplifyUser) {
        router.push("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
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
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            {...register("email", {
              required: { value: true, message: "Please enter a valid email" },
              minLength: {
                value: 3,
                message: "Please enter a email between 3 and 16 characters",
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

        {showCode && (
          <Grid item>
            <TextField
              id="code"
              label="Verification Code"
              type="text"
              variant="outlined"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register("code", {
                required: {
                  value: true,
                  message: "Please enter a valid code",
                },
                minLength: {
                  value: 6,
                  message: "Your verification code is 6 characters long",
                },
              })}
            />
          </Grid>
        )}

        <Grid style={{ marginTop: 16 }}>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : "Sign up"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
}
