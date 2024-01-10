import { UserRoles } from "@/helpers/UserRoles";
import type DepartmentModel from "./DepartmentModel";
import type RoleModel from "./RoleModel";
import { DefaultDepartments } from "@/helpers/defaultDepartments";

export default class AccountModel {
  user_id!: string;
  name!: string;
  surname!: string | null;
  email!: string | null;
  telephone!: string | null;
  role_id!: UserRoles;
  department_id!: number;
  creation_date!: string;

  role!: RoleModel | null;
  department?: DepartmentModel | null;
  constructor() {

  }

  public static create_empty(){
    let acc =  new AccountModel();
    acc.user_id = ""
    acc.name = ""
    acc.surname = null;
    acc.email = null;
    acc.telephone = null;
    acc.role_id = UserRoles.customer;
    acc.department_id = DefaultDepartments.None;
    acc.creation_date = new Date().toLocaleString();

    acc.role = null;
    acc.department = null;

    return acc;
  }

  public clearValue(){
    Object.assign(this, AccountModel.create_empty())
  }

  public update(updatedUser: AccountModel){
    Object.assign(this, updatedUser)
    return this;
  }
}