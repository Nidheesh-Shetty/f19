import { sql } from "@lib/db.js"
import { NextResponse } from "next/server";

export async function POST(info){
    const {username, password} =  await info.json()
    try {
        const users = await sql`
        SELECT * FROM accounts
        WHERE username = ${username}
        LIMIT 1
        `
        if(users.length>0){
            return NextResponse.json({
            "success": false,
            "message": "Username already exists"
            })
        }
        await sql`
        INSERT INTO accounts(username, password)
        VALUES ( ${username},${password})
        RETURNING id, username
        ` 
        return NextResponse.json({
            "success": true,
            "message": "success"
            })
    }
    catch(err){
        return NextResponse.json({
      success: false,
      message: "Database error"
      });

    }

}