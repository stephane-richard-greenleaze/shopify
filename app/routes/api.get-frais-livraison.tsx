import {ActionFunctionArgs, json, LoaderFunction} from "@remix-run/node";
import prisma from "~/db.server"; // Adjust the path to your Prisma instance

export async function action({
                                 request,
                             }: ActionFunctionArgs) {
    const data = await request.json();
    const shopId = data.shop;

    if (!shopId) {
        return json({ error: "Missing shopId parameter" }, { status: 400 });
    }

    try {
        const settings = await prisma.shop.findFirst({
            where: {
                key: "deliveryFee",
                shopId: shopId
            },
        });

        return json({ deliveryFee: settings ? parseFloat(settings.value) : 0 });
    } catch (error) {
        console.log(error);
        return json({ error: "Failed to retrieve frais livraison" }, { status: 500 });
    }
}
