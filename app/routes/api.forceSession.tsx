import {getSession} from "~/session.server";
import {json} from "@remix-run/node";
import {authenticate} from "../shopify.server";
export async function loader({ request }) {
    const {admin, session} = await authenticate.admin(request);
    console.log(admin);
    console.log(session);
}
