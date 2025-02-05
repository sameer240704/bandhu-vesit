import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/en/sign-in",
  "/mr/sign-in",
  "/hi/sign-in",
  "/en/sign-up",
  "/mr/sign-up",
  "/hi/sign-up",
  "/en",
  "/hi",
  "/mr",
  "/api/webhooks/clerk",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// Internationalization

const headers = { "accept-language": "en-US,en;q=0.5" };
const languages = new Negotiator({ headers }).languages();
const locales = ["en-US", "hi", "mr"];
const defaultLocale = "en-US";

// Match the preferred language
match(languages, locales, defaultLocale);
