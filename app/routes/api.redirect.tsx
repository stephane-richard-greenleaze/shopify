import { getSession } from "~/session.server";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import prisma from "~/db.server";


export async function loader({ request }) {
    console.log('-----hit proxy REDIRECT --- ')
    //const session = await getSession(request.headers.get('Cookie'));
   // const {session, admin, storefront} = await authenticate.public.appProxy(request);

    const url = new URL(request.url);
    console.log(url);

    return json({status: 200});


}



export async function action({
                                 request,
                             }: ActionFunctionArgs) {
    console.log('-----hit proxy REDIRECT ACTION --- ')
    //const session = await getSession(request.headers.get('Cookie'));
    const {session, admin, storefront} = await authenticate.public.appProxy(request);

    const requestData = await request.json();
    const cartSecureKey = requestData.cartSecureKey;

    console.log(cartSecureKey);
    if (!cartSecureKey) {
        // Handle the case where the cart-secure-key is not provided
        throw new Response('Cart secure key is required', { status: 400 });
    }

    //const shopUrl = session.get('shopUrl');
    console.log(session);
    //console.log(admin.rest.params.config);
    try {
        const orderResponse = await admin.rest.post({
            path: `admin/api/2024-04/checkouts/${cartSecureKey}/complete.json`,
            data: {},
        });
        console.log('Order created:', orderResponse);
        return json({status: 200}); // redirec to sucess
    } catch (error) {
        console.error('Failed to create order:', error);
        return json({ error: 'Failed to create order' }, { status: 500, err: error, session: session });
    }

}

