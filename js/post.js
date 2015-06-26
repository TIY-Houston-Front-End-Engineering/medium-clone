/**
timestamp: current date when published
title: input value from title input
tags: input value from tags input

**/

export const PostStory = Parse.Object.extend({
	className: 'Post',

	defaults: {
		timestamp: null,
		title: null,
		content: null,
		src: null,
		tags: null,
		username: null,
		isPrivate: false
	}
})

export const PostStoryList = Parse.Collection.extend({
	model: PostStory
})