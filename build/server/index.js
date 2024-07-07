var _a;
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useNavigation, useActionData, useSubmit, useLoaderData, Form, Link as Link$1, useRouteError } from "@remix-run/react";
import { createReadableStreamFromReadable, json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, ApiVersion, AppDistribution, DeliveryMethod, LoginErrorType, boundary } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { Page, Layout, Card, BlockStack, Text, Link, List, Box, AppProvider, FormLayout, TextField, Button } from "@shopify/polaris";
import { useState } from "react";
import { AppProvider as AppProvider$1 } from "@shopify/shopify-app-remix/react";
const prisma$1 = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.April24,
  scopes: (_a = process.env.SCOPES) == null ? void 0 : _a.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma$1),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks"
    }
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    }
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    v3_lineItemBilling: true,
    unstable_newEmbeddedAuthStrategy: true
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
ApiVersion.April24;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function App$2() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://cdn.shopify.com/" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$2
}, Symbol.toStringTag, { value: "Module" }));
const action$7 = async ({
  request
}) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();
  const signature = request.headers.get(
    "X-Hub-Signature-256"
  );
  const generatedSignature = `sha256=${crypto.createHmac("sha256", process.env.SHOPIFY_API_SECRET).update(JSON.stringify(payload)).digest("hex")}`;
  if (signature !== generatedSignature) {
    return json({ message: "Signature mismatch" }, 401);
  }
  return json({ success: true }, 200);
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({
  request
}) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();
  const signature = request.headers.get(
    "X-Hub-Signature-256"
  );
  const generatedSignature = `sha256=${crypto.createHmac("sha256", process.env.SHOPIFY_API_SECRET).update(JSON.stringify(payload)).digest("hex")}`;
  if (signature !== generatedSignature) {
    return json({ message: "Signature mismatch" }, 401);
  }
  return json({ success: true }, 200);
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const action$5 = async ({
  request
}) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const payload = await request.json();
  const signature = request.headers.get(
    "X-Hub-Signature-256"
  );
  const generatedSignature = `sha256=${crypto.createHmac("sha256", process.env.SHOPIFY_API_SECRET).update(JSON.stringify(payload)).digest("hex")}`;
  if (signature !== generatedSignature) {
    return json({ message: "Signature mismatch" }, 401);
  }
  return json({ success: true }, 200);
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
function AdditionalPage() {
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx("ui-title-bar", { title: "Additional page" }),
    /* @__PURE__ */ jsxs(Layout, { children: [
      /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              url: "https://shopify.dev/docs/apps/tools/app-bridge",
              target: "_blank",
              removeUnderline: true,
              children: "App Bridge"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "To create your own page and have it show up in the app navigation, add a page inside ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes" }),
          ", and a link to it in the ",
          /* @__PURE__ */ jsx(Code, { children: "<ui-nav-menu>" }),
          " component found in ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes/app.jsx" }),
          "."
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Resources" }),
        /* @__PURE__ */ jsx(List, { children: /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
          Link,
          {
            url: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            removeUnderline: true,
            children: "App nav best practices"
          }
        ) }) })
      ] }) }) })
    ] })
  ] });
}
function Code({ children }) {
  return /* @__PURE__ */ jsx(
    Box,
    {
      as: "span",
      padding: "025",
      paddingInlineStart: "100",
      paddingInlineEnd: "100",
      background: "bg-surface-active",
      borderWidth: "025",
      borderColor: "border",
      borderRadius: "100",
      children: /* @__PURE__ */ jsx("code", { children })
    }
  );
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdditionalPage
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({ request }) {
  console.log("-----hit proxy REDIRECT --- ");
  const { session, admin, storefront } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const cartSecureKey = url.searchParams.get("cart-secure-key");
  console.log(cartSecureKey);
  if (!cartSecureKey) {
    throw new Response("Cart secure key is required", { status: 400 });
  }
  console.log(session);
  try {
    const orderResponse = await admin.rest.post({
      path: `admin/api/2024-04/checkouts/${cartSecureKey}/complete.json`,
      data: {}
    });
    console.log("Order created:", orderResponse);
    return json({ status: 200 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return json({ error: "Failed to create order" }, { status: 500, err: error, session });
  }
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "session_greenlease",
    secrets: [process.env.SESSION_SECRET || "fallbackSecret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: false
  }
});
async function loader$5({ request }) {
  await getSession(request.headers.get("Cookie"));
  try {
    const response = await fetch("https://api.greenleaze.com/api/price_rules", {
      headers: {
        "x-api-key": "7ea199ed-9953-45ea-896c-da04d6d6bfb8"
      }
    });
    const data = await response.json();
    console.log(data);
    return json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return json({ error: error.message });
  }
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
async function loader$4({ request }) {
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  console.log("shop", shopId);
  if (!shopId) {
    return json({ error: "Shop ID is required" }, { status: 400 });
  }
  const shop = await prisma.shop.findUnique({
    where: { shopId }
  });
  if (!shop) {
    return json({ apiKeyGreenlease: "", deliveryFee: "", shop: shopId });
  }
  return json({ apiKeyGreenlease: shop.apiKeyGreenlease, deliveryFee: shop.deliveryFee, shop: shopId });
}
const action$4 = async ({ request }) => {
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  if (!shopId) {
    return json({ error: "Shop ID is required" }, { status: 400 });
  }
  const formData = await request.formData();
  const apiKeyGreenlease = formData.get("apiKeyGreenlease");
  const deliveryFee = formData.get("deliveryFee");
  if (!apiKeyGreenlease || !deliveryFee) {
    return json({ error: "API Key and Delivery Fee are required" }, { status: 400 });
  }
  await prisma.shop.upsert({
    where: { shopId },
    update: { apiKeyGreenlease, deliveryFee },
    create: { shopId, apiKeyGreenlease, deliveryFee }
  });
  return json({ success: "Clé API et frais de livraison sauvegardés !" });
};
function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  useSubmit();
  ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const { apiKeyGreenlease, deliveryFee, shop } = useLoaderData();
  return /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(BlockStack, { gap: "500", children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
    /* @__PURE__ */ jsx(BlockStack, { gap: "200", children: /* @__PURE__ */ jsx(Text, { as: "h1", variant: "headingMd", children: "Bienvenue dans votre app Greenlease 🎉" }) }),
    /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: 20, fontWeight: "bold", paddingBottom: 30 }, children: "Configuration" }),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: actionData.error }),
      (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", { style: { color: "green" }, children: actionData.success }),
      /* @__PURE__ */ jsxs(Form, { method: "post", action: `?shop=${shop}`, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "shop",
            value: shop
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "apiKeyGreenlease",
            id: "apiKeyGreenlease",
            placeholder: "Enter votre clé API",
            required: true,
            style: { "padding": 5 },
            defaultValue: apiKeyGreenlease
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { "paddingTop": 20, paddingBottom: 20 }, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            style: { "padding": 5 },
            name: "deliveryFee",
            id: "deliveryFee",
            placeholder: "Enter votre frais de livraison",
            required: true,
            defaultValue: deliveryFee
          }
        ) }),
        /* @__PURE__ */ jsx("button", { type: "submit", style: { padding: 10, background: "#0D5537", color: "white", borderRadius: 20 }, children: "Enregistrer vos informations" })
      ] })
    ] })
  ] }) }) }) }) }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: Index,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = {
  ActionMenu: {
    Actions: {
      moreActions: "More actions"
    },
    RollupActions: {
      rollupButton: "View actions"
    }
  },
  ActionList: {
    SearchField: {
      clearButtonLabel: "Clear",
      search: "Search",
      placeholder: "Search actions"
    }
  },
  Avatar: {
    label: "Avatar",
    labelWithInitials: "Avatar with initials {initials}"
  },
  Autocomplete: {
    spinnerAccessibilityLabel: "Loading",
    ellipsis: "{content}…"
  },
  Badge: {
    PROGRESS_LABELS: {
      incomplete: "Incomplete",
      partiallyComplete: "Partially complete",
      complete: "Complete"
    },
    TONE_LABELS: {
      info: "Info",
      success: "Success",
      warning: "Warning",
      critical: "Critical",
      attention: "Attention",
      "new": "New",
      readOnly: "Read-only",
      enabled: "Enabled"
    },
    progressAndTone: "{toneLabel} {progressLabel}"
  },
  Banner: {
    dismissButton: "Dismiss notification"
  },
  Button: {
    spinnerAccessibilityLabel: "Loading"
  },
  Common: {
    checkbox: "checkbox",
    undo: "Undo",
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    submit: "Submit",
    more: "More"
  },
  ContextualSaveBar: {
    save: "Save",
    discard: "Discard"
  },
  DataTable: {
    sortAccessibilityLabel: "sort {direction} by",
    navAccessibilityLabel: "Scroll table {direction} one column",
    totalsRowHeading: "Totals",
    totalRowHeading: "Total"
  },
  DatePicker: {
    previousMonth: "Show previous month, {previousMonthName} {showPreviousYear}",
    nextMonth: "Show next month, {nextMonth} {nextYear}",
    today: "Today ",
    start: "Start of range",
    end: "End of range",
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    },
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    },
    daysAbbreviated: {
      monday: "Mo",
      tuesday: "Tu",
      wednesday: "We",
      thursday: "Th",
      friday: "Fr",
      saturday: "Sa",
      sunday: "Su"
    }
  },
  DiscardConfirmationModal: {
    title: "Discard all unsaved changes",
    message: "If you discard changes, you’ll delete any edits you made since you last saved.",
    primaryAction: "Discard changes",
    secondaryAction: "Continue editing"
  },
  DropZone: {
    single: {
      overlayTextFile: "Drop file to upload",
      overlayTextImage: "Drop image to upload",
      overlayTextVideo: "Drop video to upload",
      actionTitleFile: "Add file",
      actionTitleImage: "Add image",
      actionTitleVideo: "Add video",
      actionHintFile: "or drop file to upload",
      actionHintImage: "or drop image to upload",
      actionHintVideo: "or drop video to upload",
      labelFile: "Upload file",
      labelImage: "Upload image",
      labelVideo: "Upload video"
    },
    allowMultiple: {
      overlayTextFile: "Drop files to upload",
      overlayTextImage: "Drop images to upload",
      overlayTextVideo: "Drop videos to upload",
      actionTitleFile: "Add files",
      actionTitleImage: "Add images",
      actionTitleVideo: "Add videos",
      actionHintFile: "or drop files to upload",
      actionHintImage: "or drop images to upload",
      actionHintVideo: "or drop videos to upload",
      labelFile: "Upload files",
      labelImage: "Upload images",
      labelVideo: "Upload videos"
    },
    errorOverlayTextFile: "File type is not valid",
    errorOverlayTextImage: "Image type is not valid",
    errorOverlayTextVideo: "Video type is not valid"
  },
  EmptySearchResult: {
    altText: "Empty search results"
  },
  Frame: {
    skipToContent: "Skip to content",
    navigationLabel: "Navigation",
    Navigation: {
      closeMobileNavigationLabel: "Close navigation"
    }
  },
  FullscreenBar: {
    back: "Back",
    accessibilityLabel: "Exit fullscreen mode"
  },
  Filters: {
    moreFilters: "More filters",
    moreFiltersWithCount: "More filters ({count})",
    filter: "Filter {resourceName}",
    noFiltersApplied: "No filters applied",
    cancel: "Cancel",
    done: "Done",
    clearAllFilters: "Clear all filters",
    clear: "Clear",
    clearLabel: "Clear {filterName}",
    addFilter: "Add filter",
    clearFilters: "Clear all",
    searchInView: "in:{viewName}"
  },
  FilterPill: {
    clear: "Clear",
    unsavedChanges: "Unsaved changes - {label}"
  },
  IndexFilters: {
    searchFilterTooltip: "Search and filter",
    searchFilterTooltipWithShortcut: "Search and filter (F)",
    searchFilterAccessibilityLabel: "Search and filter results",
    sort: "Sort your results",
    addView: "Add a new view",
    newView: "Custom search",
    SortButton: {
      ariaLabel: "Sort the results",
      tooltip: "Sort",
      title: "Sort by",
      sorting: {
        asc: "Ascending",
        desc: "Descending",
        az: "A-Z",
        za: "Z-A"
      }
    },
    EditColumnsButton: {
      tooltip: "Edit columns",
      accessibilityLabel: "Customize table column order and visibility"
    },
    UpdateButtons: {
      cancel: "Cancel",
      update: "Update",
      save: "Save",
      saveAs: "Save as",
      modal: {
        title: "Save view as",
        label: "Name",
        sameName: "A view with this name already exists. Please choose a different name.",
        save: "Save",
        cancel: "Cancel"
      }
    }
  },
  IndexProvider: {
    defaultItemSingular: "Item",
    defaultItemPlural: "Items",
    allItemsSelected: "All {itemsLength}+ {resourceNamePlural} are selected",
    selected: "{selectedItemsCount} selected",
    a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
    a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
    a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
    a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}"
  },
  IndexTable: {
    emptySearchTitle: "No {resourceNamePlural} found",
    emptySearchDescription: "Try changing the filters or search term",
    onboardingBadgeText: "New",
    resourceLoadingAccessibilityLabel: "Loading {resourceNamePlural}…",
    selectAllLabel: "Select all {resourceNamePlural}",
    selected: "{selectedItemsCount} selected",
    undo: "Undo",
    selectAllItems: "Select all {itemsLength}+ {resourceNamePlural}",
    selectItem: "Select {resourceName}",
    selectButtonText: "Select",
    sortAccessibilityLabel: "sort {direction} by"
  },
  Loading: {
    label: "Page loading bar"
  },
  Modal: {
    iFrameTitle: "body markup",
    modalWarning: "These required properties are missing from Modal: {missingProps}"
  },
  Page: {
    Header: {
      rollupActionsLabel: "View actions for {title}",
      pageReadyAccessibilityLabel: "{title}. This page is ready"
    }
  },
  Pagination: {
    previous: "Previous",
    next: "Next",
    pagination: "Pagination"
  },
  ProgressBar: {
    negativeWarningMessage: "Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.",
    exceedWarningMessage: "Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."
  },
  ResourceList: {
    sortingLabel: "Sort by",
    defaultItemSingular: "item",
    defaultItemPlural: "items",
    showing: "Showing {itemsCount} {resource}",
    showingTotalCount: "Showing {itemsCount} of {totalItemsCount} {resource}",
    loading: "Loading {resource}",
    selected: "{selectedItemsCount} selected",
    allItemsSelected: "All {itemsLength}+ {resourceNamePlural} in your store are selected",
    allFilteredItemsSelected: "All {itemsLength}+ {resourceNamePlural} in this filter are selected",
    selectAllItems: "Select all {itemsLength}+ {resourceNamePlural} in your store",
    selectAllFilteredItems: "Select all {itemsLength}+ {resourceNamePlural} in this filter",
    emptySearchResultTitle: "No {resourceNamePlural} found",
    emptySearchResultDescription: "Try changing the filters or search term",
    selectButtonText: "Select",
    a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
    a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
    a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
    a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}",
    Item: {
      actionsDropdownLabel: "Actions for {accessibilityLabel}",
      actionsDropdown: "Actions dropdown",
      viewItem: "View details for {itemName}"
    },
    BulkActions: {
      actionsActivatorLabel: "Actions",
      moreActionsActivatorLabel: "More actions"
    }
  },
  SkeletonPage: {
    loadingLabel: "Page loading"
  },
  Tabs: {
    newViewAccessibilityLabel: "Create new view",
    newViewTooltip: "Create view",
    toggleTabsLabel: "More views",
    Tab: {
      rename: "Rename view",
      duplicate: "Duplicate view",
      edit: "Edit view",
      editColumns: "Edit columns",
      "delete": "Delete view",
      copy: "Copy of {name}",
      deleteModal: {
        title: "Delete view?",
        description: "This can’t be undone. {viewName} view will no longer be available in your admin.",
        cancel: "Cancel",
        "delete": "Delete view"
      }
    },
    RenameModal: {
      title: "Rename view",
      label: "Name",
      cancel: "Cancel",
      create: "Save",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    },
    DuplicateModal: {
      title: "Duplicate view",
      label: "Name",
      cancel: "Cancel",
      create: "Create view",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    },
    CreateViewModal: {
      title: "Create new view",
      label: "Name",
      cancel: "Cancel",
      create: "Create view",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    }
  },
  Tag: {
    ariaLabel: "Remove {children}"
  },
  TextField: {
    characterCount: "{count} characters",
    characterCountWithMaxLength: "{count} of {limit} characters used"
  },
  TooltipOverlay: {
    accessibilityLabel: "Tooltip: {label}"
  },
  TopBar: {
    toggleMenuLabel: "Toggle menu",
    SearchField: {
      clearButtonLabel: "Clear",
      search: "Search"
    }
  },
  MediaCard: {
    dismissButton: "Dismiss",
    popoverButton: "Actions"
  },
  VideoThumbnail: {
    playButtonA11yLabel: {
      "default": "Play video",
      defaultWithDuration: "Play video of length {duration}",
      duration: {
        hours: {
          other: {
            only: "{hourCount} hours",
            andMinutes: "{hourCount} hours and {minuteCount} minutes",
            andMinute: "{hourCount} hours and {minuteCount} minute",
            minutesAndSeconds: "{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds",
            minutesAndSecond: "{hourCount} hours, {minuteCount} minutes, and {secondCount} second",
            minuteAndSeconds: "{hourCount} hours, {minuteCount} minute, and {secondCount} seconds",
            minuteAndSecond: "{hourCount} hours, {minuteCount} minute, and {secondCount} second",
            andSeconds: "{hourCount} hours and {secondCount} seconds",
            andSecond: "{hourCount} hours and {secondCount} second"
          },
          one: {
            only: "{hourCount} hour",
            andMinutes: "{hourCount} hour and {minuteCount} minutes",
            andMinute: "{hourCount} hour and {minuteCount} minute",
            minutesAndSeconds: "{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds",
            minutesAndSecond: "{hourCount} hour, {minuteCount} minutes, and {secondCount} second",
            minuteAndSeconds: "{hourCount} hour, {minuteCount} minute, and {secondCount} seconds",
            minuteAndSecond: "{hourCount} hour, {minuteCount} minute, and {secondCount} second",
            andSeconds: "{hourCount} hour and {secondCount} seconds",
            andSecond: "{hourCount} hour and {secondCount} second"
          }
        },
        minutes: {
          other: {
            only: "{minuteCount} minutes",
            andSeconds: "{minuteCount} minutes and {secondCount} seconds",
            andSecond: "{minuteCount} minutes and {secondCount} second"
          },
          one: {
            only: "{minuteCount} minute",
            andSeconds: "{minuteCount} minute and {secondCount} seconds",
            andSecond: "{minuteCount} minute and {secondCount} second"
          }
        },
        seconds: {
          other: "{secondCount} seconds",
          one: "{secondCount} second"
        }
      }
    }
  }
};
const polarisTranslations = {
  Polaris
};
const polarisStyles = "/assets/styles-DT9i95_b.css";
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const links$1 = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$3 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return json({ errors, polarisTranslations });
};
const action$3 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return json({
    errors
  });
};
function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider, { i18n: loaderData.polarisTranslations, children: /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs(FormLayout, { children: [
    /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Log in" }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        type: "text",
        name: "shop",
        label: "Shop domain",
        helpText: "example.myshopify.com",
        value: shop,
        onChange: setShop,
        autoComplete: "on",
        error: errors.shop
      }
    ),
    /* @__PURE__ */ jsx(Button, { submit: true, children: "Log in" })
  ] }) }) }) }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: Auth,
  links: links$1,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const generateUniq = (prefix = "") => {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix + time + random;
};
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function formatNumberAsFloat(num) {
  return parseFloat(num.toFixed(2));
}
async function action$2({
  request
}) {
  console.log("---hit proxy---");
  const data = await request.json();
  console.log("data", data);
  const { session, admin, storefront } = await authenticate.public.appProxy(request);
  console.log("Session", session);
  const shop = session ? session.shop : "6312d3-b1.myshopify.com";
  console.log("-----try retrieve cart---", JSON.parse(data.cartContents));
  const cartContents = JSON.parse(data.cartContents);
  var base_url = `https://${shop}/apps/greenlease-proxy/api/redirect`;
  console.log("base_url", base_url);
  try {
    const lineItems = cartContents.items.map((item) => ({
      variant_id: item.variant_id,
      quantity: item.quantity
    }));
    const orderData = {
      "checkout": {
        "line_items": lineItems
      }
    };
    console.log("orderData", orderData);
    const orderResponse = await admin.rest.post({
      path: "admin/api/2024-04/checkouts.json",
      data: orderData
    });
    const res = await orderResponse.json();
    console.log("response order", res.data);
    const token_checkout = res.checkout.token;
    const uniq = generateUniq();
    const price = cartContents.items[0].line_price / 100;
    var formattedPrice = formatNumberAsFloat(price);
    const payload = {
      "transactionId": `trans_${uniq}`,
      "shop": {
        "urls": {
          "shop": `${shop}`,
          //session.shop,
          "success": base_url + "?success=true",
          "failure": base_url + "?success=false"
        },
        "language": "fr"
      },
      "customer": {},
      "products": [
        {
          "name": cartContents.items[0].title,
          "unitPrice": price,
          "vat": 20,
          "quantity": 1,
          "combination": {
            "name": cartContents.items[0].title
          },
          "imageUrl": cartContents.items[0].image
        }
      ],
      "cartId": getRandomArbitrary(1, 99999),
      // peux pas string
      "cartSecureKey": token_checkout,
      "totalInitialFees": 20
      // todo : take from param app
    };
    console.log(payload);
    const responseTransac = await fetch("https://pay.greenleaze.com/send-shop-order-data", {
      method: "POST",
      // Set the method to POST
      headers: {
        "x-api-key": "8660c63a-5c89-469c-a03c-2399ce5d9c18",
        "Content-Type": "application/json"
        // Set the Content-Type to application/json
      },
      body: JSON.stringify(payload)
    });
    console.log("response is OK?", responseTransac.status);
    return json({ "status": "ok", "uniq": uniq, "redirectUrl": "https://pay.greenleaze.com/order/step-1?transaction_id=trans_" + uniq });
  } catch (error) {
    console.error("Failed to send:", error);
    return json({ error: error.message });
  }
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  const { topic, shop, session, admin } = await authenticate.webhook(request);
  if (!admin) {
    throw new Response();
  }
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await prisma$1.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }
  throw new Response();
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_12o3y_1";
const heading = "_heading_12o3y_11";
const text = "_text_12o3y_12";
const content = "_content_12o3y_22";
const form = "_form_12o3y_27";
const label = "_label_12o3y_35";
const input = "_input_12o3y_43";
const button = "_button_12o3y_47";
const list = "_list_12o3y_51";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$2 = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return json({ showForm: Boolean(login) });
};
function App$1() {
  const { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: styles.index, children: /* @__PURE__ */ jsxs("div", { className: styles.content, children: [
    /* @__PURE__ */ jsx("h1", { className: styles.heading, children: "A short heading about [your app]" }),
    /* @__PURE__ */ jsx("p", { className: styles.text, children: "A tagline about [your app] that describes your value proposition." }),
    showForm && /* @__PURE__ */ jsxs(Form, { className: styles.form, method: "post", action: "/auth/login", children: [
      /* @__PURE__ */ jsxs("label", { className: styles.label, children: [
        /* @__PURE__ */ jsx("span", { children: "Shop domain" }),
        /* @__PURE__ */ jsx("input", { className: styles.input, type: "text", name: "shop" }),
        /* @__PURE__ */ jsx("span", { children: "e.g: my-shop-domain.myshopify.com" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles.button, type: "submit", children: "Log in" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles.list, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] })
    ] })
  ] }) });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{ rel: "stylesheet", href: polarisStyles }];
async function loader({ request }) {
  console.log("LOADER APP -----");
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  console.log("shop", shopId);
  if (!shopId) {
    return json({ error: "Shop ID is required" }, { status: 400 });
  }
  const shop = await prisma.shop.findUnique({
    where: { shopId }
  });
  if (!shop) {
    return json({ apiKeyGreenlease: "", deliveryFee: "", shopId });
  }
  return json({ apiKeyGreenlease: shop.apiKeyGreenlease, deliveryFee: shop.deliveryFee, shop: shopId });
}
const action = async ({ request }) => {
  console.log("hit app", request);
  const url = new URL(request.url);
  const shopId = url.searchParams.get("shop");
  console.log("shop", shopId);
  if (!shopId) {
    return json({ error: "cannot save Shop ID is required" }, { status: 400 });
  }
  const formData = await request.formData();
  const apiKeyGreenlease = formData.get("apiKeyGreenlease");
  const deliveryFee = formData.get("deliveryFee");
  if (!apiKeyGreenlease || !deliveryFee) {
    return json({ error: "API Key and Delivery Fee are required" }, { status: 400 });
  }
  await prisma.shop.upsert({
    where: { shopId },
    update: { apiKeyGreenlease, deliveryFee },
    create: { shopId, apiKeyGreenlease, deliveryFee }
  });
  return json({ success: "Clé API et frais de livraison sauvegardés !" });
};
function App() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsxs(AppProvider$1, { isEmbeddedApp: true, apiKey, children: [
    /* @__PURE__ */ jsxs("ui-nav-menu", { children: [
      /* @__PURE__ */ jsx(Link$1, { to: "/app", rel: "home", children: "Home" }),
      /* @__PURE__ */ jsx(Link$1, { to: "/app/additional", children: "Additional page" })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function ErrorBoundary() {
  return boundary.error(useRouteError());
}
const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  action,
  default: App,
  headers,
  links,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CULEBvcp.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/components-B1afT1Y1.js", "/assets/browser-Box22kee.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-C6QprbzY.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/components-B1afT1Y1.js", "/assets/browser-Box22kee.js", "/assets/scroll-restoration-bAUtMBxn.js"], "css": [] }, "routes/webhook.dataShopErase": { "id": "routes/webhook.dataShopErase", "parentId": "root", "path": "webhook/dataShopErase", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhook.dataShopErase-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhook.dataRequest": { "id": "routes/webhook.dataRequest", "parentId": "root", "path": "webhook/dataRequest", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhook.dataRequest-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhook.dataErase": { "id": "routes/webhook.dataErase", "parentId": "root", "path": "webhook/dataErase", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhook.dataErase-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-DaGku5DA.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/Page-BXg2R-om.js", "/assets/Layout-CYn5_LOs.js", "/assets/List-DMgMadGi.js"], "css": [] }, "routes/api.redirect": { "id": "routes/api.redirect", "parentId": "root", "path": "api/redirect", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.redirect-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.pricing": { "id": "routes/api.pricing", "parentId": "root", "path": "api/pricing", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.pricing-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-CemLsbnp.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/Page-BXg2R-om.js", "/assets/components-B1afT1Y1.js", "/assets/Layout-CYn5_LOs.js"], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-rV1J9njJ.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/Page-BXg2R-om.js", "/assets/styles-Di6RmNJN.js", "/assets/components-B1afT1Y1.js"], "css": [] }, "routes/api.send": { "id": "routes/api.send", "parentId": "root", "path": "api/send", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.send-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks": { "id": "routes/webhooks", "parentId": "root", "path": "webhooks", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BbCOzWEc.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/components-B1afT1Y1.js"], "css": ["/assets/route-COVlfczw.css"] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/app-qc2hmeiO.js", "imports": ["/assets/index-D0piyJ7G.js", "/assets/Page-BXg2R-om.js", "/assets/components-B1afT1Y1.js", "/assets/styles-Di6RmNJN.js", "/assets/List-DMgMadGi.js", "/assets/Layout-CYn5_LOs.js", "/assets/browser-Box22kee.js", "/assets/scroll-restoration-bAUtMBxn.js"], "css": [] } }, "url": "/assets/manifest-a4b978c8.js", "version": "a4b978c8" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhook.dataShopErase": {
    id: "routes/webhook.dataShopErase",
    parentId: "root",
    path: "webhook/dataShopErase",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhook.dataRequest": {
    id: "routes/webhook.dataRequest",
    parentId: "root",
    path: "webhook/dataRequest",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/webhook.dataErase": {
    id: "routes/webhook.dataErase",
    parentId: "root",
    path: "webhook/dataErase",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.redirect": {
    id: "routes/api.redirect",
    parentId: "root",
    path: "api/redirect",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.pricing": {
    id: "routes/api.pricing",
    parentId: "root",
    path: "api/pricing",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route7
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/api.send": {
    id: "routes/api.send",
    parentId: "root",
    path: "api/send",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/webhooks": {
    id: "routes/webhooks",
    parentId: "root",
    path: "webhooks",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route11
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
