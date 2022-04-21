import { getRatings, postRating } from '../src/Api';
import fetchMock from 'jest-fetch-mock';

describe('postRating', () => {
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

describe('getRating', () => {
  let expected;

  beforeEach(() => {
    expected = [
      { title: 'title1', body: 'body1' },
      { title: 'title1', body: 'body1' },
    ];

    fetchMock.mockResponse((_) =>
      Promise.resolve({ status: 200, body: JSON.stringify(expected) })
    );
  });

  it('get ratings request', async () => {
    await getRatings();

    expect(fetch).toHaveBeenCalledWith('/api/ratings');
  });

  it('throw when response was not ok', async () => {
    fetchMock.mockResponseOnce((_) => Promise.resolve({ status: 404 }));

    await expect(async () => await getRatings()).rejects.toThrowError(
      'GET "/api/ratings" failed with 404 status.'
    );
  });

  it('deserialize response json', async () => {
    const actual = await getRatings();
    expect(actual).toEqual(expected);
  });

  it('throws error when fetch throws', async () => {
    const expected = new Error('Network error');
    fetchMock.mockRejectOnce(expected);

    await expect(async () => await getRatings()).rejects.toThrowError(expected);
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
