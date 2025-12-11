import { sql } from "@lib/db.js"
import Error from "next/error"

class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoginError";
  }
}


export async function login(info){
    const{username, password} = info.json()
    const users = await sql`
    SELECT * FROM accounts
    WHERE username = ${username}
    LIMIT 1
    `
    if (users.length() = 0){
        throw new LoginError("No User Found")
    }
    if(users[0].password=password){
        return true
    }
    else{
        throw new LoginError("Incorrect Password")
    }
    




}