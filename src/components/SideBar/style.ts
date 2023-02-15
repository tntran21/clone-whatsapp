import styled from "@emotion/styled";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  background-color: white;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  height: 80px;
  padding: 15px;
  border-bottom: 1px solid whitesmoke;
`;

export const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 15px;
`;

export const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

export const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const StyledSideBarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;
