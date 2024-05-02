import {ActionFunctionArgs, json} from "@remix-run/node";
import {authenticate, unauthenticated} from "~/shopify.server";
import {getSession} from "~/session.server";

const generateUniq = (prefix: string = '') => {
    const time = Date.now().toString(36); // Convert timestamp to base-36
    const random = Math.random().toString(36).substr(2, 9); // Generate a random string
    return prefix + time + random;
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function formatNumberAsFloat(num: number): number {
    return parseFloat(num.toFixed(2));
}

export async function action({
                                 request,
                             }: ActionFunctionArgs) {
    console.log('---hit proxy---')

    const {session, admin, storefront} = await authenticate.public.appProxy(request);
	// Use private access token on requests that don't come from Shopify
   // const { storefront } = await unauthenticated.storefront('quickstart-682bebea');
    console.log('Session', session);
    console.log('storefront', storefront);
    const data = await request.json();
    console.log('-----try retrieve cart---', JSON.parse(data.cartContents))
    const cartContents = JSON.parse(data.cartContents);
    //var base_url = process.env.SHOPIFY_APP_URL + "/api/redirect";
    var base_url = `https://${session.shop}` + "/apps/greenlease-proxy/api/redirect";
    console.log('base_url', base_url);



    try {
        const lineItems = cartContents.items.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity
        }));
        const orderData = {
            "checkout": {
                "line_items": lineItems,
            }
        };
        const orderResponse = await admin.rest.post({
            path: 'admin/api/2024-04/checkouts.json',
            data: orderData,
        });
        console.log('Order created:', orderResponse);

    } catch (error) {
        console.error('Failed to create order:', error);
    }

    try {
        const uniq = generateUniq();
        const price = cartContents.items[0].line_price / 100;
        var formattedPrice = formatNumberAsFloat(price);
        const payload = {
            "transactionId": `trans_${uniq}`,
            "shop": {
                "urls": {
                    "shop": "cdiscount.com", //session.shop,
                    "success": base_url +"?success=true",
                    "failure": base_url +"?success=false"
                },
                "language": "fr"
            },
            "customer":{},
            "products": [
                {
                    "name": cartContents.items[0].title,
                    "unitPrice": price ,
                    "vat": 20,
                    "quantity": 1,
                    "combination":{
                        "name": cartContents.items[0].title
                    },
                    "imageUrl": cartContents.items[0].image
                }
            ],
            "cartId": getRandomArbitrary(1,99999), // peux pas string
            "cartSecureKey": cartContents.token,
            "totalInitialFees": 20 // todo : take from param app
        }

        console.log(payload);


        const responseTransac = await fetch('https://pay.greenleaze.com/send-shop-order-data', {
            method: 'POST', // Set the method to POST
            headers: {
                'x-api-key': '7ea199ed-9953-45ea-896c-da04d6d6bfb8',
                'Content-Type': 'application/json' // Set the Content-Type to application/json
            },
            body: JSON.stringify(payload)
        });
        console.log('response is OK?', responseTransac.status);

        return json({'status' : 'ok','uniq':uniq, 'redirectUrl': 'https://pay.greenleaze.com/order/step-1?transaction_id=trans_'+uniq }); // Assuming you have a function named json() that handles the response.
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return json({ error: error.message }); // Properly handle and return the error case.
    }

}
