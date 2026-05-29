/**
 * File: scripts/verify-live-host-redirects.mjs
 * Module: scripts
 * Purpose: Detect live host redirect loops and canonical-host drift.
 * Notes:
 * - This check is opt-in to keep CI deterministic in offline/private environments.
 * - Enable by setting SEO_VERIFY_LIVE_REDIRECTS=true.
 */

const DEFAULT_CANONICAL_ORIGIN = "https://www.gajananmaharajsanstan.com";
const APP_DOMAIN_APEX = "gajananmaharajsanstan.com";
const ENABLED_ENV_VALUES = new Set(["1", "true", "yes", "on"]);
const MAX_REDIRECT_HOPS = 8;
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Emit structured logs for easy post-deploy diagnostics.
 */
function log(
  level,
  message,
  data = {}
) {
  const payload = {
    timestamp: Date.now(),
    message,
    data,
  };
  const serializedPayload = JSON.stringify(payload);

  if (level === "error") {
    console.error("live-redirect-verify-error", serializedPayload);
    return;
  }

  if (level === "warn") {
    console.warn("live-redirect-verify-warning", serializedPayload);
    return;
  }

  console.info("live-redirect-verify-info", serializedPayload);
}

function isEnabled(value) {
  if (!value) {
    return false;
  }

  return ENABLED_ENV_VALUES.has(value.trim().toLowerCase());
}

function normalizeCanonicalHost(hostname) {
  if (hostname === APP_DOMAIN_APEX) {
    return `www.${APP_DOMAIN_APEX}`;
  }

  return hostname;
}

function resolveCanonicalOrigin() {
  const candidate =
    process.env.SEO_LIVE_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_CANONICAL_ORIGIN;

  const withProtocol =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  try {
    const parsed = new URL(withProtocol);
    parsed.hostname = normalizeCanonicalHost(parsed.hostname);
    parsed.pathname = "/";
    parsed.search = "";
    parsed.hash = "";
    return parsed.origin;
  } catch {
    log("warn", "Invalid canonical origin candidate. Falling back to default.", {
      candidate,
      fallback: DEFAULT_CANONICAL_ORIGIN,
    });
    return DEFAULT_CANONICAL_ORIGIN;
  }
}

function getAlternateOrigin(canonicalOrigin) {
  const parsed = new URL(canonicalOrigin);
  const canonicalHost = parsed.hostname;

  if (canonicalHost.startsWith("www.")) {
    parsed.hostname = canonicalHost.replace(/^www\./, "");
    return parsed.origin;
  }

  parsed.hostname = `www.${canonicalHost}`;
  return parsed.origin;
}

async function fetchManualRedirect(url) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: abortController.signal,
      headers: {
        "user-agent": "seo-live-redirect-verifier/1.0",
      },
    });

    return response;
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.name === "AbortError"
          ? `Request timed out after ${REQUEST_TIMEOUT_MS}ms`
          : error.message
        : String(error);
    throw new Error(reason);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function traceRedirects(startUrl) {
  const hops = [];
  const visited = new Set([startUrl]);
  let currentUrl = startUrl;

  for (let hopIndex = 0; hopIndex < MAX_REDIRECT_HOPS; hopIndex += 1) {
    const response = await fetchManualRedirect(currentUrl);
    const locationHeader = response.headers.get("location");
    const isRedirect =
      response.status >= 300 && response.status < 400 && Boolean(locationHeader);

    hops.push({
      from: currentUrl,
      status: response.status,
      location: locationHeader,
    });

    if (!isRedirect) {
      return {
        hops,
        finalUrl: currentUrl,
        loopDetected: false,
        loopAt: null,
      };
    }

    const resolvedLocation = new URL(locationHeader, currentUrl).toString();
    if (visited.has(resolvedLocation)) {
      return {
        hops,
        finalUrl: resolvedLocation,
        loopDetected: true,
        loopAt: resolvedLocation,
      };
    }

    visited.add(resolvedLocation);
    currentUrl = resolvedLocation;
  }

  return {
    hops,
    finalUrl: currentUrl,
    loopDetected: false,
    loopAt: null,
    maxHopLimitReached: true,
  };
}

function summarizeChain(chain) {
  return chain.hops.map((hop) => ({
    from: hop.from,
    status: hop.status,
    location: hop.location,
  }));
}

