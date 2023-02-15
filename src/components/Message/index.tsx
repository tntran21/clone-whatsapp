import { auth } from "@/config/firebase";
import { IMessages } from "@/core/types";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  StyledMessage,
  StyledReceiverMessage,
  StyledSenderMessage,
  StyledTimestamp,
} from "./styles";

interface Props {
  message: IMessages;
}

const Message = ({ message }: Props) => {
  const [loggedUser, _loading, _error] = useAuthState(auth);

  const MessageType =
    loggedUser?.email === message.user
      ? StyledReceiverMessage
      : StyledSenderMessage;

  return (
    <MessageType>
      {message.text}
      <StyledTimestamp>{message.send_at}</StyledTimestamp>
    </MessageType>
  );
};

export default Message;
