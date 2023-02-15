import styled from "@emotion/styled";
import Avatar from "@mui/material/Avatar";

import { useRecipient } from "@/core/hooks/useRecipient";

type UseRecipientReturnType = ReturnType<typeof useRecipient>;

const RecipientAvatar = ({
  recipient,
  recipientEmail,
}: UseRecipientReturnType) => {
  return (
    <>
      {recipient?.photoURL ? (
        <StyledAvatar src={recipient.photoURL} />
      ) : (
        <StyledAvatar>
          {recipientEmail && recipientEmail[0].toUpperCase()}
        </StyledAvatar>
      )}
    </>
  );
};

export default RecipientAvatar;

// Styles
const StyledAvatar = styled(Avatar)`
  margin: 5px 15px 5px 5px;
`;
