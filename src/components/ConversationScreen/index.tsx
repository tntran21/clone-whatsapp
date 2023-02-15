import { useRecipient } from "@/core/hooks/useRecipient";
import { Conversation, IMessages } from "@/core/types";
import {
  convertFireStoreTimestampToString,
  generateQueyMessages,
  transformMessage,
} from "@/core/utils/getMessagesConversation";
import MoreVert from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import RecipientAvatar from "../RecipientAvatar";
import {
  EndOfMessagesAutoScroll,
  StyledH3,
  StyledHeaderInfo,
  StyledHeaderTool,
  StyledInput,
  StyledInputContainer,
  StyledMessageContainer,
  StyledRecipientHeader,
} from "./styles";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";
import Message from "../Message";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

interface Props {
  conversation: Conversation;
  messages: IMessages[];
}

const ConversationScreen = ({ conversation, messages }: Props) => {
  const router = useRouter();
  const conversationId = router.query.id;
  const conversationUser = conversation.users;

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const { recipient, recipientEmail } = useRecipient(conversationUser);
  const [loggedUser, _loading, _error] = useAuthState(auth);

  const [newMessage, setNewMessage] = useState("");

  // Get all messages betwee logged in user and recipient in this conversation
  const queryMessages = generateQueyMessages(conversationId as string);
  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryMessages);

  const showMessages = () => {
    // IF front-end is loading messages behind the scenes, display messages retrieved from Next SSR (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ));
    }

    // If front-end finished loading messages, sho now we have messagesSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message, index) => (
        <Message key={message.id} message={transformMessage(message)} />
      ));
    }

    return null;
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    // update last_seen in 'users' collection
    await setDoc(
      doc(db, "users", loggedUser?.uid as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true } // just update what is change
    );

    // add new message to 'messages' collection
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      send_at: serverTimestamp(),
      text: newMessage,
      user: loggedUser?.email,
    });

    // reset input field
    setNewMessage("");
    scrollToBottom();
  };

  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      if (!newMessage) return;

      addMessageToDbAndUpdateLastSeen();
    }
  };

  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    if (!newMessage) return;

    addMessageToDbAndUpdateLastSeen();
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window !== "undefined")
      endOfMessagesRef.current?.scrollIntoView();
  });

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active:{" "}
              {convertFireStoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>
        <StyledHeaderTool>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </StyledHeaderTool>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* For auto scroll to the end when a new message is sent */}
        <EndOfMessagesAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      {/* Enter new message */}
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(evt) => setNewMessage(evt.target.value)}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
