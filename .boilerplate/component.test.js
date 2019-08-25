import React    from 'react'
import renderer from 'react-test-renderer'
import Screen   from '../../../api/developer/screen'

describe('Anyone can navigate the app', () => {

	test('Navbar component renders correctly', () => {
		const tree = renderer
			.create(<Screen.display_Navbar/>)
			.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
