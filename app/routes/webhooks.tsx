import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {prisma} from "../../prisma.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    case "CARTS_UPDATE":
      console.log("Cart Updated!", shop);
      const { admin } = await authenticate.admin(request);
      console.log("Cart Updated!", admin);
      if(admin){
        try {
          await prisma.shop.upsert({
            where: { shop },
            update: { accessToken: admin.rest?.session?.accessToken },
          });
        }
        catch(e){

        }
      }

      break;

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
