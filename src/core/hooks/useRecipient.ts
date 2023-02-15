import { auth, db } from "@/config/firebase";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { AppUser, Conversation } from "../types";
import { getRecipientEmail } from "../utils/getRecipentEmail";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  // Get recipient email
  const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

  // Get recipient avatar
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );

  const [recipientsSnapShot, __loading, __error] =
    useCollection(queryGetRecipient);

  // recipientsSnapShot?.docs could be an empty array
  const recipient = recipientsSnapShot?.docs[0]?.data() as AppUser | undefined;

  return {
    recipientEmail,
    recipient,
  };
};
