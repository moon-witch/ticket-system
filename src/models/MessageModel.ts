import type { MessageTypes } from "@/helpers/MessageType";
import type DepartmentModel from "./DepartmentModel";

export default class MessageModel{
  message_id!: number;
  content!: string;
  timestamp!: string;
  ticket_id!: number;
  message_type_id!: MessageTypes;
  user_id!: string;
  department_id?: number | null;

  messageType!: string;
  user_name!: string;
  department?: DepartmentModel | null

  constructor(content: string, ticketId: number, messageTypeId: MessageTypes){
    this.content = content;
    this.ticket_id = ticketId;
    this.message_type_id = messageTypeId
  }
}