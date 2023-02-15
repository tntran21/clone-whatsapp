import Head from "next/head";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import Button from "@mui/material/Button";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import {
  StyledContainer,
  StyledLoginContainer,
  StyledImageWrapper,
} from "./styles";

import { auth } from "@/config/firebase";

const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);

  const onLogin = () => {
    signInWithGoogle();
  };

  return (
    <StyledContainer>
      <Head>
        <title>Login</title>
      </Head>

      <StyledLoginContainer>
        <StyledImageWrapper>
          <WhatsAppIcon className="logo" />
        </StyledImageWrapper>

        <Button variant="outlined" onClick={onLogin}>
          Sign in with Google
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  );
};

export default Login;
