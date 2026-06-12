const BASE_URL = 'https://fjf5irf18h.execute-api.ap-northeast-1.amazonaws.com';
const TENANT_ID = 'abc';

function getApiKey(): string {
  const key = import.meta.env.BLOG_API_KEY;
  if (!key) throw new Error('BLOG_API_KEY environment variable is not set');
  return key;
}

export interface Article {
  article_id: string;
  tenant_id: string;
  title: string;
  body: string;
  author_id: string;
  author_name: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

async function fetchPage(cursor: string | null): Promise<{ items: Article[]; nextCursor: string | null }> {
  const params = new URLSearchParams({ tenantId: TENANT_ID, limit: '100' });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`${BASE_URL}/articles/status/published?${params}`, {
    headers: { 'x-api-key': getApiKey() },
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getAllArticles(): Promise<Article[]> {
  const results: Article[] = [];
  let cursor: string | null = null;

  do {
    const data = await fetchPage(cursor);
    results.push(...data.items);
    cursor = data.nextCursor;
  } while (cursor);

  return results;
}

export async function getArticle(articleId: string): Promise<Article> {
  const params = new URLSearchParams({ tenantId: TENANT_ID });
  const res = await fetch(`${BASE_URL}/articles/${articleId}?${params}`, {
    headers: { 'x-api-key': getApiKey() },
  });

  if (!res.ok) throw new Error(`API error: ${res.status} for article ${articleId}`);
  return res.json();
}
