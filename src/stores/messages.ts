import { defineStore } from 'pinia'
import { supabase } from "../supabase";
import { useAccountStore } from './accounts';
import { UserRoles } from '@/helpers/UserRoles';
import MessageModel from '@/models/MessageModel';
import { MessageTypes } from '@/helpers/MessageType';
import { useTicketStore } from './tickets';

export const useMessageStore = defineStore('message', () => {

  
  async function getTicketMessages(ticketId: number){
    if(useAccountStore().currentUserRole == undefined) await useAccountStore().getCurrentUserRole();
    let messages: MessageModel[] = new Array<MessageModel>();
    let request = supabase.from('message')
    let dbRequest: any;

    const baseQuery = 'message_id, content, timestamp, ticket_id, message_type_id, user_id, department_id, account (name, surname)'
    switch(useAccountStore().currentUserRole?.role_id){
      case UserRoles.customer:
        dbRequest = request.select(baseQuery)
        .eq('ticket_id', ticketId)
        .eq('message_type_id', MessageTypes.external)
        break;
      case UserRoles.admin:
      case UserRoles.agent:
        dbRequest = request
        .select(baseQuery + ', department (name, department_id)')
        .eq('ticket_id', ticketId)
        break;
    }
    const { data, error, status } = await dbRequest.order('timestamp', { ascending: true })
    if(data){
      
      messages = data.map((m: any) => {
        let msg = m as MessageModel
        msg.messageType = MessageTypes[msg.message_type_id];
        msg.user_name = m.account.name + ' ' + m.account.surname
        return msg;
      }) ;
    }
    return messages;
  }

  async function sendMessage(message: MessageModel){
    if(!useAccountStore().currentUser) return;
    
    const { data, error, status } = await supabase
    .from('message')
    .insert(message)
    let seen_by_customer = useAccountStore().currentUser?.role_id != UserRoles.customer;
    await useTicketStore().updateTicketViewStatus(message.ticket_id, seen_by_customer)
  }  

  return { getTicketMessages, sendMessage }
})