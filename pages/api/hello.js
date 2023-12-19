// Add this to your /api/hello.js file
export const config = { runtime: "experimental-edge" };

// Your existing API handler
export default function handler(req, res) {
	res.status(200).json({ name: "John Doe" });
}
