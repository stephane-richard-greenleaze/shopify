// app/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node';

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "session_greenlease",
        secrets: [process.env.SESSION_SECRET || "fallbackSecret"],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: false,
    },
});
