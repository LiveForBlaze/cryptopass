//todo-1: make testcheck init file in 'tests' folder and import it
import {install as install_testcheck_globals} from 'jasmine-check'
install_testcheck_globals()
const check = global.check
const gen = global.gen

import foo from ''

describe('sum_two', () => {

	check.it('returns sum of two numbers', gen.number, gen.number, (x, y) => {
		expect(sum_two(x, y)).toEqual(x + y)
	})

})