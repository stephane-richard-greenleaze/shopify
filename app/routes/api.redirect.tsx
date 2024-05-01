import { getSession } from "~/session.server";
import { json } from "@remix-run/node";
import {authenticate} from "~/shopify.server";


export async function loader({ request }) {
    console.log('-----hit proxy REDIRECT --- ')
    //const session = await getSession(request.headers.get('Cookie'));
    const {session, admin, storefront} = await authenticate.public.appProxy(request);

    console.log(admin);
    //const shopUrl = session.get('shopUrl');
   // console.log(session);
    console.log(admin.rest.params.config);

    const orderData = {
        "order": {
            "line_items": [{
                "variant_id": 1234567890, // Replace with actual variant ID
                "quantity": 1
            }],
            "customer": {
                "id": 1234567890 // Replace with actual customer ID
            },
            "financial_status": "paid",
            "transactions": [{
                "kind": "sale",
                "status": "success",
                "amount": "199.99"
            }]
        }
    };

    try {
        const orderResponse = await admin.rest.post({
            path: 'admin/api/2024-04/orders.json',
            data: orderData,
        });
        console.log('Order created:', orderResponse);
        return json(orderResponse.body);
    } catch (error) {
        console.error('Failed to create order:', error);
        return json({ error: 'Failed to create order' }, { status: 500, err: error, session: session });
    }


    return json({ error: session });
}
