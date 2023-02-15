import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styled from "@emotion/styled";

import SideBar from "@/components/SideBar";
import { auth, db } from "@/config/firebase";
import { Conversation, IMessages } from "@/core/types";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { getRecipientEmail } from "@/core/utils/getRecipentEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  generateQueyMessages,
  transformMessage,
} from "@/core/utils/getMessagesConversation";
import ConversationScreen from "@/components/ConversationScreen";

interface Props {
  conversation: Conversation;
  messages: IMessages[];
}

const Conversation = ({ conversation, messages }: Props) => {
  const [loggedUser, _loading, _error] = useAuthState(auth);

  return (
    <StyledContainer>
      <Head>
        <title>
          Conversation with {getRecipientEmail(conversation.users, loggedUser)}
        </title>
      </Head>
      <SideBar />

      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversationContainer>
    </StyledContainer>
  );
};

export default Conversation;

// Server
export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;

  // Get conversation, to know who are chatting with
  const conversationRef = doc(db, "conversations", conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // Get all messages betwee logged in user and recipient in this conversation
  const queryMessages = generateQueyMessages(conversationId);
  const messagesSnapshot = await getDocs(queryMessages);

  const messages = messagesSnapshot.docs.map((messageDoc) =>
    transformMessage(messageDoc)
  );

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};

// Styles
const StyledContainer = styled.div`
  display: flex;
`;
const StyledConversationContainer = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
