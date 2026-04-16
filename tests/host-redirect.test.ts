import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../functions/_middleware.js';

describe('www 主域跳转中间件', () => {
  it('www 请求会 301 跳到主域并保留路径与查询', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    const response = await onRequest({
      request: new Request('https://www.dushu.my/book/rulinwaishi/56?from=www'),
      next,
    });

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://dushu.my/book/rulinwaishi/56?from=www');
    expect(next).not.toHaveBeenCalled();
  });

  it('主域请求会继续交给静态站点处理', async () => {
    const next = vi.fn(async () => new Response('ok', { status: 200 }));

    const response = await onRequest({
      request: new Request('https://dushu.my/book/rulinwaishi'),
      next,
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('ok');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
