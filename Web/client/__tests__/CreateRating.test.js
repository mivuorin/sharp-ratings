import {render, screen} from "@testing-library/svelte";
import CreateRating from '../src/CreateRating.svelte'
import userEvent from "@testing-library/user-event";

describe('Create rating', () => {

    it('post rating to api on submit', async () => {
        userEvent.setup()

        render(CreateRating);

        const title = await findTitle()
        await userEvent.type(title, 'test-title')

        const body = await findBody()
        await userEvent.type(body, 'test-body')

        const submit = await screen.findByRole('button')
        await userEvent.click(submit)


        // TODO encapsulate fetch logic in separate function to make testing easier
        let expected = {
            title: 'test-title',
            body: 'test-body'
        };

        expect(fetch).toHaveBeenCalledWith('/api/ratings', toJsonPostRequest(expected))
    });
})

function findTitle() {
    return screen.findByLabelText('Tech name');
}

function findBody() {
    return screen.findByLabelText(/^Review about/);
}

function toJsonPostRequest(expected) {
    return {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expected)
    };
}
