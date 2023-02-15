import styled from "styled-components";
import { Conversation } from "@/core/types";
import { useRecipient } from "@/core/hooks/useRecipient";
import RecipientAvatar from "../RecipientAvatar";
import { useRouter } from "next/router";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;
  :hover {
    background-color: #e9eaeb;
  }
`;

interface Props {
  id: string;
  conversationUser: Conversation["users"];
}

const ConversationSelect = ({ id, conversationUser }: Props) => {
  const router = useRouter();
  const { recipient, recipientEmail } = useRecipient(conversationUser);

  const onSelectConversation = () => {
    router.push(`/conversations/${id}`);
  };

  return (
    <StyledContainer onClick={() => onSelectConversation()}>
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      <span>{recipientEmail}</span>
    </StyledContainer>
  );
};

export default ConversationSelect;
