import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/svelte';
import Ratings from '../src/Ratings.svelte';
import { defer } from '../test/defer';

import * as api from '../src/Api';

jest.mock('../src/Api');

describe('Ratings component', () => {
  let resolve;
  let reject;
  let getRatingsMock;

  beforeEach(() => {
    const deferred = defer();

    getRatingsMock = jest
      .spyOn(api, 'getRatings')
      .mockImplementationOnce(() => deferred.promise);

    resolve = deferred.resolve;
    reject = deferred.reject;
  });

  it('show heading', async () => {
    render(Ratings);

    let element = screen.getByRole('heading', { name: 'Best rated tech!' });
    expect(element).toBeInTheDocument();
  });

  it('fetch ratings from api', async () => {
    render(Ratings);

    expect(getRatingsMock).toHaveBeenCalled();
  });

  it('show ratings', async () => {
    render(Ratings);

    const first = rating('first-title', 'first-body');
    const second = rating('second-title', 'second-body');

    resolve([first, second]);

    expect(await findRatingByTitle(first)).toBeInTheDocument();
    expect(await findRatingByBody(first)).toBeInTheDocument();

    expect(await findRatingByTitle(second)).toBeInTheDocument();
    expect(await findRatingByBody(second)).toBeInTheDocument();
  });

  it('no ratings message', async () => {
    render(Ratings);

    resolve([]);

    expect(await findNoRatings()).toBeInTheDocument();
  });

  it('loading indicator', async () => {
    render(Ratings);

    expect(await findLoadingIndicator()).toBeInTheDocument();

    resolve([]);

    expect(await findNoRatings()).toBeInTheDocument();
  });

  it('error message when getting ratings failed', async () => {
    render(Ratings);

    expect(await findLoadingIndicator()).toBeInTheDocument();

    reject();

    expect(await screen.findByText('Loading error!!!')).toBeInTheDocument();
  });
});

function rating(title, body) {
  return { title: title, body: body };
}

function findRatingByTitle(first) {
  return screen.findByRole('heading', { name: first.title });
}

function findRatingByBody(first) {
  return screen.findByText(first.body);
}

function findNoRatings() {
  return screen.findByText('No ratings found :(');
}

function findLoadingIndicator() {
  return screen.findByText('Loading...');
}
