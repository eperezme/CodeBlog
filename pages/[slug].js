import { ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
import { GET_ALL_SLUGS, GET_INDIVIDUAL_POST } from "../graphql/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
// import "katex/dist/katex.min.css";

const client = new ApolloClient({
	uri: "https://cms.eperezme.com/graphql",
	cache: new InMemoryCache(),
});

export default function Post({ post }) {
	const date = new Date(post.date);
	const formattedDate = `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;

	return (
		<div>
			<h1>
				<ReactMarkdown remarkPlugins={[remarkGfm, emoji, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]} children={post.title} />
			</h1>
			<div className="date-line">
				<span role="img" aria-label="calendar">
					📅
				</span>
				{formattedDate}
			</div>
			<ReactMarkdown remarkPlugins={[remarkGfm, emoji, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]} children={post.content} />
		</div>
	);
}

export async function getStaticPaths() {
	const { data } = await client.query({ query: GET_ALL_SLUGS });

	const paths = data.blogPosts.data.map((post) => {
		return { params: { slug: post.attributes.urlSlug } };
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const { data } = await client.query({
		query: GET_INDIVIDUAL_POST,
		variables: { slugUrl: params.slug },
	});

	const attrs = data.blogPosts.data[0].attributes;

	return {
		props: {
			post: {
				title: attrs.title,
				date: attrs.date,
				content: attrs.content,
			},
		},
	};
}
