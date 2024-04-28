import {getSession} from "~/session.server";
import {ActionFunctionArgs, json} from "@remix-run/node";

const generateUniq = (prefix: string = '') => {
    const time = Date.now().toString(36); // Convert timestamp to base-36
    const random = Math.random().toString(36).substr(2, 9); // Generate a random string
    return prefix + time + random;
}
export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    //    const apiKey = session.get('apiKey') || "";

}

export async function action({
                                 request,
                             }: ActionFunctionArgs) {

    try {
        const data = await request.json();
        console.log('json parse', data)
        const uniq = generateUniq();
        const response = await fetch('https://pay.greenleaze.com/order/step-1?transaction_id='+ uniq, {
            method: 'POST', // Set the method to POST
            headers: {
                'x-api-key': '7ea199ed-9953-45ea-896c-da04d6d6bfb8',
                'Content-Type': 'application/json' // Set the Content-Type to application/json
            },
            body: JSON.stringify(data)
        });
        //const data = await response.json();

        return json({'status' : 'ok','uniq':uniq }); // Assuming you have a function named json() that handles the response.
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return json({ error: error.message }); // Properly handle and return the error case.
    }

}
