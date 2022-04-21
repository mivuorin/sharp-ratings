export async function getRatings() {
  const url = '/api/ratings';
  const response = await fetch(url);

  if (!response.ok) {
    throwHttpError('GET', url, response.status);
  }

  return await response.json();
}

export async function postRating(rating) {
  const method = 'POST';
  const url = '/api/ratings';

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rating),
  });

  if (!response.ok) {
    throwHttpError(method, url, response.status);
  }

  return response;
}

function throwHttpError(method, url, status) {
  throw new Error(`${method} "${url}" failed with ${status} status.`);
}
