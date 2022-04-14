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
    throw new Error(
      `${method} "${url}" failed with ${response.status} status.`
    );
  }

  return response;
}
