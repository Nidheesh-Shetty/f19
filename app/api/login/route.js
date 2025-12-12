import { neon } from "@neondatabase/serverless";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        const sql = neon(process.env.DATABASE_URL);

        const user = await sql`
            SELECT * FROM users
            WHERE username = ${username} AND password = ${password}
            LIMIT 1
        `;

        if (user.length === 0) {
            return Response.json({
                success: false,
                message: "Invalid username or password",
            });
        }

        return Response.json({
            success: true,
            message: "Login successful!",
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: err.message,
        });
    }
}
