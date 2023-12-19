import { ApolloClient, InMemoryCache } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { GET_ALL_POSTS } from "../graphql/queries";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { format } from "date-fns";

export default function Home({ posts }) {
	return (
		<div>
			<Head>
				<title>My blog</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Welcome to Edu&apos;s Coding Blog</h1>
			<p>In this blog, I will post my thoughts and experiences I encounter while searching for knowledge and working on projects. </p>
			<br />
			<h2>All posts</h2>
			<br />
			{posts.map((val, i) => {
				const date = new Date(val.attributes.date);
				const formattedDate = format(date, "MMMM d, yyyy"); // Use date-fns for consistent formatting

				return (
					<Link key={i} href={val.attributes.urlSlug}>
						<a>
							<div className="card">
								<div className="date-line">
									<span role="img" aria-label="calendar">
										📅
									</span>
									{formattedDate}
								</div>
								<h3>
									<ReactMarkdown remarkPlugins={[remarkGfm, emoji, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
										{val.attributes.title}
									</ReactMarkdown>
								</h3>
								<ReactMarkdown remarkPlugins={[remarkGfm, emoji, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
									{val.attributes.description}
								</ReactMarkdown>
							</div>
						</a>
					</Link>
				);
			})}
		</div>
	);
}

export async function getServerSideProps() {
	const client = new ApolloClient({
		uri: "https://cms.eperezme.com/graphql",
		cache: new InMemoryCache(),
	});

	const { data } = await client.query({
		query: GET_ALL_POSTS,
	});

	return {
		props: {
			posts: data.blogPosts.data,
		},
	};
}

export const config = { runtime: "experimental-edge" };
