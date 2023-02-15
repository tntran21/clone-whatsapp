import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

import {
  StyledContainer,
  StyledHeader,
  StyledSearch,
  StyledUserAvatar,
  StyledSearchInput,
  StyledSideBarButton,
} from "./style";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection, doc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "@/core/types";
import ConversationSelect from "../ConversationSelect";

const SideBar = () => {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  const [open, setOpen] = useState(false);
  const [recipientEmail, setResipientEmail] = useState("");

  const isInvitingSelf = recipientEmail === loggedInUser?.email;

  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("ERROR LOGOUT");
    }
  };

  // Check if conversation alreary exists between the current logged in user and recipient
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );
  const [conversationsSnapShot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const isConversationAlreadyExists = (recipientEmail: string) => {
    console.log("conversationsSnapShot: ", conversationsSnapShot?.docs);
    conversationsSnapShot?.docs.map((conversation) => {
      console.log("conversation: ", conversation.data());
    });

    return conversationsSnapShot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users?.includes(recipientEmail)
    );
  };

  const createConversation = async () => {
    if (!recipientEmail) return;

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversation user to db "conversation" collection
      // A conversation is between the currently logged in user and the user invited.
      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
    }

    toggleDialog(false);
  };

  const toggleDialog = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setResipientEmail("");
  };
  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email} placement="right">
          <StyledUserAvatar src={loggedInUser?.photoURL || ""} />
        </Tooltip>
        <div>
          <IconButton>
            <ChatBubbleOutlineOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in list friend" />
      </StyledSearch>

      <StyledSideBarButton onClick={() => toggleDialog(true)}>
        START A NEW CONVERSATION
      </StyledSideBarButton>

      {/* List conversation*/}
      {conversationsSnapShot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUser={(conversation.data() as Conversation)?.users}
        />
      ))}

      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a new Google Email address for the user you wish to
            chat with
          </DialogContentText>
          <TextField
            autoFocus
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(evt) => {
              setResipientEmail(evt.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(false)}>Cancel</Button>
          <Button
            onClick={() => createConversation()}
            disabled={!recipientEmail}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default SideBar;
