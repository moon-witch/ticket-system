import type { User } from "@supabase/supabase-js"

export default class AuthUserModel {
  id!: string;
  email!: string;

  public static from_supabase_user(user: User){
    return new AuthUserModel(user.email as string, user.id as string)
  }
  
  constructor(email: string, id: string){
    this.email = email;
    this.id = id;
  }
}