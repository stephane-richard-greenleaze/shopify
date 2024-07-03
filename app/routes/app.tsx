import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import {ActionFunctionArgs, json} from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";
import {prisma} from "../../prisma.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
    console.log(process.env.SHOPIFY_API_SECRET);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('hit app', request);
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  console.log('shop', shopId);
  if (!shopId) {
    return json({ error: "cannot save Shop ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const apiKey = formData.get('apiKey');
  const deliveryFee = formData.get('deliveryFee');

  if (!apiKey || !deliveryFee) {
    return json({ error: 'API Key and Delivery Fee are required' }, { status: 400 });
  }

  // Save to database
  await prisma.shop.upsert({
    where: { shopId },
    update: { apiKey, deliveryFee },
    create: { shopId, apiKey, deliveryFee },
  });

  return json({ success: 'Clé API et frais de livraison sauvegardés !' });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
