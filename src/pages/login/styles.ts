import styled from "@emotion/styled";

export const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;

export const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  .logo {
    font-size: 50px;
  }
`;

export const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

// Error: https://nextjs.org/docs/messages/page-without-valid-component
const Styled = "";
export default Styled;
