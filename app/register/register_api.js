import { sql } from "@lib/db.js"

class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RegistrationError";
  }
}

export async function registration(info){
    const {username, password} =  await info.json()
    try {
        const users = await sql`
        SELECT * FROM accounts
        WHERE username = ${username}
        LIMIT 1
        `
        if(users.length>0){
            throw new RegistrationError("username already exists")
        }
        const user = await sql`
        INSERT INTO accounts(username, password)
        VALUES ( ${username},${password})
        RETURNING id, username
        `
        return Response.json({user: user[0] });
    }
    catch(error){
        return RegistrationError("Error with Database")

    }

}