import * as api from '../src/Api';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import CreateRating from '../src/CreateRating.svelte';
import { defer } from '../test/defer';

jest.mock('../src/Api');

describe('CreateRating', () => {
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

    expect(
      await screen.findByText('Rating created successfully.')
    ).toBeInTheDocument();

    expect(postRatingMock).toHaveBeenCalledWith({
      title: 'test-title',
      body: 'test-body',
    });
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

    await waitForElementToBeRemoved(() => queryErrorMessage());
  });

  it('show loading indicator', async function () {
    render(CreateRating);

    await fillForm();
    await submit();

    expect(await screen.findByText('Loading...')).toBeInTheDocument();

    resolve();
  });

  it('empty default values', async function () {
    render(CreateRating);

    expect(await findTitle()).toHaveValue('');
    expect(await findBody()).toHaveValue('');
  });

  it('no initial errors are shown', function () {
    render(CreateRating);

    expect(queryTitleIsRequiredError()).not.toBeInTheDocument();
    expect(queryBodyIsRequiredError()).not.toBeInTheDocument();
  });

  it('title is required', async function () {
    render(CreateRating);

    const title = await findTitle();
    title.focus();

    (await findBody()).focus();

    await waitFor(() => {
      expect(queryTitleIsRequiredError()).toBeInTheDocument();
    });
  });

  it('max title length', async function () {
    render(CreateRating);

    const title = await findTitle();
    const text = 'x'.repeat(145);
    await userEvent.type(title, text);

    (await findBody()).focus();

    await waitFor(() => {
      expect(queryTitleIsTooLongError()).toBeInTheDocument();
    });
  });

  it('body is required', async function () {
    render(CreateRating);

    const body = await findBody();
    await body.focus();

    const title = await findTitle();
    title.focus();

    await waitFor(() => {
      expect(queryBodyIsRequiredError()).toBeInTheDocument();
    });
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

async function setTitle(text) {
  const title = await findTitle();
  await userEvent.type(title, text);
}

async function setBody(text) {
  const body = await findBody();
  await userEvent.type(body, text);
}

async function fillForm() {
  await setTitle('test-title');
  await setBody('test-body');
}

async function findErrorMessage() {
  return await screen.findByText('Creating new rating failed!');
}

function queryErrorMessage() {
  return screen.queryByText('Creating new rating failed!');
}

function queryTitleIsRequiredError() {
  return screen.queryByText('Please enter review title.');
}

function queryTitleIsTooLongError() {
  return screen.queryByText('Please shorten title to fit into 140 characters.');
}

function queryBodyIsRequiredError() {
  return screen.queryByText('Please enter review body text.');
}
