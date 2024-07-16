import { getSession } from "~/session.server";
import {ActionFunctionArgs, json} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import prisma from "~/db.server";


export async function loader({ request }) {
    console.log('-----hit proxy REDIRECT --- ')
    //const session = await getSession(request.headers.get('Cookie'));
   // const {session, admin, storefront} = await authenticate.public.appProxy(request);

    const url = new URL(request.url);
     if(url.searchParams.get('success') == 'false'){
       const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopify Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #2c3e50;
            }
            p {
                font-size: 18px;
                margin: 10px 0;
            }
            a {
                text-decoration: none;
            }
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #2980b9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Greenleaze</h1>
            <p style="color:red;">Une erreur s'est produite lors du parcours.</p>
               <p style="color:red;">Veuillez réessayer plus tard.</p>
            <a href="https://6312d3-b1.myshopify.com/">
                <button>Revenir à la boutique</button>
            </a>
        </div>
    </body>
    </html>
`;
       return new Response(htmlContent, {
           status: 200,
           headers: {
               'Content-Type': 'text/html',
           },
       });

   }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopify Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #2c3e50;
            }
            p {
                font-size: 18px;
                margin: 10px 0;
            }
            a {
                text-decoration: none;
            }
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #2980b9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Greenleaze</h1>
            <p style="color:green;">Merci! Votre abonnement a bien été pris en compte </p>
        
            <a href="https://6312d3-b1.myshopify.com/">
                <button>Revenir à la boutique</button>
            </a>
        </div>
    </body>
    </html>
`;
    return new Response(htmlContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
        },
    });


}



export async function action({
                                 request,
                             }: ActionFunctionArgs) {
    console.log('-----hit proxy REDIRECT ACTION --- ')
    //const session = await getSession(request.headers.get('Cookie'));
    const {session, admin, storefront} = await authenticate.public.appProxy(request);

    const requestData = await request.json();
    const cartSecureKey = requestData.cartSecureKey;
    const firstName = requestData?.firstName ? requestData?.firstName: "not_set";
    const lastName = requestData?.lastName ? requestData?.lastName: "not_set";
    console.log(cartSecureKey);
    if (!cartSecureKey) {
        // Handle the case where the cart-secure-key is not provided
        throw new Response('Cart secure key is required', { status: 400 });
    }

    //const shopUrl = session.get('shopUrl');
    console.log(session);
    //console.log(admin.rest.params.config);
    try {
        const orderResponse = await admin.rest.get({
            path: `admin/api/2024-04/checkouts/${cartSecureKey}.json`,
        });




        const resOrder = await orderResponse.json();
        console.log('CHECKOUT get:', resOrder);

        const orderData = {
            "order": {
                "line_items": resOrder.checkout.line_items,
                "transactions":[{"kind":"sale","status":"success","amount": resOrder.checkout.total_price}],
                "total_tax": resOrder.checkout.total_tax,
                "currency": "EUR",
                "customer": {
                    "first_name": firstName,
                    "last_name": lastName,
                    // You can add more customer fields here if needed, like email, phone, etc.
                }
            }
        };
        console.log('try order');
        const createOrder = await admin.rest.post({
            path: `admin/api/2024-04/orders.json`,
            data: orderData,
        });

        const createOrderRes = await createOrder.json();
        console.log('ORDER get:', createOrderRes);

        return json({status: 200}); // redirec to sucess
    } catch (error) {
        console.error('Failed to create order:', error);
        return json({status: 200});
        return json({ error: 'Failed to create order' }, { status: 500, err: error, session: session });
    }

}

