// import React, { ReactElement } from "react";
import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useUser } from "../context/AuthContext";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";

interface Props {}

export default function Header({}: Props): ReactElement {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useUser();
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    await Auth.signOut();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <AspectRatioIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gramit
          </Typography>
          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
          {!user && (
            <>
              <Button color="inherit" onClick={() => router.push("/signin")}>
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
