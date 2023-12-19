// Add this to your /api/hello.js file
export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
	pages: {
		edge: {
			maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
			experimental: {
				edge: true,
			},
		},
	},
};

// Your existing API handler
export default function handler(req, res) {
	res.status(200).json({ name: "John Doe" });
}
