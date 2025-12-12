import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return Response.json({
                success: false,
                message: "Missing username or password",
            });
        }

        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `;

        await sql`
            INSERT INTO users (username, password)
            VALUES (${username}, ${password})
        `;

        return Response.json({
            success: true,
            message: "User registered!",
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: "Error: " + err.message,
        });
    }
}
console.log("DB URL exists?", process.env.DATABASE_URL);