async function main() {
  const redirectCheckEnabled = isEnabled(process.env.SEO_VERIFY_LIVE_REDIRECTS);
  if (!redirectCheckEnabled) {
    log("info", "Live redirect verification skipped.", {
      reason:
        "Set SEO_VERIFY_LIVE_REDIRECTS=true to enable deployed host redirect checks.",
    });
    return;
  }

  const canonicalOrigin = resolveCanonicalOrigin();
  const alternateOrigin = getAlternateOrigin(canonicalOrigin);
  const failures = [];

  log("info", "Starting live redirect verification.", {
    canonicalOrigin,
    alternateOrigin,
    maxRedirectHops: MAX_REDIRECT_HOPS,
  });

  let canonicalChain;
  let alternateChain;

  try {
    canonicalChain = await traceRedirects(canonicalOrigin);
    alternateChain = await traceRedirects(alternateOrigin);
  } catch (error) {
    log("error", "Failed to complete live redirect checks.", {
      reason: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }

  if (canonicalChain.loopDetected) {
    failures.push({
      check: "canonical-chain-loop",
      reason: "Canonical host chain entered a redirect loop.",
      loopAt: canonicalChain.loopAt,
      chain: summarizeChain(canonicalChain),
    });
  }

  if (alternateChain.loopDetected) {
    failures.push({
      check: "alternate-chain-loop",
      reason: "Alternate host chain entered a redirect loop.",
      loopAt: alternateChain.loopAt,
      chain: summarizeChain(alternateChain),
    });
  }

  if (canonicalChain.maxHopLimitReached) {
    failures.push({
      check: "canonical-chain-max-hops",
      reason: `Canonical host exceeded ${MAX_REDIRECT_HOPS} hops.`,
      chain: summarizeChain(canonicalChain),
    });
  }

  if (alternateChain.maxHopLimitReached) {
    failures.push({
      check: "alternate-chain-max-hops",
      reason: `Alternate host exceeded ${MAX_REDIRECT_HOPS} hops.`,
      chain: summarizeChain(alternateChain),
    });
  }

  const canonicalHost = new URL(canonicalOrigin).hostname;
  const canonicalFinalHost = new URL(canonicalChain.finalUrl).hostname;
  const alternateFinalHost = new URL(alternateChain.finalUrl).hostname;

  if (canonicalFinalHost !== canonicalHost) {
    failures.push({
      check: "canonical-final-host",
      reason: "Canonical origin does not resolve back to canonical host.",
      expectedHost: canonicalHost,
      observedFinalHost: canonicalFinalHost,
      chain: summarizeChain(canonicalChain),
    });
  }

  if (alternateFinalHost !== canonicalHost) {
    failures.push({
      check: "alternate-final-host",
      reason: "Alternate host does not converge to canonical host.",
      expectedCanonicalHost: canonicalHost,
      observedFinalHost: alternateFinalHost,
      chain: summarizeChain(alternateChain),
    });
  }

  const canonicalFirstLocation = canonicalChain.hops[0]?.location;
  const alternateFirstLocation = alternateChain.hops[0]?.location;
  if (
    canonicalFirstLocation &&
    alternateFirstLocation &&
    canonicalFirstLocation === alternateOrigin &&
    alternateFirstLocation === canonicalOrigin
  ) {
    failures.push({
      check: "two-way-host-bounce",
      reason: "Detected two-way redirect bounce between canonical and alternate host.",
      canonicalFirstLocation,
      alternateFirstLocation,
      canonicalChain: summarizeChain(canonicalChain),
      alternateChain: summarizeChain(alternateChain),
    });
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      log("error", "Live redirect verification failed.", failure);
    }

    log("error", "Live redirect verification summary.", {
      status: "failed",
      canonicalOrigin,
      alternateOrigin,
      failureCount: failures.length,
    });
    process.exit(1);
  }

  log("info", "Live redirect verification summary.", {
    status: "passed",
    canonicalOrigin,
    alternateOrigin,
    canonicalChain: summarizeChain(canonicalChain),
    alternateChain: summarizeChain(alternateChain),
  });
}

try {
  await main();
} catch (error) {
  log("error", "Unhandled runtime error in live redirect verifier.", {
    reason: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
