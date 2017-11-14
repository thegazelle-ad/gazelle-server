import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class ReadMe extends BaseComponent {
  render() {
    return (
      <div>
        <h1>ReadMe</h1>
        <p>Step 1. Images<br />* Images must be 1350x750px for the header pic, and ideally the same size for in-line photos<br />* Upload images to admin.thegazelle.org<br /> * Login: password = gazellegazelle<br /> * Click on images, then choose file, or drag files onto the &lsquo;choose file button&rsquo;<br /> * Click upload<br /> * Copy the image url (always must start with https://s3.)<br /> * Paste in copy flow or work-space of your choice<br /> Screen Shot 2017-05-03 at 1.52.43 pm.png</p>
<p>&nbsp;</p>
<p>* I lost the url, how do I find the image again?<br /> * Click on Archive<br /> * Click on Amazon S3<br /> * https://console.aws.amazon.com/s3/buckets/thegazelle/gazelle/2017/09/?region=eu-west-1&amp;tab=overview# <br /> * Sign in<br /> * Email: editors@thegazelle.org<br /> * Password: SaadiyatRacists<br /> * Click on thegazelle &gt; gazelle &gt; year &gt; month &gt; title of image<br /> * Copy the image link, i.e. https://s3.amazonaws.com/thegazelle/gazelle/2017/05/the+gazelle_armenia.jpg<br /> Screen Shot 2017-05-03 at 2.30.21 pm.png</p>
<p>&nbsp;</p>
<p>Step 2: Ghost<br />* Go to editor.thegazelle.org<br />* Login<br /> * Email: ego225@nyu.edu<br /> * Password: password<br />* Add new post<br />* Add image in the following format: ![name](link)<br /> * Add photo/illustration credits in italics, use a * at the beginning and end of each line to italicise<br />* Add text + byline<br />* Click on the arrow to the right of save draft<br />* Click publish now &gt; publish now<br />* Add cover image<br /> * Click on the settings wheel/cog in the upper right-hand corner (next to the update post button)<br /> * Click on the link button in the bottom left of the panel that appears<br /> * Copy image link (same as one in the body of the article)<br />* Add Tags<br />* Click on Meta Data, then add Meta Description. This is the teaser that will appear under the article on the home-page and when the article comes up in a search engine.</p>
<p><br /> Screen Shot 2017-05-03 at 2.42.05 pm.png</p>
<p>Standard post view</p>
<p><br /> Screen Shot 2017-05-03 at 2.44.12 pm.png</p>
<p>With Post Settings panel, notice no post image, or tags</p>
<p><br />Quick tips<br />* *text* = italics<br />* **text** = bold<br />* &gt;text = block quote<br />* [text](URL) = links<br />* ![text](imageURL) = images<br />* ####text = subheading. The more # the smaller the heading.<br />* Embed video, just copy embed code from Vimeo/YouTube<br />* Hover over the Markdown text in the bottom left of the screen and clicking on it will bring up the list of standard commands</p>
<p><br />Step 3: Admin<br />BE CAREFUL, THIS IS WHERE THINGS CAN GO WRONG<br />* Go to admin.thegazelle.org (same as where you uploaded images)<br />* Click on Articles<br />* Add author(s), categories and make sure that there is a image URL and a teaser (these should come through from Ghost if you&rsquo;ve done the above correctly). If there is not, copy from Ghost.<br />* Click Save Changes<br /> Screen Shot 2017-05-03 at 2.49.55 pm.png</p>
<p>* To create a new author<br /> * click on Authors<br /> * Search the person&rsquo;s name to double-check there hasn&rsquo;t been another entry for that person in the past<br /> * Add name how you would like it to appear on the website<br /> * Add slug: first-last &lt; notice no caps, and hyphen between names<br />* Click on Issues<br />* Create a new issue (automatically generates unless it&rsquo;s a special issue)<br />* Click on Articles<br />* Click on Search By List<br />* Add ONE Featured Article and TWO Editor&rsquo;s Picks<br />* Add the rest of the articles<br />* Click Save Changes<br /> Screen Shot 2017-05-03 at 2.54.27 pm.png</p>
<p>&nbsp;</p>
<p>* Click Save Changes<br />* Click on Categories &gt; order the categories as you like<br />* Click on Main &gt; Publish Issue &gt; Restart Servers<br /> * You&rsquo;ll get an unknown error pop-up, click ok and you should have a brand new Gazelle issue at thegazelle.org</p>
<p><br />Trouble Shooting<br />* Click on RESTART SERVERS<br />* Refresh the page (and login again)<br />* Clear your cache<br />* Make sure every article you want to publish has a category, author, image and teaser assigned to it.<br /> * Go back to Ghost and check you&rsquo;ve uploaded both images<br />* Make sure every image starts with https://<br />* Cry<br />* If crying didn&rsquo;t work, contact Emil or whoever is currently familiar with the back-end of The Gazelle</p>
<p><br />BIG NO NOS:<br />* Deleting a post in Ghost that was already published as an article and is assigned to an issue &mdash; this would crash the website by corrupting the database<br />* Publishing an issue with no articles in it or less than 4<br />* Unpublishing an article, in admin.thegazelle.org without removing it from the issue(s) it is in (this could potentially also crash the website by corrupting the database)</p>
<p><br />Good form:<br />* Unpublish articles that you removed from all issues (if they are published the URLs to them will still work, though it wouldn&rsquo;t crash the website, just direct URLs to them would still show up instead of our 404 Page Not Found)</p>
      </div>
    );
  }
}


// Readme.propTypes = {
//
//   html: React.PropTypes.string.isRequired,
//
// };
