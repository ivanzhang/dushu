const WWW_HOST = 'www.dushu.my';
const CANONICAL_ORIGIN = 'https://dushu.my';

/**
 * 统一把 `www` 入口折叠回主域，避免同一本书出现两个访问地址。
 *
 * @example
 * resolveCanonicalUrl(new URL('https://www.dushu.my/book/rulinwaishi/56?from=www'));
 * // => 'https://dushu.my/book/rulinwaishi/56?from=www'
 */
export function resolveCanonicalUrl(url) {
  if (url.hostname !== WWW_HOST) {
    return null;
  }

  return `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
}

/**
 * Cloudflare Pages 中间件：仅在 `www.dushu.my` 命中时做永久跳转，其余请求继续走静态站点。
 *
 * @example
 * await onRequest({
 *   request: new Request('https://www.dushu.my/book/rulinwaishi'),
 *   next: async () => new Response('ok'),
 * });
 */
export async function onRequest(context) {
  const redirectUrl = resolveCanonicalUrl(new URL(context.request.url));

  if (redirectUrl) {
    return Response.redirect(redirectUrl, 301);
  }

  return context.next();
}
