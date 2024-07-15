import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "../../prisma.server";
import {Form, useActionData, useNavigation, useSubmit,useLoaderData} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getSession, commitSession } from '~/session.server';


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  console.log('shop', shopId);
  if (!shopId) {
    return json({ error: "Shop ID is required" }, { status: 400 });
  }

  const shop = await prisma.shop.findUnique({
    where: { shopId },
  });

  if (!shop) {
    return json({ apiKeyGreenlease: "", deliveryFee: "", shop: shopId });
  }
  return json({ apiKeyGreenlease: shop.apiKeyGreenlease, deliveryFee: shop.deliveryFee,shop: shopId });
}

export const action = async ({ request }: ActionFunctionArgs) => {

  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  if (!shopId) {
    return json({ error: "Shop ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const apiKeyGreenlease = formData.get('apiKeyGreenlease');
  const deliveryFee = formData.get('deliveryFee');
  const accessToken = formData.get('accessToken');
  if (!apiKeyGreenlease || !deliveryFee) {
    return json({ error: 'API Key and Delivery Fee are required' }, { status: 400 });
  }

  // Save to database
  await prisma.shop.upsert({
    where: { shopId },
    update: { apiKeyGreenlease, deliveryFee, accessToken: accessToken },
    create: { shopId, apiKeyGreenlease, deliveryFee, accessToken: accessToken },
  });

  return json({ success: 'Clé API et frais de livraison sauvegardés !' });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const { apiKeyGreenlease, deliveryFee, shop, accessToken } = useLoaderData();


  return (
    <Page>

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h1" variant="headingMd">
                  Bienvenue dans votre app Greenlease 🎉
                  </Text>

                </BlockStack>
                <BlockStack gap="200">
                  <h2 style={{fontSize:20, fontWeight:  'bold', paddingBottom : 30}}>Configuration</h2>
                  {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
                  {actionData?.success && <p style={{ color: 'green' }}>{actionData.success}</p>}
                  <Form method="post" action={`?shop=${shop}`}>
                    <input
                        type="hidden"
                        name="shop"
                        value={shop}  // Pass the shopId as a hidden field
                    />
                    <input
                        type="text"
                        name="apiKeyGreenlease"
                        id="apiKeyGreenlease"
                        placeholder="Enter votre clé API"
                        required
                        style={{"padding": 5}}
                        defaultValue={apiKeyGreenlease}  // Set the value from the loader data
                    />

                    <div style={{"paddingTop": 20,paddingBottom: 20}}>
                      <input
                          type="text"
                          style={{"padding": 5}}
                          name="deliveryFee"
                          id="deliveryFee"
                          placeholder="Enter votre frais de livraison"
                          required
                          defaultValue={deliveryFee}
                      />
                    </div>
                    <input type="hidden" name="accessToken" value={accessToken} />

                    <button type="submit" style={{padding: 10, background: '#0D5537', color : 'white', borderRadius: 20}}>Enregistrer vos informations</button>
                  </Form>
                </BlockStack>

              </BlockStack>
            </Card>
          </Layout.Section>

        </Layout>
      </BlockStack>
    </Page>
  );
}
