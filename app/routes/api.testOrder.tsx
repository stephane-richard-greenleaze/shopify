import {getSession} from "~/session.server";
import {json} from "@remix-run/node";
import {authenticate} from "../shopify.server";
import prisma from "~/db.server";
export async function loader({ request }) {
    const {admin, session} = await authenticate.admin(request);
    console.log(admin);
    console.log(session);

    await prisma.session.create({
        data: {
            id: session.id,
            shop: session.shop,
            state: session.state,
            isOnline: session.isOnline,
            scope: session.scope,
            expires: session.expires ? new Date(session.expires) : null,
            accessToken: session.accessToken,
            userId: session.userId ? BigInt(session.userId) : null,
        },
    });

    return json({ accessToken: session.accessToken});
}
