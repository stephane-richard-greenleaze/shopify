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
    // const response = await storefront.graphql(
    //         `#graphql
    //     query {
    //         cart(id: "${data.cartContents.token}") {
    //             id
    //             checkoutUrl
    //             createdAt
    //             updatedAt
    //             lines(first: 5) {
    //                 edges {
    //                     node {
    //                         merchandise {
    //                             ... on ProductVariant {
    //                                 product {
    //                                     title
    //                                 }
    //                                 title
    //                                 priceV2 {
    //                                     amount
    //                                     currencyCode
    //                                 }
    //                             }
    //                         }
    //                         quantity
    //                     }
    //                 }
    //             }
    //             estimatedCost {
    //                 subtotalAmount {
    //                     amount
    //                     currencyCode
    //                 }
    //                 totalAmount {
    //                     amount
    //                     currencyCode
    //                 }
    //             }
    //         }
    //     }
    //     `
    // );
    // console.log(response);
	// const response = await storefront.graphql(
    //         `#graphql
    //     mutation createCart($lineItems: [CartLineInput!]!) {
    //         cartCreate(input: {lines: $lineItems}) {
    //             cart {
    //                 id
    //                 createdAt
    //                 lines(first: 5) {
    //                     edges {
    //                         node {
    //                             id
    //                             quantity
    //                             merchandise {
    //                                 ... on ProductVariant {
    //                                     id
    //                                     product {
    //                                         title
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //                 estimatedCost {
    //                     totalAmount {
    //                         amount
    //                         currencyCode
    //                     }
    //                 }
    //             }
    //             userErrors {
    //                 field
    //                 message
    //             }
    //         }
    //     }`,
    //     {
    //         lineItems: [
    //             { merchandiseId: "gid://shopify/ProductVariant/1234567890", quantity: 1 }
    //         ]
    //     }
	// );



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
