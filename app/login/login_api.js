import { sql } from "../../lib/db.js"
import { NextResponse } from "next/server";

export async function POST(info){
    const{username, password} = await info.json()
    const users = await sql`
    SELECT * FROM accounts
    WHERE username = ${username}
    LIMIT 1
    `
    if (users.length = 0){
        return NextResponse.json({
          "success": false,
          "message": "No user found"
        })

    }
    if(users[0].password===password){
        return NextResponse.json({
          "success": true,
          "message": "Logging in"
        })

    }
    else{
        return NextResponse.json({
          "success": false,
          "message": "Incorrect password"
        })
    }
    




}