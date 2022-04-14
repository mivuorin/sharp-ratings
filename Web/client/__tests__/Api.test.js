import { postRating } from '../src/Api';
import fetchMock from 'jest-fetch-mock';

describe('Api tests', () => {
  let rating;

  beforeEach(() => {
    rating = {
      title: 'test-title',
      body: 'test-body',
    };
  });

  it('posts ratings request', async () => {
    fetchMock.mockResponseOnce((_) => Promise.resolve({ status: 200 }));

    await postRating(rating);

    expect(fetch).toHaveBeenCalledWith(
      '/api/ratings',
      toJsonPostRequest(rating)
    );
  });

  it('rejects when fetch failed', async () => {
    let expected = new Error('async error');
    fetchMock.mockRejectedValueOnce(expected);

    await expect(async () => await postRating(rating)).rejects.toThrow(
      expected
    );
  });

  it('reject when response was not ok', async () => {
    fetchMock.mockResponseOnce((_) => Promise.resolve({ status: 404 }));

    await expect(async () => await postRating(rating)).rejects.toThrowError(
      'POST "/api/ratings" failed with 404 status.'
    );
  });
});

function toJsonPostRequest(expected) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expected),
  };
}
