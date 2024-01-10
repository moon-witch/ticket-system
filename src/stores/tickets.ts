import {ref} from 'vue'
import { defineStore } from 'pinia'
import {supabase} from "../supabase";
import {useToast} from "primevue/usetoast";
import { DefaultDepartments } from '@/helpers/defaultDepartments';

export const useTicketStore = defineStore('ticket', () => {
    const ticketTypes = ref<Record<string, any>[]>([])
    const priorities = ref<Record<string, any>[]>([])
    const departments = ref<Record<string, any>[]>([])
    const ticketStatus = ref<Record<string, any>[]>([])
    const tickets = ref<Record<string, any>[]>([])
    const ticketsOfOneCustomer = ref<Record<string, any>[]>([])
    const singleTicket = ref<Record<string, any>[]>([])
    const loadingState = ref<Record<string, boolean>>({})

    const toast = useToast()
    async function createTicket(ticketData: Record<string, any>) {
        const newTicket = ref<any | null>(null)
        try {
            const { data, error, status} = await supabase
                .from('ticket')
                .insert({
                    due_date: ticketData.dueDate,
                    lastmessage: null,
                    type_id: ticketData.type.type_id,
                    department_id: ticketData.department.department_id,
                    assignee: ticketData.employee.user_id,
                    customer_id: ticketData.customer.user_id,
                    status_id: ticketData.status,
                    priority_id: ticketData.priority.priority_id
                })
                .select()

            if (error && status !== 406) throw error

            newTicket.value = data
        } catch (error: any) {
            console.log(error.message)
        } finally {
            toast.add({ severity: 'success', summary: 'Ticket successfully created', detail: `Created new ticket with the id ${newTicket.value[0]['ticket_id']}.`, life: 3000 });
        }
    }

    async function getAllTickets() {
        try {
            const { data, error, status } = await supabase
                .from('ticket')
                .select(`*`)

            if (error && status !== 406) throw error

            if (data) {
                tickets.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getTicketsOfOneCustomer(customer_id: string) {
        try {
            const { data, error, status } = await supabase
                .from('ticket')
                .select(`ticket_id, type_id, status_id, customer_id, seen_by_customer`)
                .eq('customer_id', customer_id)

            if (error && status !== 406) throw error

            if (data) {
                ticketsOfOneCustomer.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getSingleTicket(id: string) {
        singleTicket.value = []
        try {
            const { data, error, status } = await supabase
                .from('ticket')
                .select(`ticket_id, due_date, creation_date, lastmessage, type_id, department_id, status_id, priority_id, customer_id, assignee, seen_by_customer`)
                .eq('ticket_id', id)

            if (error && status !== 406) throw error

            if (data) {
                singleTicket.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getTicketTypes() {
        try {
            const { data, error, status } = await supabase.from('tickettype').select(`type_id, name`)

            if (error && status !== 406) throw error

            if (data) {
                ticketTypes.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getPriorities() {
        try {
            const { data, error, status } = await supabase.from('ticketpriority').select(`priority_id, name`)

            if (error && status !== 406) throw error

            if (data) {
                priorities.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getDepartments() {
        try {
            const { data, error, status } = await supabase.from('department').select(`department_id, name`).order('department_id')

            if (error && status !== 406) throw error

            if (data) {
                departments.value = data.filter(d => ![DefaultDepartments.None, DefaultDepartments.Customer].includes(d.department_id))
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getStatus() {
        try {
            const { data, error, status } = await supabase.from('ticketstatus').select(`status_id, name`)

            if (error && status !== 406) throw error

            if (data) {
                ticketStatus.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function updateTicketData(updateData: Record<string, any>, columnName: string, updateKey: string, updateTicketId: string) {
        try {
            loadingState.value[columnName] = true
            if (columnName === 'due_date') {
                const { data, error, status } = await supabase
                    .from('ticket')
                    .update({[columnName]: updateData.toLocaleString()})
                    .eq('ticket_id', updateTicketId)
            } else {
                const { data, error, status } = await supabase
                    .from('ticket')
                    .update({[columnName]: updateData[updateKey]})
                    .eq('ticket_id', updateTicketId)
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
            loadingState.value[columnName] = false
        }
    }

    async function updateTicketViewStatus(ticketId: number, currentStatus: boolean) {
        try {
            const { data, error, status } = await supabase
                .from('ticket')
                .update({seen_by_customer: !currentStatus})
                .eq('ticket_id', ticketId)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return {
        ticketTypes, priorities, departments, tickets, ticketStatus, singleTicket, loadingState, ticketsOfOneCustomer,
        createTicket, getTicketTypes, getPriorities, getDepartments, getAllTickets, getStatus, getSingleTicket, updateTicketData, getTicketsOfOneCustomer, updateTicketViewStatus }
})
