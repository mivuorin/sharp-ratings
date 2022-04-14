import * as api from '../src/Api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import CreateRating from '../src/CreateRating.svelte';

jest.mock('../src/Api');

describe('Create rating', () => {
  it('post rating to api on submit', async () => {
    const postRatingMock = jest
      .spyOn(api, 'postRating')
      .mockImplementation(() => Promise.resolve());

    userEvent.setup();

    render(CreateRating);

    const title = await findTitle();
    await userEvent.type(title, 'test-title');

    const body = await findBody();
    await userEvent.type(body, 'test-body');

    const submit = await screen.findByRole('button');
    await userEvent.click(submit);

    const expected = {
      title: 'test-title',
      body: 'test-body',
    };

    expect(postRatingMock).toHaveBeenCalledWith(expected);
  });
});

function findTitle() {
  return screen.findByLabelText('Tech name');
}

function findBody() {
  return screen.findByLabelText(/^Review about/);
}
