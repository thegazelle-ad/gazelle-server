import Plain from 'slate-plain-serializer';
import _ from 'lodash';
import { parseFalcorPseudoArray } from 'lib/falcor/falcor-utilities';

export async function validateChanges(
  articleId,
  componentState,
  displayConfirm,
) {
  const falcorData = componentState.data.articles.byId[articleId];

  let processedAuthors = componentState.authors.map(author => author.id);

  // Check that all authors are unique
  if (_.uniq(processedAuthors).length !== processedAuthors.length) {
    return {
      invalid: true,
      msg:
        "You have duplicate authors, as this shouldn't be able" +
        ' to happen, please contact developers. And if you know all the actions' +
        ' you did previously to this and can reproduce them that would be of' +
        ' great help. The save has been cancelled',
    };
  }
  // Check that there wasn't already authors and they deleted all of them
  if (
    processedAuthors.length === 0 &&
    (falcorData.authors &&
      parseFalcorPseudoArray(falcorData.authors).length > 0)
  ) {
    return {
      invalid: true,
      msg:
        "Sorry, because of some non-trivial issues we currently don't have" +
        ' deleting every single author implemented.' +
        " You hopefully shouldn't need this function either." +
        ' Please re-add an author to be able to save',
    };
  }

  // Copy the array of tags.
  let processedTags = _.clone(componentState.tags);
  if (_.uniqWith(processedTags, _.isEqual).length !== processedTags.length) {
    return {
      invalid: true,
      msg:
        "You have duplicate tags, as this shouldn't be able" +
        ' to happen, please contact developers. And if you know all the actions' +
        ' you did previously to this and can reproduce them that would be of' +
        ' great help. The save has been cancelled',
    };
  }

  // Check the special case of someone trying to reassign a category as none
  if (
    componentState.category === null &&
    _.get(falcorData, 'category.id', null) !== null
  ) {
    return {
      invalid: true,
      msg:
        'Save cancelled, you cannot reset a category to none.' +
        ' If you wish to have this feature added, speak to the developers',
    };
  }

  if (
    componentState.imageUrl.length > 4 &&
    componentState.imageUrl.substr(0, 5) !== 'https'
  ) {
    const shouldContinue = await displayConfirm(
      'You are saving an image without using https. ' +
        'This can be correct in a few cases but is mostly not. Are you sure ' +
        'that you wish to continue saving?',
    );
    if (!shouldContinue) {
      return { invalid: true };
    }
  }

  if (
    processedAuthors.length === 0 &&
    (!falcorData.authors || Object.keys(falcorData.authors).length === 0)
  ) {
    // Indicate that we won't update authors as there were none before and none were added
    processedAuthors = null;
  }

  const plainMarkdown = Plain.serialize(componentState.markdown);
  if (
    processedTags.length === 0 &&
    (!falcorData.tags || Object.keys(falcorData.tags).length === 0)
  ) {
    // Indicate that we won't update tags as there were none before and none were added
    processedTags = null;
  }

  return {
    invalid: false,
    plainMarkdown,
    processedAuthors,
    processedTags,
  };
}

export function buildJsonGraphEnvelope(componentState, articleId, markdown) {
  const shouldUpdateCategory = componentState.category;
  const fields = shouldUpdateCategory
    ? ['title', 'slug', 'teaser', 'image_url', 'markdown', 'html', 'category']
    : ['title', 'slug', 'teaser', 'image_url', 'markdown', 'html'];
  // Build the jsonGraphEnvelope
  const jsonGraphEnvelope = {
    paths: [['articles', 'byId', articleId, fields]],
    jsonGraph: {
      articles: {
        byId: {
          [articleId]: {},
        },
      },
    },
  };
  // Fill in the data
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].title =
    componentState.title;
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].slug =
    componentState.slug;
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].markdown = markdown;
  jsonGraphEnvelope.jsonGraph.articles.byId[
    articleId
  ].html = this.converter.makeHtml(markdown);
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].teaser =
    componentState.teaser;
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].image_url =
    componentState.imageUrl;
  if (shouldUpdateCategory) {
    jsonGraphEnvelope.jsonGraph.articles.byId[articleId].category =
      componentState.category;
  }
  return jsonGraphEnvelope;
}
