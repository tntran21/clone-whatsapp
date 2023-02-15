import { db } from "@/config/firebase";
import {
  collection,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { IMessages } from "../types";

export const generateQueyMessages = (conversationId?: string) => {
  return query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("send_at")
  );
};

export const transformMessage = (
  message: QueryDocumentSnapshot<DocumentData>
) =>
  ({
    id: message.id,
    ...message.data(), // spread oust conversation_id, send_at, text, user
    send_at: message.data().send_at
      ? convertFireStoreTimestampToString(message.data().send_at as Timestamp)
      : null,
  } as IMessages);

export const convertFireStoreTimestampToString = (timestamp: Timestamp) =>
  new Date(timestamp.toDate().getTime()).toLocaleString();
