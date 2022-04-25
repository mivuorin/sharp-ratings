import * as api from '../src/Api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import CreateRating from '../src/CreateRating.svelte';
import { defer } from '../test/defer';

jest.mock('../src/Api');

describe('Create rating', () => {
  let postRatingMock;
  let reject;
  let resolve;

  beforeEach(() => {
    const deferred = defer();

    resolve = deferred.resolve;
    reject = deferred.reject;

    postRatingMock = jest
      .spyOn(api, 'postRating')
      .mockImplementation(() => deferred.promise);

    userEvent.setup();
  });

  it('post rating to api on submit', async () => {
    render(CreateRating);

    await fillForm();
    await submit();

    resolve();

    const expected = {
      title: 'test-title',
      body: 'test-body',
    };

    expect(postRatingMock).toHaveBeenCalledWith(expected);
  });

  it('show error when post failed', async () => {
    render(CreateRating);

    await fillForm();
    await submit();

    reject();

    const error = await findErrorMessage();
    expect(error).toBeInTheDocument();
  });

  it('hide error message when submitting again', async function () {
    render(CreateRating);

    await fillForm();
    await submit();

    reject();

    expect(await findErrorMessage()).toBeInTheDocument();

    postRatingMock.mockResolvedValueOnce();

    await submit();

    expect(queryErrorMessage()).not.toBeInTheDocument();
  });

  it('show loading indicator', async function () {
    render(CreateRating);

    await fillForm();
    await submit();

    expect(await screen.findByText('Loading...')).toBeInTheDocument();

    resolve();
  });

  it('show success message', async function () {
    render(CreateRating);

    await fillForm();
    await submit();

    resolve();

    expect(
      await screen.findByText('Rating created successfully.')
    ).toBeInTheDocument();
  });
});

function findTitle() {
  return screen.findByLabelText('Tech name');
}

function findBody() {
  return screen.findByLabelText(/^Review about/);
}

async function submit() {
  const submit = await screen.findByRole('button');
  await userEvent.click(submit);
}

async function fillForm() {
  const title = await findTitle();
  await userEvent.type(title, 'test-title');

  const body = await findBody();
  await userEvent.type(body, 'test-body');
}

async function findErrorMessage() {
  return await screen.findByText('Creating new rating failed!');
}

function queryErrorMessage() {
  return screen.queryByText('Creating new rating failed!');
}
