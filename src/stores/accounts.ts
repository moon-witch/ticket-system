import {ref, type Ref, toRaw} from 'vue'
import { defineStore } from 'pinia'
import {supabase} from "../../supabase";
import AccountModel from '@/models/AccountModel';
import DepartmentModel from '@/models/DepartmentModel';

export const useAccountStore = defineStore('account', () => {
    const customers = ref<Record<string, any>[]>([])
    const employees = ref<Record<string, any>[]>([])
    const singleCustomer = ref<Record<string, any>[]>([])
    const userRoles = ref<Record<string, any>[]>([])
    const currentUserId = ref<string>();
    const currentUserRole = ref<{ role_id: any; }>()
    const currentUserDepartment = ref<DepartmentModel | undefined>()
    const currentUser: Ref<AccountModel | undefined> = ref(new AccountModel()) 
    const allAccounts = ref<AccountModel[]>([])

    async function setCurrentUser(userId: string){
        const { data, error, status } = await supabase
                .from('account')
                .select('*, department (*), role (*)')
                .eq('user_id', userId)
                .single()
        if (error && status !== 406) throw error
        
        if(data){
            currentUser.value = AccountModel.create_empty().update(data)
        }
    }

    async function getAllAccounts(includeJoins: boolean = false) {
        try {
            const query = includeJoins ? "*, department (department_id, name), role (role_id, name)" : "*";
            const { data, error, status } = await supabase
                .from('account')
                .select(query)

            if (error && status !== 406) throw error

            if (data) {
                allAccounts.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getCustomers() {
        try {
            const { data, error, status } = await supabase
                .from('account')
                .select(`user_id, name, surname, telephone, role_id, department_id, creation_date`)
                .eq('role_id', 1)

            if (error && status !== 406) throw error

            if (data) {
                customers.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getSingleCustomer(customerId: string) {
        try {
            const { data, error, status } = await supabase
                .from('account')
                .select(`*`)
                .eq('user_id', customerId)

            if (error && status !== 406) throw error

            if (data) {
                singleCustomer.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getAllUserRoles() {
        try {
            const { data, error, status } = await supabase
                .from('role')
                .select(`*`)

            if (error && status !== 406) throw error

            if (data) {
                userRoles.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getCurrentUserRole() {
        if(!currentUserId.value) return;
        try {
            const { data, error, status } = await supabase
                .from('account')
                .select(`role_id`)
                .eq('user_id', currentUserId.value)
                .single()

            if (error && status !== 406) throw error

            if (data) {
                currentUserRole.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function getEmployees() {
        try {
            const { data, error, status } = await supabase
                .from('account')
                .select(`user_id, name, surname, telephone, role_id, department_id, creation_date`)
                .eq('role_id', 2)

            if (error && status !== 406) throw error

            if (data) {
                employees.value = data
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    async function updateUser(updatedUser: AccountModel) {
        try {
            const { error } = await supabase
                .from('account')
                .update({
                    name: updatedUser.name,
                    surname: updatedUser.surname,
                    telephone: updatedUser.telephone,
                    role_id: updatedUser.role_id,
                    department_id: updatedUser.department_id
                })
                .eq('user_id', updatedUser.user_id)

            if (error) throw error
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return { currentUserId, customers, employees, singleCustomer, userRoles, currentUserRole, allAccounts, currentUser,
        getCustomers, getEmployees, getSingleCustomer, getAllUserRoles, getCurrentUserRole, getAllAccounts,
        updateUser, setCurrentUser }
})

