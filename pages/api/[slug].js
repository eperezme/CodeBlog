// Add this to your /pages/api/index.js file
export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
		// Add the following line to specify the Edge Runtime
		edge: {
			maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
		},
	},
};

// Your existing API handler for /index
export default function handler(req, res) {
	// Your implementation for /index
	// For example, you can respond with a JSON object
	res.status(200).json({ message: "Hello from the /index API route!" });
}
