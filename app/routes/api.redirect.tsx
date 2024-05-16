import { getSession } from "~/session.server";
import { json } from "@remix-run/node";
import {authenticate} from "~/shopify.server";


export async function loader({ request }) {
    console.log('-----hit proxy REDIRECT --- ')
    //const session = await getSession(request.headers.get('Cookie'));
    const {session, admin, storefront} = await authenticate.public.appProxy(request);

    const url = new URL(request.url);

	// Get the 'cart-secure-key' query parameter
    const cartSecureKey = url.searchParams.get('cart-secure-key');

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
