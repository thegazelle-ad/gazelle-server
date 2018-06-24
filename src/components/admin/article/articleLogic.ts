// We should probably contribute a type file for this very small library at some point?
// For now I'm just ignoring it
// @ts-ignore
import Plain from 'slate-plain-serializer';
import _ from 'lodash';
import { parseFalcorPseudoArray } from 'lib/falcor/falcor-utilities';
import { JSONGraphEnvelope } from 'falcor';
import { Converter } from 'showdown';

// When we type the files these originate from these types should just be imported
// We should also write out a full type for our Falcor tree actually. Wouldn't be too much work
// and would be reused everywhere
type DisplayConfirm = (message: string) => Promise<boolean>;
type ArticleControllerState = {
  data: {
    articles: {
      byId: {
        [key: number]: {
          title: string,
          slug: string,
          markdown: string,
          html: string,
          teaser: string,
          image_url: string,
          // NOTE: pretty sure this is wrong, it should be an object with id, but it seems to be how we use it? Test it later while debugging stuff
          category: number,
          authors: {},
          tags: {},
        },
      },
    },
  },
  authors: {
    id: number,
  }[],
  tags: {}[],
  category: number,
  imageUrl: string,
  markdown: string,
  title: string,
  slug: string,
  html: string,
  teaser: string,
};

export async function validateChanges(
  articleId: number,
  componentState: ArticleControllerState,
  displayConfirm: DisplayConfirm,
): Promise<{
  invalid: true,
  msg?: string
} | {
  invalid: false,
  plainMarkdown: any, // This is actually Slate.Value but have some typing config problems we should fix
  processedAuthors: number[] | null,
  processedTags: {}[] | null,
}> {
  const falcorData = componentState.data.articles.byId[articleId];

  let processedAuthors: number[] | null = componentState.authors.map(
    author => author.id,
  );

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
  let processedTags: {}[] | null = _.clone(componentState.tags);
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

export interface ArticleControllerJSONGraphEnvelope extends JSONGraphEnvelope {
  jsonGraph: {
    [T in keyof ArticleControllerState['data']]: {
      [T in keyof ArticleControllerState['data']['articles']]: {
        [T in keyof ArticleControllerState['data']['articles']['byId']]: Partial<ArticleControllerState['data']['articles']['byId'][number]>
      }
    }
  }
}

export function buildJsonGraphEnvelope(
  componentState: ArticleControllerState,
  articleId: number,
  markdown: string,
): ArticleControllerJSONGraphEnvelope {
  const shouldUpdateCategory = componentState.category;
  const fields = shouldUpdateCategory
    ? ['title', 'slug', 'teaser', 'image_url', 'markdown', 'html', 'category']
    : ['title', 'slug', 'teaser', 'image_url', 'markdown', 'html'];
  // Build the jsonGraphEnvelope
  const jsonGraphEnvelope: ArticleControllerJSONGraphEnvelope = {
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
  ].html = new Converter().makeHtml(markdown);
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].teaser =
    componentState.teaser;
  jsonGraphEnvelope.jsonGraph.articles.byId[articleId].image_url =
    componentState.imageUrl;
  if (shouldUpdateCategory) {
    // See NOTE at type definition at top, this is fishy
    jsonGraphEnvelope.jsonGraph.articles.byId[articleId].category =
      componentState.category;
  }
  return jsonGraphEnvelope;
}
