import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/svelte'
import Hello from '../src/Hello'

test('Show greeting with name', () => {
    render(Hello, {name: 'Mikko'})

    let element = screen.getByRole('heading', {name: 'Hello Mikko from Svelte!'})
    expect(element).toBeInTheDocument()
})