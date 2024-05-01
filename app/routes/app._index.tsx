import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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

export async function loader({ request }) {
  const session = await getSession(request.headers.get('Cookie'));
  console.log("Session data:", session.data); // Check what's in the session

  const apiKey = session.get('apiKey') || "";
  return json({ apiKey });
}

export const action = async ({ request }: ActionFunctionArgs) => {

  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const apiKey = formData.get('apiKey');

  if (!apiKey) {
    session.flash('message', 'API Key is required');
    return json({}, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
      status: 400
    });
  }

  const commit = await commitSession(session);
  console.log(commit);
  console.log('APIKEY', apiKey);
  session.flash('message', 'Clé API sauvegardée !');
  session.set('apiKey', apiKey);  // Save API key to session

  return json({ success: 'Clé API sauvegardée !' }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    }
  });

};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const { apiKey } = useLoaderData();

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
                  <Form method="post">
                    <input
                        type="text"
                        name="apiKey"
                        id="apiKey"
                        placeholder="Enter votre clé API"
                        required
                        style={{"padding": 5}}
                        defaultValue={apiKey}  // Set the value from the loader data
                    />

                    <div style={{"paddingTop": 20,paddingBottom: 20}}>
                      <input
                          type="text"
                          style={{"padding": 5}}
                          name="deliveryFee"
                          id="deliveryFee"
                          placeholder="Enter votre frais de livraison"
                          required
                      />
                    </div>

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
