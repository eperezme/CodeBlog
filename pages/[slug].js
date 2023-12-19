import { ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
import { GET_ALL_SLUGS, GET_INDIVIDUAL_POST } from "../graphql/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { format } from "date-fns";

const client = new ApolloClient({
	uri: "https://cms.eperezme.com/graphql",
	cache: new InMemoryCache(),
});

export default function Post({ post }) {
	const date = new Date(post.date);
	const formattedDate = format(date, "MMMM d, yyyy"); // Use date-fns for consistent formatting

	const renderMarkdown = (content) => (
		<ReactMarkdown remarkPlugins={[remarkGfm, emoji, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
			{content}
		</ReactMarkdown>
	);

	return (
		<div>
			<h1>{renderMarkdown(post.title)}</h1>
			<div className="date-line">
				<span role="img" aria-label="calendar">
					📅
				</span>
				{formattedDate}
			</div>
			{renderMarkdown(post.content)}
		</div>
	);
}

export async function getServerSidePaths() {
	const { data } = await client.query({ query: GET_ALL_SLUGS, fetchPolicy: "no-cache" });

	const paths = data.blogPosts.data.map((post) => {
		return { params: { slug: post.attributes.urlSlug } };
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getServerSideProps({ params }) {
	const { data } = await client.query({
		query: GET_INDIVIDUAL_POST,
		variables: { slugUrl: params.slug },
		fetchPolicy: "no-cache",
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

export const config = { runtime: "edge" };
