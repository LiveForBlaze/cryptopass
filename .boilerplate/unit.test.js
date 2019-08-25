// @flow
import foo from "";

describe("middleware API", () => {
	it("can initialize the App", () => {
		expect(Middleware).toHaveProperty("initializeTheApp");
	});

	it("can add features to the App", () => {
		expect(Middleware).toHaveProperty("add_tf_Features_to_the_App");
	});
});

function contains_numbers(text: string) {
	const res = !isNaN(parseFloat(text));
	return res;
}

describe("contains_numbers", (string) => {
	it("returns false for empty strings", () => {
		expect(contains_numbers).toBe(false);
	});
});
