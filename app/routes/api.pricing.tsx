import {getSession} from "~/session.server";
import {json} from "@remix-run/node";

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    //    const apiKey = session.get('apiKey') || "";
    try {
        const response = await fetch('https://api.greenleaze.com/api/price_rules', {
            headers: {
                'x-api-key': '7ea199ed-9953-45ea-896c-da04d6d6bfb8'
            }
        });
        const data = await response.json();
        console.log(data); // This line is optional and just for debugging purposes.
        return json(data); // Assuming you have a function named json() that handles the response.
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return json({ error: error.message }); // Properly handle and return the error case.
    }
}
