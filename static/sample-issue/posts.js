const data = {
    issues: {
        "76": {
            "pubDate": "2016-09-04T05:58:09.000Z",
            "featured": { $type: "ref", value: ["articlesBySlug", "sunday-sketches-xvi"] },
            "picks": [
                { $type: "ref", value: ["articlesBySlug", "reclaiming-identity"] },
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"] },
            ],
            "categories": [
                {
                    name: "commentary",
                    slug: "commentary",
                    articles: [
                        { $type: "ref", value: ["articlesBySlug", "freshman-year-in-review-what-i-learned-2"] },
                        { $type: "ref", value: ["articlesBySlug", "a-very-subjective-guide-to-eid-break"] },
                        { $type: "ref", value: ["articlesBySlug", "on-adjusting-back"] },
                    ],
                },{
                    name: "on campus",
                    slug: "on-campus",
                    articles: [
                        { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"] },
                    ],
                },{
                    name: "off campus",
                    slug: "off-campus",
                    articles: [
                        { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"] },
                    ],
                },{
                    name: "in focus",
                    slug: "in-focus",
                    articles: [
                        { $type: "ref", value: ["articlesBySlug", "the-weekly-graze-2"] },
                    ],
                },
            ],
        },
    },


    trending: [
        { $type: "ref", value: ["articlesBySlug", "freshman-year-in-review-what-i-learned-2"] },
        { $type: "ref", value: ["articlesBySlug", "the-weekly-graze-2"] },
        { $type: "ref", value: ["articlesBySlug", "reclaiming-identity"] },
        { $type: "ref", value: ["articlesBySlug", "a-very-subjective-guide-to-eid-break"] },
        { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"] },
        { $type: "ref", value: ["articlesBySlug", "on-adjusting-back"]},
        { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"] },
    ],

    categories: {
        "on-campus": {
            name: "on campus",
            slug: "on-campus",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"] },
                { $type: "ref", value: ["articlesBySlug", "dear-freshmen"] },
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
                { $type: "ref", value: ["articlesBySlug", "visas"] },
            ],
        },
        "off-campus": {
            name: "off campus",
            slug: "off-campus",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"] },
                { $type: "ref", value: ["articlesBySlug", "the-ad-secrets-challenge"] },
                { $type: "ref", value: ["articlesBySlug", "art-in-ad"] },
            ],
        },
        "commentary": {
            name: "commentary",
            slug: "commentary",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "freshman-year-in-review-what-i-learned-2"] },
                { $type: "ref", value: ["articlesBySlug", "a-very-subjective-guide-to-eid-break"] },
                { $type: "ref", value: ["articlesBySlug", "reclaiming-identity"] },
                { $type: "ref", value: ["articlesBySlug", "on-adjusting-back"] },
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"] },
                { $type: "ref", value: ["articlesBySlug", "returning-to-nyuad"]},
                { $type: "ref", value: ["articlesBySlug", "post-grad"]},
                { $type: "ref", value: ["articlesBySlug", "whitewashing-hollywood"]},
                { $type: "ref", value: ["articlesBySlug", "nyuad-survival-guide"]},
                { $type: "ref", value: ["articlesBySlug", "letter"]},
                { $type: "ref", value: ["articlesBySlug", "picking-courses"]},
            ],
        },
        "in-focus": {
            name: "in focus",
            slug: "in-focus",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "the-weekly-graze-2"] },
                { $type: "ref", value: ["articlesBySlug", "50-things"] },
                { $type: "ref", value: ["articlesBySlug", "fixing-a-tire"] },
                { $type: "ref", value: ["articlesBySlug", "post-marhaba-feels"] },
            ],
        },
        "letters": {
            name: "letters",
            slug: "letters",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "letter"] },
            ],
        },
    },

    // authors: [
    //     { $type: "ref", value: ["authorsBySlug", "khadeeja-farooqui"] },
    //     { $type: "ref", value: ["authorsBySlug", "joey-bui"] },
    //     { $type: "ref", value: ["authorsBySlug", "jamie-sutherland"] },
    //     { $type: "ref", value: ["authorsBySlug", "karolina-wilczynska"] },
    //     { $type: "ref", value: ["authorsBySlug", "the-gazelle-staff"] },
    //     { $type: "ref", value: ["authorsBySlug", "tessa-ayson"] },
    // ],

    // teams: [
    //     {
    //         name: "management",
    //         members: [
    //             { $type: "ref", value: ["authorsBySlug", "ahmed-meshref"] },
    //             { $type: "ref", value: ["authorsBySlug", "rend-beiruti"] },
    //         ],
    //     },{
    //         name: "editorial",
    //         members: [
    //             { $type: "ref", value: ["authorsBySlug", "rend-beiruti"] },
    //             { $type: "ref", value: ["authorsBySlug", "daniah-kheetan"] },
    //         ],
    //     },{
    //         name: "staff",
    //         members: [
    //             { $type: "ref", value: ["authorsBySlug", "daniah-kheetan"] },
    //             { $type: "ref", value: ["authorsBySlug", "tala-nassar"] },
    //         ],
    //     },
    // ],

    infoPages: {
        "about": {
            title: "About",
            slug: "about",
            html: "<p>The Gazelle is a weekly student publication, founded by Alistair Blacklock and Amanda Randone in 2013, serving the NYU Abu Dhabi community and the NYU&#8217;s greater global network. The Gazelle allows its undergraduate writers and photographers to cover campus and local news and is published online.</p> <p >The Gazelle is run solely by current undergraduate students. The editors are committed to operating as editorially and financially independent of the university. The Gazelle is an online platform available to the public because the editors believe students interested in professional journalism will not settle on publishing their work when they cannot share it, via social media or email, with people outside the institution. The editors believe that a thoughtful, structured and self-consciously public publication will provide this while creating a framework for constructive discourse. This is the best medium for hosting student voices, stories and ideas than alternative forms of publication. At a time when anyone can publish their work online we see it not only important but vital that students do so collectively.</p> <p>Opinions expressed in The Gazelle are by editors or columnists and are not those of The Gazelle. Unsigned editorials are all the collective opinion of the Editorial Board. The Gazelle encourages readers to voice their opinions respectfully. Comments are not pre-moderated, but The Gazelle reserves the right to remove comments if deemed to be in violation of this policy. Comments should remain on topic, concerning the article or blog post to which they are connected. Brevity is encouraged.</p> <p>A comment will be deleted if:</p><ul><li>The comment attacks a named or identified person or group unreasonably,</li><li>The comment makes readers unreasonable uncomfortable on the basis of one’s race, gender, religion, disability, ethnicity or otherwise,</li><li>The comment attacks personally any NYUAD or Gazelle staff,</li><li>The comment contains excessive obscenities,</li><li>It is determined that the comment is made under a false name or uses another person’s name or email address,</li><li>The comment threatens or encourages violence,</li><li>The comment encourages illegal behavior,</li><li>The comment violates copyright or privacy protections,</li><li>The comment contains personal information,</li><li>Or the comment is completely off-topic or determined to be spam</li></ul>",
        },
        "ethics": {
            title: "Code of Ethics",
            slug: "ethics",
            html: '<p>The Gazelle follows a code of ethics to ensure fair and accurate journalism is practiced in accordance with the laws of the UAE. The following is adapted from the <a href="//gulfnews.com/about-gulf-news/help/code-of-ethics-1.446056"> Code of Ethics of the Gulf News</a> and the UAE journalism code of ethics:</p><ol><li ><p >Respect the truth and the right of the public to have access to truthful and accurate information.</p></li><li ><p >While performing his or her duty, the journalist is demanded to commit at all times to the principles of freedom and integrity in gathering and publishing stories. He or she should also voice fair and neutral comments and criticism.</p></li><li ><p >A journalist must only publish facts from known sources, and must not hide any basic or important information, forge facts or falsify documents.</p></li><li ><p >He or she should use only legitimate means to obtain information, photos and documents from original sources.</p></li><li ><p >Journalists should undertake to rectify any published information that proved to be false.</p></li><li ><p >There should be no compromise in credibility.</p></li><li ><p >Journalists should respect the privacy of individuals. If personal conduct conflicts with public interest, such conduct may be covered without violating the privacy of uninvolved individuals, to the extent that this is possible.</p></li><li ><p >In regards to sources, the code and charter stress that professionalism and confidentiality should be strictly observed if the source demands anonymity.</p></li><li ><p >Journalists should not seek to provoke or inflame public feelings by any means, or use means of excitement and deception or dishonest reporting. They should not use media for the purpose of libel or slandering.</p></li><li ><p >The edited publications should not be influenced by personal interests or businesses with a third party. Publishers and editors-in-chief must turn down any such attempts, and draw a clear line between reported stories and commercial articles or publications.</p></li><li ><p >Journalists should be very vigilant to traps of discrimination and avoid involving themselves by any means in any stories hinting to discrimination of race, sex, language, faith or national and social backgrounds.</p></li><li ><p >Journalists must strive to be impartial in reporting and avoid conflicts of interest with their stories.</p></li><li ><p >The media should refrain from publishing photos that are very graphic or violent in nature.</p></li><li ><p >Journalists are urged to avoid using obscene or offensive language in their reports.</p></li><li ><p >Islam is a basic and important component of UAE culture, values and traditions, and the respect of religious and traditional values is crucial for sensitive publishing.</p></li><li ><p >Human rights should be respected and valued by the media.</p></li><li ><p >Plagiarism, ill-intention interpretation, libel, slandering, censure, defamation, allegation and accepting bribery to publish or hide information are all dangerous professional violations.</p></li><li ><p >When using facts found in news publications, journalists must give credit to the original publication.</p></li><li ><p >Competing for news, pictures and information is a right, provided practicing such competition is honest and clear and does not hinder the work of colleagues in competing publications.</p></li><li ><p >A journalist has to do his or her best not to become part of a story, and to cover news not make it. While gathering information, a journalist may not present himself as anything other than a journalist.</p></li><li ><p >Journalists must not acquire information or pictures through harassment, temptation or violence.</p></li><li ><p >Accepting valuable cash and kind gifts may cause a journalist to be biased in his coverage and is considered a breach of the code.</p></li></ol><p><em>Published March 2013. Updated January 2014.</em></p>',
        },
    },

    // "sample": {
    //     "authors": [
    //         { $type: "ref", value: ["authorsBySlug", "author"] },
    //     ],
    //     "featuredImage": "",
    //     "html": "",
    //     "published_at": "2014-08-30T05:58:09.000Z",
    //     "slug": "",
    //     "title": "",
    //     "issueId": "76",
    //     "category": "",
    //     "teaser": "",
    // },

    articlesBySlug: {
        "50-things": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "khadeeja-farooqui"] },
                { $type: "ref", value: ["authorsBySlug", "joey-bui"] },
                { $type: "ref", value: ["authorsBySlug", "jamie-sutherland"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2014/03/kids-860x430.jpg",
            "html": '<p><video autoplay="autoplay" loop="loop"><source src="//s3.amazonaws.com/gazelle_ad/freshman-issue/08_31_FEATURES_50Things.mp4" type="video/mp4" /><source src="//s3.amazonaws.com/gazelle_ad/freshman-issue/08_31_FEATURES_50Things.ogg" type="video/ogg" /><object codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"><param name="src" value="//www.thegazelle.org/wp-includes/js/tinymce/plugins/media/moxieplayer.swf" /><param name="flashvars" value="url=//s3.amazonaws.com/gazelle_ad/freshman-issue/08_31_FEATURES_50Things.mp4&amp;poster=/wp-admin/" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="true" /><embed type="application/x-shockwave-flash" src="//www.thegazelle.org/wp-includes/js/tinymce/plugins/media/moxieplayer.swf" flashvars="url=//s3.amazonaws.com/gazelle_ad/freshman-issue/08_31_FEATURES_50Things.mp4&amp;poster=/wp-admin/" allowfullscreen="true" allowscriptaccess="true" /></object></video><br /><em>Video by Megan Eloise/ The Gazelle</em></p><em>Editor’s Note: This article was originally published on August 30, 2014.</em><p></p><p>Dear Class of 2018,</p><p>There is no way to go through college without making mistakes. But even as we continue to change majors overnight, miss Skype dates with old friends and plead with airline officials to let us take those extra few kilograms on board, we still learn a lot along the way. Taking a cue from <a href="//mitadmissions.org/blogs/entry/50_things">Massachusetts Institute of Technology’s Office of Admissions Blog</a>, here is some advice, from three generations of NYU Abu Dhabi students, so you can make all the right mistakes, but none of the wrong ones.</p><ol><li>Have confidence. You are here for a good reason, even if you don’t know what that is yet.</li><li>But don’t get cocky. You have a lot to learn, young grasshopper.</li><li>Explore the city. If Abu Dhabi seems limited to you, then it is up to you to look further.</li><li>Countless shops sell chai for 1 AED. These one dirham cups save lives and grades.</li><li>So does hummus.</li><li>Tread carefully with dokha. Look up its health effects or ask somebody. Preferably multiple, well-informed people.</li><li>Visit the gym. The freshman 15 is not a myth.</li><li>Your body is a temple — even on Thursday nights.</li><li>Try to make Emirati friends.</li><li>If you haven’t already, seriously consider learning Arabic.</li><li>Take a position on the Oxford comma and defend it to the death.</li><li>Invest in a backpack. You will travel more than you think you will.</li><li>But don&#8217;t feel like you have to leave the country every break.</li><li>Join in. Find a Student Interest Group or start a new one.</li><li>Invest, don’t spectate. You’ll always remember the chants on the bus after a dragon boat victory or your first Open Mic performance.</li><li>College comes with new independence but you don’t have to compromise your values. If partying is not your thing, do not feel like you still have to be intoxicated on Friday mornings.</li><li>Similarly, you do not have to do an internship or work in the summer just because your friends are.</li><li>Learn from your peers — don’t be intimidated or disheartened by their successes. Many of us are only pretending to have our lives together.</li><li>We are all nerds here. Don’t be afraid to show what you love.</li><li>Don’t expect everything to fall into place for you. Fight for it, or decide to fight for something else.</li><li>Talk to your professors about papers, grades and life.</li><li>Global Academic Fellows do help.</li><li>Help will always be given at NYUAD to those who ask for it. Your peers may be some of the greatest people you will ever meet and we’re all in the same boat.</li><li>Turn up on time.</li><li>It is okay to be placed into Math Functions or Analysis and Expression. Do not make it a matter of hurt ego or lost pride. Foundational courses are often advantageous.</li><li>FRESHMAN YEAR GRADES DON&#8217;T COUNT. Sort of. If you’re worried, ask a grown-up, not Facebook.</li><li>That said, the aforementioned policy is no reason to not take your academics seriously. Challenge yourself always.</li><li>When NYUAD says diverse, it means diverse. Do not assume people&#8217;s religious, social or cultural backgrounds. More disputes arise because of assumptions than actual facts.</li><li>Do not make assumptions about people’s financial support packages either.</li><li>Respect differences. You do not have to change your mind or change somebody else’s mind, but you do have to learn how to live with these differences.</li><li>Listen.</li><li>You do not have to be a global leader, despite what all the press releases say.</li><li>Do not leave clothes for too long in the washers or dryers. Others won’t thank you for it and things go missing.</li><li>Staying up all night to finish that paper is not a badge of honor. Take pride in managing your time well.</li><li>Do what you say you’ll do. Show up. If you really can’t come, apologize profusely and let the organizers know in advance.</li><li>Take photos, make videos, write jokes and conversation — twenty years later, you will want to remember college.</li><li>Be silly. Build pillow forts at midnight and bake a cake every Saturday. You’ll remember the silliness when all the seriousness has faded away.</li><li>Take part in the 24 Hour Film Race. Our university is small enough that you can do things you’re not trained to do without judgement. So you’ve never taken a film class in your life? Who cares. Make a mockumentary about your pet goldfish.</li><li>Invest in quality speakers, an enormous blanket or a good saucepan. Have something that is yours and makes your room a home. Just make sure it fits in your storage box.</li><li>Once in a while send a letter or a postcard to your parents, teacher or best friend.</li><li>Friendships aren&#8217;t static, especially when you&#8217;re separated by thousands of miles. Be okay with that.</li><li>Let yourself change too. Don’t think too much about the past and focus on moving forward.</li><li>Be proud of who you are and where you come from.</li><li>Romantic relationships are mysterious things. We recommend a trial and error approach — you’re young.</li><li>Be prepared to defend Abu Dhabi and the Middle East against Orientalism for the rest of your life.</li><li>Long distance relationships are difficult and you will need to go the extra mile. Be brave enough to cut loose when it&#8217;s not working out.</li><li>NYUAD is our community and our unfinished creation. Be proud of it.</li><li>And don’t be afraid to fix it where it needs fixing.</li><li>Ignore all of us upperclassmen and other people who tell you what you just have to do at college. It’s your four years, and you’re welcome to disregard as many acronyms as you like: FoS, FoMST, JSTOR, FOMO, TL;DR, GPA, FML, YOLO.</li><li>You&#8217;ll fall asleep on sand dunes, wake up in Kathmandu’s valleys, argue about imperialism, nationalism and Orientalism over shisha late into the night, love somebody from the other side of the world and get so lost along the way. Remember how lucky you are and be thankful.</li></ol><p><em>Khadeeja Farooqui is Editor-In-Chief. Email her at khadeeja@thegazelle.org.</em></p><p><em>Joey Bui is a contributing writer. Email her at news@thegazelle.org.</em></p><p><em>Jamie Sutherland is a contributing writer. Email him at editorial@thegazelle.org</em></p>',
            "image": null,
            "published_at": "2014-08-30T05:58:09.000Z",
            "slug": "50-things",
            "title": "50 Things Every NYUAD Freshman Should Know",
            "issueId": "76",
            "category": "on-campus",
            "teaser": "Make all the right mistakes, but none of the wrong ones.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "fixing-a-tire"] },
                { $type: "ref", value: ["articlesBySlug", "dear-freshmen"] },
            ],
        },
        "fixing-a-tire": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "zoe-hu"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2014/03/08_31_FEATURES_FixTyre.jpg",
            "html": '<p><img class="size-full wp-image-65291" src="//thegazelle.s3.amazonaws.com/gazelle/2014/03/08_31_FEATURES_FixTyre.jpg" alt="Illustration by Megan Eloise/The Gazelle" width="1200" height="599" /></p><p class="wp-caption-text"><em>Illustration by Megan Eloise/The Gazelle</em></p></div><p><em>Editor’s note: This article was originally published on August 30, 2014.</em></p><p>I knew something was wrong even before the light started blinking.</p><p>My car had gone over the pothole. The traitorous front tire had jumped over the ridge — there was a moment of weightlessness, a strange gravitational hiccup — and then we had landed back to earth with a<i> boom, kerthud, thunkthunkthunk. </i>The sounds were magnificent and terrifying. The accident was worth the onomatopoetic value alone.</p><p>And now my car was rebelling, steering wheel shuddering, strange things happening to the overall equilibrium of the vehicle. And there was that light on my dashboard — a bright blinking &#8216;uh-oh.&#8217; Like a sullen teenager, my car was acting up. We were in automotive mutiny, and I was in southeast Detroit with a flat tire.</p><p>The terrain of Michigan roads is frequently cracked and pock-marked and moon-like. Potholes are to be expected. But flat tires — like appendectomies and delayed flights and other inconveniences that are too stupid and mundane to ever happen to you, only to other people — are not.</p><p>And yet. Here I was. On Mack Avenue, with my front tire punctured and a feeling that could only be described as wilt-y inside my chest.</p><p>I don&#8217;t quite remember what my thought process had been at that moment. I don’t think there had been a thought process actually, just grappling, fumbling denial and a blank swipe of panic and the most creative swearing I&#8217;d done in years. After all, there aren&#8217;t many nice places to have a flat tire, but southeast Detroit is definitely not one of them.</p><p>Sweaty, praying and steadily ignoring the insistent <i>flapflapflap </i>of tire rubber against ground, I drove down Mack, past the abandoned houses and the lots sprouting weeds and bottle shards. The car and I somehow limped to safer territory, coming to a wounded, dignified stop at a Shell gas station.</p><p>My mind had cleared enough for me to realize what was happening. This was a flat tire. This was adulthood.</p><p>—</p><p>When you are a teenager, a car means mobility, freedom and the breathless breaking of curfew. My first car was a Ford Escape, and our love affair can be gleaned from the candy wrappers I’d leave on its seats, the abandoned books in the backseat, the scuff of my friends&#8217; shoes on the dashboard. As a teenager, your car is a space carved out just for you and, seated before the steering wheel, you are quite physically and emphatically in control. It is not complete ownership — unless your parents are cruel and into weird stuff like “building character” and “learning the true value of things,” you probably have not paid for the car yourself. But, it is still something.</p><p>It is power without the tacked-on asterisk of responsibility. Independence, but not full abandonment. I suspect the affection I feel for my first car doesn’t have much to do with cherished high school memories so much as the fact that I was not paying for my own gas at the time.</p><p>When you are an adult, however, a car means something else. You must feed it, clean it, and care for it. It shuttles you back and forth from home to work. You have to give rides. You have to pay for parking. And occasionally, things like flat tires and oil changes and speeding violations, things that you never prepared for because someone else was always there to know what to do — they happen. They suck.</p><p>I had decided that I would handle this flat tire like an adult, and in my strange brain, this translated into hiding the entire ordeal from my parents and doing everything to conceal that it had ever happened in the first place. There were steps to be taken — I had to get home, I had to change the tire, I had to see if I had the money to change the tire — but all of this, I inexplicably decided, needed to take place without my mother ever finding out.</p><p>My newfound conviction was somewhat enforced, and made easier, by the fact that my mother was not in town at the time and I was instead staying at her friend Sharon&#8217;s. But Sharon could not know about the flat tire either, because I knew that once Sharon found out, my mother would too, thanks to the secret and nefarious Mom Network of communication that extends, bewilderingly, between all those who have gone through childbirth. So, I resolved to lie. </p><p>Were unnecessary fabrications and subterfuge the adult way to go about things? Who knows? It certainly made the situation a lot more difficult and complicated than it had to be, so that leads me to answer yes.</p><p>I staunchly stood by this resignation to noble and martyr-like independence until I realized that I needed a ride home from the gas station. Then, I frantically called all my friends on my contact list and begged them each to come pick me up. By that point, however, it’d become apparent that everyone I knew had secretly met earlier that day and conspired to all get sick or leave town or have work at the same time. No one could pick me up.</p><p>This severely complicated the situation. It was too bad I couldn’t call Sharon.</p><p>—</p><p>Not quite knowing what else to do, I phoned a mechanic and was put on hold for half an hour of foot-tapping and the same elevator-music played in a never-ending tinny loop. A nice woman named Mandy finally picked up, and I explained to her my situation. She said that the tire could be taken out, and a new one put in its place very easily. I would just have to wait until the following morning for the repair.</p><p>Cringing, I asked Mandy how much the operation would cost.</p><p>&#8220;Around 275 dollars,&#8221; said Mandy.</p><p>&#8220;275 dollars?&#8221; I repeated.</p><p>&#8220;Yes,&#8221; said Mandy. “275 dollars.”</p><p>There was a long pause over the phone.</p><p>&#8220;Okay,&#8221; I croaked. &#8220;Okay. We&#8217;ll make it work.&#8221;</p><p>275 dollars. This was good news for the car, not-so-good news for the bank account. The prospect of parental financial support was a tempting, fleeting thought, but asking for money would entail confessing to my mom what had happened. And I couldn’t do that if I wanted to be a real, mature adult. I would have to pay on my own.</p><p>Mandy and I could do this. The tire would be fixed.</p><p>—</p><p>After the necessary agreements and the painful extraction of my credit card information over the phone, I hung up knowing there still remained another tricky problem: waiting. I somehow had to survive from now until the next morning when I could pick up the car, without anyone finding out what had happened or Sharon noticing the mysterious disappearance of a 2,700-pound vehicle from her driveway.</p><p>Luckily, a friend took pity on me and let me stay the night at her house. This seemed like a good plan. I could leave the car at the shop, I reasoned, then pick it up in the morning and no one would be the wiser. After texting Sharon to tell her I wouldn’t be sleeping at home, I received a rather dismaying response from her a couple minutes later:<i> &#8220;Thx. Is your car with you?&#8221;</i></p><p>My web of lies was slowly unravelling. I turned off my phone.</p><p>The next day, I spent the morning being an annoying burden to my friend while we waited for my car to be repaired, her obligingly shuttling me from point A to point B, me feeling oddly helpless and infantile.</p><p>This was the true epitome of adulthood, I realized: having control and freedom, then seeing it taken away from you and being responsible for figuring out — on your own and very much alone — how to get it back. A swamp of arrangements, phone calls, bills and inconveniences to wade through. A flat tire and a sad bank account.</p><p>The realization that you are struggling more than you should be and the vague, heady fear that someone else might notice.</p><p>—</p><p>In college, one encounters many flat tires, except instead of being called flat tires, they are called visa applications or broken air-conditioners or the flu. These things may look familiar, may have happened before, but they will be different in that now no one is there to help solve the problem. Without your parents, counselors, teachers and friends, you must grapple with it on your own.</p><p>Having this newfound but familiar responsibility feels a bit like waking up in your old bedroom, the same one you have slept in for years, only to discover that overnight on your eighteenth birthday, someone has painted all the walls a different color. You feel surprised and betrayed and somewhat annoyed that no one first bothered to consult you with paint swatches.</p><p>I had the flat tire fixed, and I drove my car to work the next morning with a strange sensation familiar to many college students — a feeling of accomplishment tinged with the uneasy suspicion that everything probably could have resolved itself in a much different, much easier way. In adulthood, there is always that mythical easy way. You don’t know what it looks like, all you know is that it exists and it is evading you.</p><p>Looking back, I think I know what my easy way was.</p><p>I could have called my mom. I could have asked for help, could have borrowed the money, could have come clean to Sharon. But because my strange brain had conflated being mature with being infallible, I’d instead insisted on concealing the flat tire and causing myself a lot of mental, emotional and financial anguish in the process.</p><p>Successful adulthood means being someone who can calmly go about fixing a flat tire, even if that involves asking other people for help. Yet I had believed it meant being someone to whom flat tires never happened in the first place. How stupid, I can’t help but think in hindsight. How proud.</p><p>Maturity is not infallibility. And while independence is important, you don’t have to ostracize yourself to live the illusion of a perfect, put-together life. It is okay to call home sometimes, especially if you’re struggling. You don’t have to accept money from others, you don’t even have to let them help you. But you can call and complain. Sometimes, the few words of sympathy you will hear in response are enough.</p<p><em>Zoe Hu is an editor at large. Email her at zoe@thegazelle.org.</em></p>',
            "image": null,
            "published_at": "2014-08-30T05:58:09.000Z",
            "slug": "fixing-a-tire",
            "title": "Fixing A Tire",
            "issueId": "76",
            "category": "in-focus",
            "teaser": "We were in automotive mutiny, and I was in southeast Detroit. This was a flat tire. This was adulthood.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "50-things"] },
                { $type: "ref", value: ["articlesBySlug", "visas"] },
            ],
        },
        "dear-freshmen": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "tessa-ayson"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2015/09/TSP.jpg",
            "html": '<p><img class="wp-image-123771 size-full" src="//thegazelle.s3.amazonaws.com/gazelle/2015/09/TSP.jpg" alt="TSP" width="699" height="323" /></p><p class="wp-caption-text"><em>Graphic by Megan Eloise/The Gazelle</em></p><p><em>Editor’s Note: This article was originally published on September 12, 2015.</em></p></div><p>Welcome to college. You will most likely learn more in the next four years than you’ve ever learned in your life. You will traverse countries and cultures and politics and rivers and seas and bridges and mistakes and mindsets. In response to all that traversing, you may realize where your feet are actually planted in this world, or where you want them to be: you may sow yourself, and water your roots until you spread a fine network of root-hair through your precise patch of soil on this Earth. Or, you may become terrified of the very prospect of roots: you may shift with the seasons, as we tend to, a seed borne by summer breezes in a constant state of flux. Both options will leave you with a lot of questions, and many of them you will never resolve. Welcome to that.</p><p>On the subject of roots, remember that the only plants that take root here are very hardy; take care not to let your cactus spikes grow too sharp, because it is easy to have that happen. It is easy to become defensive and thicken your skin to avoid the sunlight and stares of Abu Dhabi. Try not to let that thick skin become too calloused.</p><p>Always remember that you are living in an incredibly unique situation, and when the thought of that or of the glittering city becomes too much, go and stick your toes in the waves and remember that seawater is the same everywhere.</p><p>Try to learn by doing, and not by hearing — it’s okay to make the same mistakes as everyone else, since you never know how hot the stove is until you touch it, and nobody can understand your experiences quite like you yourself can.</p><p>When you go home for your first winter break, treasure it. Mostly, it’s the first and only time you’ll feel like you’re coming back home after a long holiday. Sometimes people’s welcome-home hugs still stretch right around you, able to fully embrace your new-found growth, but often they do not. Often you will be like a tree trunk whose breadth just eludes a child’s grasping finger-reach, and that will be hard. When you leave home, you tend to realize who your true friends are. They may surprise you; go with your instincts, but also don’t be afraid to let go.</p><p>Life is frequently hard to explain, but ours particularly so; you’ll develop an often-required repertoire of vocabulary, a series of flashcards that you can use almost without thinking: “It’s-hot/no-I-don’t-wear-a-burka/yes-there-are-women/no-they’re-not-oppressed/10%/abu-dhabi-not-abu-dubai”, etc, etc. People often have the same curiosities, which means you’ll need more or less the same answers, but take the chance to surprise them and be honest. You’ll probably turn into an avid anti-Orientalist within a few months anyways.</p><p>At some point during college, you’ll realize that you no longer live at home. It took me a year. Then, you will start to wonder a whole bunch of other things and you’ll be surrounded by hundreds of other people all questioning the same sorts of questions and there’ll be a kind of exhilarating delight in that bewildering climate of existential confusion. Don’t get too caught up in the existentialism question though, unless you genuinely want to study it. Our life is complicated enough without confronting the question of whether the world has meaning.</p><p><em>Tessa Ayson is a contributing writer. Email her at feedback@thegazelle.org.</em></p>',
            "image": null,
            "published_at": "2015-09-12T05:58:09.000Z",
            "slug": "dear-freshmen",
            "title": "Dear Freshmen",
            "issueId": "76",
            "category": "commentary",
            "teaser": "Welcome to college. You will traverse countries and cultures and politics and rivers and seas and bridges and mistakes and mindsets.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "post-marhaba-feels"] },
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
            ],
        },
        "post-marhaba-feels": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "karolina-wilczynska"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2015/09/Daniel-1200x594.jpg",
            "html": '<p><img class="wp-image-123631 size-medium" src="//thegazelle.s3.amazonaws.com/gazelle/2015/09/Daniel-1200x594.jpg" alt="Daniel" width="1200" height="594" /></p><p class="wp-caption-text"><em>Illustration by Daniel Obaji/The Gazelle</em></p></div><p><em>Editor’s Note: This article was originally published on September 12, 2015.</em></p><p>In the short time between the university’s Marhaba orientation program and its annual RealAD show, freshmen are given exactly two weeks to experience and explore NYU Abu Dhabi for the first time.</p><p>Representing over 70 countries, NYUAD&#8217;s latest cohort of freshmen is poised at the beginning of an exciting four years. But Marhaba week presents its own challenges and, whether anticipated or not, they can make the first semester at university a difficult adjustment.</p><p>The NYUAD Confessions Page, an online Facebook page where students <a href="//www.facebook.com/NYUAD-Confessions-Page-250320155116643/timeline/">share</a> their thoughts and secrets, has published several anonymous posts about the initial troubles of university life.</p><p>Upset by a perceived inability to connect with new peers, one unnamed freshman wrote about their feelings of loneliness and seclusion. &#8220;I see everyone else planning to go places together and sharing inside jokes, and it just makes me feel a bit like an outsider,&#8221; they wrote.</p><p>The post drew attention from fellow NYUAD students, attracting likes and comments of support.</p><p>Dr. Anita Tieman, a counselor at NYUAD, was not surprised by the student’s struggle to feel a part of the community, especially after the initial frenzy of Marhaba.</p><p>“[Freshmen] had this orientation, where everything was about excitement and getting to know things and learning about new people,” Tieman said. “And all of a sudden you don’t have the same things that brought you together. And so I think everyone experiences this kind of let-down from that initial excitement.”</p><p>This sentiment resonated with other students who had difficulty transitioning from Marhaba to regular university life.</p><p>Junior Ieva Liepuoniute, when asked about her impressions of Marhaba, said the shift could be a somewhat traumatizing one.</p><p>“You were doing all these social things, and now you have to do academics and there is so little time left for social things,” she said.</p><p>She said that the connections she made during Marhaba week weren’t necessarily friendships, but rather temporary acquaintances.</p><p>Friendships, she explained, began to form as people went to classes, joined Student Interest Groups and realized they shared common, more substantial interests.</p><p>“At the end of the day, it’s a long process, and it requires a lot of effort. It’s like academics: the more you study, the more you get out of it,” said Liepuoniute, who re-lived Marhaba last year as an RA for a freshman floor.</p><p>Senior Devin Ó Cuinn noticed that there are exceptions to the rule, such as <a href="//www.thegazelle.org/issue/66/features/marhaba-couples/">couples</a> who get together during Marhaba and last for years. But it is important to realize that usually, both friendships and relationships take time to form.</p><p>Ó Cuinn added that a lot of people, including himself, remember sometimes feeling lonely during freshman year, especially in the beginning.</p><p>“You are completely displaced, in a lot of ways, from everything that you’ve ever done. It’s a big change from high school. It’s also a kind of culture shock for many people,” said Ó Cuinn.</p><p>The excitement of Marhaba and the slowdown that follows can be disorienting, but sophomore and Marhaba organizer Roman Kohut saw the pace as a necessary element of the week.</p><p>“Had Marhaba been done in a more relaxed sort of way, there wouldn’t be a need for [freshmen] to come a week earlier,” said Kohut. “The purpose of it was to make sure that they got to know the deans, got to know the place &#8230; and that all takes time. That’s why [the week] was so packed.”</p><p>Since attending Marhaba is obligatory, students may need to find their own strategies to ease smoothly into the rest of the semester. Apart from the standard wellness services provided by the university, Tieman believes in the power of what she calls “managing one’s mood.”</p><p>As students mature and take responsibility for their own lives, Tieman explained, they also need to figure out what it is that will make them personally feel better, whether that’s talking to someone back home or simply attending the SIG Fair in search of new activities and clubs to join.</p><p>According to Tieman, even though freshmen can be most affected, everyone feels social stress and loneliness at times of significant change, like during study abroad. She suggested that an important technique in combating these feelings is to learn positive self-talk.</p><p>“Part of it is turning the words [in our heads into]: I’m not isolated, I’m just lonely today. So how do I go and not be lonely?’” she said.</p><p>Ó Cuinn also advocated taking time to leave Saadiyat every once in a while.</p><p>“I think if you don’t get out to the city in the first couple of weeks, it’s very hard to get out after,&#8221; he said. &#8220;And I think that’s something that can contribute to this isolating feeling as well.&#8221;</p><p>As a member of REACH, a peer support group on campus, Ó Cuinn is also involved in organizing a series of informal meetings for freshmen. The first took place last Wednesday, and another will be held a week later.</p><p>Liepuoniute, as a former RA, stressed the importance of reaching out to others.</p><p>“Talk to RAs, because we get trained for situations like that and we can really give advice,” she said, adding that she had been a strong proponent of facilitating connections between freshmen on her floor.</p><p>“Don’t get takeaway,” she added. “Go to the cafeteria and talk to people you have never talked to before, even if it’s awkward &#8230; Life is so much better all of a sudden.”</p><p><em>Karolina Wilczynska is deputy features editor. Email her at feedback@thegazelle.org.</em></p>',
            "image": null,
            "published_at": "2015-09-12T05:58:09.000Z",
            "slug": "post-marhaba-feels",
            "title": "Dealing With The Post-Marhaba Comedown",
            "issueId": "76",
            "category": "in-focus",
            "teaser": "Transitioning into real life.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
                { $type: "ref", value: ["articlesBySlug", "visas"] },
            ],
        },
        "the-ad-secrets-challenge": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "the-gazelle-staff"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2015/09/SECRETS-FINAL-1200x599.jpg",
            "html": '<p><em>Editor’s Note: This article was originally published on August 30, 2014.</em></p><p>Though it&#8217;s only a taxi ride away, Abu Dhabi and its knots of streets, alleyways and superblocks — most of which probably don&#8217;t have addresses — can sometimes feel intimidating. But for freshmen and returning students alike, the Eid break offers the opportunity to get out and explore. </p><p>If you&#8217;ve been hoping to familiarize yourself with the city but are unsure where to start, check out the masterlist of The Gazelle&#8217;s series AD Secrets, which covers the lesser-known nooks of the city. </p><p>Grab a friend, grab a taxi and see how many destinations you can tick off before classes resume. </p><p><div class="big-image"> <a href="//thegazelle.s3.amazonaws.com/gazelle/2015/09/Wheat_NicoleLopezDelCarril_5.jpg"><img src="//thegazelle.s3.amazonaws.com/gazelle/2015/09/Wheat_NicoleLopezDelCarril_5.jpg" alt="Nicole Lopez del Carril/The Gazelle" width="800" height="533" class="size-full wp-image-128601" /></a> </div><em>Nicole Lopez del Carril/The Gazelle</em></p><h3>FOOD FOR THOUGHT</h3><ul><p>Try <a href="//www.thegazelle.org/issue/38/features/ad-secrets-agemono/">halo-halo</a>, a popular Filipino dessert of shaved ice and jello, at Agemono. </p><p>Go for mango lassis and people-watching at <a href="//www.thegazelle.org/issue/34/features/ad-secrets-salaam-bombay/">Salaam Bombay</a>. </p><p>Splurge for all you-can-eat sushi at <a href="//www.thegazelle.org/issue/61/features/ad-secrets-4/">Aquarium</a>, a seafood restaurant overlooking the Yas Marina. </p><p>Visit locally-owned<a href="//www.thegazelle.org/issue/22/features/ad-secrets-grand-central/"> Grand Central</a> and order the first, and possibly only, cheese steak in the UAE. </p><p><a href="//www.thegazelle.org/issue/24/features/secrets/">WhEAT</a> offers freshly-baked bread  and a range of cakes, all less than 15 AED. Make sure to taste their Turkish coffee ice cream. </p><p>Back from a semester in New York and missing your morning bagel? Check out the <a href="//www.thegazelle.org/issue/18/features/ad-secrets-the-bagel-bar/">Bagel Bar</a>.  </p><p>Lebanese manakeesh — flat breads loaded with cheese, zataar and other tasty flavors — is especially good at the somewhat obscure <a href="//www.thegazelle.org/issue/25/features/farah/">Al Farah Pastry and Grill</a>.</p><p><a href="//www.thegazelle.org/issue/32/features/48441/">The Cheese &#038; Pickles Centre</a> sources the strongest flavors of the Mediterranean, from Egyptian cheese to Italian salami. Check out their 40 different kinds of olives.  </p><p><a href=" //www.thegazelle.org/issue/64/features/ad-secrets-6/">The Raw Place</a> is possibly one of the best destinations in Abu Dhabi for a healthy treat. Sample their chia pudding and cold-pressed juice. </ul><p><div class="big-image"><img src="//thegazelle.s3.amazonaws.com/gazelle/2015/09/books_self_long-600x312.jpg" alt="Photo by Nicole Lopez del Carril/The Gazelle" width="600" height="312" class="size-full wp-image-128581" /></div><em>Nicole Lopez del Carril/The Gazelle</em></p><h3>GO WANDERING</h3><ul><p>Bring a picnic and go for a stroll through Abu Dhabi&#8217;s scenic <a href="//www.thegazelle.org/issue/27/features/mangroves-2/">mangroves</a>.</p><p>Explore Iranian spices, loose Moroccan tea and oils from Pakistan at <a href="//www.thegazelle.org/issue/11/features/secrets901/">Wadi A’z Zafran</a>.  </p><p>Room feeling bare? Buy a bromeliad from the <a href="//www.thegazelle.org/issue/14/features/ad-secrets-souk/">plant souk</a>. </p><p>Buy some burgers and veggies, and go for a grill at <a href="//www.thegazelle.org/issue/23/features/secretspark/">Khalidiya Park</a>.</p><p>At the <a href="//www.thegazelle.org/issue/39/features/womens-handicraft-centre/">Women&#8217;s Handicraft Centre</a>, you&#8217;ll find hand-crafted fabrics, weaved carpets and beaded jellabas. </p><p>Put away your class readings and buy yourself a novel for the break at Abu Dhabi&#8217;s <a href="//www.thegazelle.org/issue/15/features/ad-secrets-books/">only used bookstore</a>.</ul><h3>SUGAR FIX</h3><ul><p>Go for Italian hot chocolate at <a href="//www.thegazelle.org/issue/44/features/ad-secrets-3/">Maya La Chocolaterie</a>. </p><p><a href=" //www.thegazelle.org/issue/30/features/albaba-secrets/">Al Baba Sweets</a> offers the best delicacies from the streets of Lebanon. They also serve homemade ice cream bars, which you can get dipped in chocolate.</p><p>Become a honey connoisseur for a day, and browse through all the different colors, flavors and consistencies at <a href="//www.thegazelle.org/issue/31/features/queenhoney/">Food Queen Honey</a>. </p><p>Have the perfect <a href="//www.thegazelle.org/issue/20/features/ad-secrets-dates/">date</a> at this cheap Mina Port souk.</ul><p><div class="big-image"><img src="//thegazelle.s3.amazonaws.com/gazelle/2015/09/SECRETS-FINAL-1200x599.jpg" alt="Nicole Lopez del Carril/The Gazelle" width="1200" height="599" class="size-full wp-image-128611" /></div><em>Nicole Lopez del Carril/The Gazelle</em></p><h3>PRACTICALITIES</h3><ul><p>If you&#8217;re sick of convenience store ramen, take a culinary class from <a href="//www.thegazelle.org/issue/35/features/ad-secrets-lanas-partiperfect/">Lana&#8217;s Partiperfect</a>. </p><p>For the brave at heart, Gold Moon Beauty Salon offers <a href="//www.thegazelle.org/issue/16/features/salon/">fire facials</a>.</p><p>One of the more underrated shisha places of Abu Dhabi, <a href="//www.thegazelle.org/issue/21/features/ad-secrets-la-fontana/">La Fontana</a> offers a terrace view and fresh juices. </p><p>Or you can go to <a href="//www.thegazelle.org/issue/36/features/secrets-5/">Mirage Marine</a> for Shiazo shisha, which is made from flavored steamed stones, and is supposed to be better for your health.</ul><h3>CAFÉ CRAWL</h3><ul><p>Grab some hot chocolate and a slice of spiced ginger cake for an Eid study session at <a href=" //www.thegazelle.org/issue/29/features/secrets-4/">Leopold of London</a>.</p><p>Check out the vintage kitsch vibe — and free Wi-Fi — at café <a href="//www.thegazelle.org/issue/26/features/secrets-2/">Shabby Chic</a>.</p><p>Visit <a href="//www.thegazelle.org/issue/13/features/ad-secrets-2/">Zyara Café</a>, a favorite of the Sama Tower generation, and try some of its amazing labneh. </p><p>Get your<a href="//www.thegazelle.org/issue/19/features/ad-secrets-argo/"> bubble tea</a> fix at Argo Tea.</ul><p><em>Special thanks to Nicole Lopez del Carril, class of 2014. Send your thoughts on this article to feedback@thegazelle.org.</em></p>',
            "image": null,
            "published_at": "2014-08-30T05:58:09.000Z",
            "slug": "the-ad-secrets-challenge",
            "title": "The AD Secrets Challenge",
            "issueId": "76",
            "category": "off-campus",
            "teaser": "A masterlist of Abu Dhabi's hidden gems. How many can you do?",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "art-in-ad"] },
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
            ],
        },
        // "advice-to-incoming-first-years": {
        //     "authors": [
        //         { $type: "ref", value: ["authorsBySlug", "lina-elmulsa"] },
        //     ],
        //     "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/@advice-for-freshmen.jpg",
        //     "html": "",
        //     "image": null,
        //     "published_at": "2016-08-21T05:58:09.000Z",
        //     "slug": "advice-to-incoming-first-years",
        //     "title": "Personal Essay: Advice to Incoming First Years",
        //     "issueId": "76",
        //     "category": "commentary",
        //     "teaser": "How to be a tea and coffee person.",
        //     "related": [
        //         { $type: "ref", value: ["articlesBySlug", "post-grad"]},
        //         { $type: "ref", value: ["articlesBySlug", "whitewashing-hollywood"]},
        //     ],
        // },
        "returning-to-nyuad": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "annie-bauer"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/returning-to-saadiyat.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/returning-to-saadiyat.jpg'></img></p><p><em>Illustration by Reine Defranco</em></p><p>The computer-generated images of Saadiyat Island are awash in green grass and palm fronds, crisscrossed by paved highways and flush with tourists and residents. It boasts prestigious museums like the Louvre and the Guggenheim, eye-catching structures designed by famous foreign architects. It teems with life.</p><p>Of course, that's not what you see outside your dorm window. That's the future. For now, most of Saadiyat Island is under construction or remains undeveloped desert. Amidst this setting, NYU Abu Dhabi's Saadiyat campus looms out of the dust, a cluster of pale buildings huddled in the sand. It looks strange and isolated. During the day, passersby unfamiliar with NYUAD might wonder if it is inhabited.</p><p>The late U.S. Senator and sociologist Daniel Moynihan is widely <a href='//www.timeshighereducation.com/comment/opinion/nyu-president-on-global-universities-idea-capitals-and-talent-snowballs/2004033.article'>quoted</a> as saying that the key to creating a world-class city is to &#34;build a great university and wait 200 years.&#34; We might be the great university Moynihan spoke of, but we don't have 200 years to wait, even with the famously rapid rate of construction in the UAE. Instead we must think about what makes this place one that we return to, only six years in the making.</p><p>I finished my second year of university in Buenos Aires, Argentina. If all goes well and I manage to churn out a capstone and pass the rest of my courses, I'm halfway done. The idea that my time at NYUAD was limited must have had an impact on me because as relieved as I felt to be finished with finals, I still flew from the other side of the world to come back to campus for a summer course. There were about three days in between when I had no homework and felt blissfully unencumbered, ready to sail off into a summer free of academics. Yet, as soon as I landed in Abu Dhabi the feeling of comfort and familiarity was unmistakable &mdash; I was home.</p><p>The course was very demanding. I got stressed and nervous and lost sleep because of exams, just as I had expected to. But living on campus again, I was back in my element. I reveled in the 40 degree Celsius heat and blinding sunshine. After four months in a homestay in Buenos Aires, I felt grateful for a new, clean dorm room and the safety of Abu Dhabi&rsquo;s streets. During the summer term, friends congregated in the dining hall over hummus and wraps from the Grab and Go counter, just as they had always done. The Library Caf&eacute; welcomed us with its sunlit corners for tea and studying. We all got sweaty just from walking from our dorms to the gym. These are our small traditions on campus, the kinds of common habits a student body develops and bonds over at university, and they are an anchoring comfort.</p><p>What truly made the return to Saadiyat a homecoming, though, were friends. The only reason I can write this kind of essay is because of long discussions with close friends over shisha or in the backseats of cabs, a product of the critical urge we have to talk about how NYUAD is changing and how it is changing us. Without friends like this, I would not fully understand myself, and these ideas and questions would only fester in my mind and serve to isolate me even further on this campus surrounded by sand. <br /><br />As much as our campus appears stark and uninhabited from the outside, returning to Saadiyat reminded me that I am an insider. I do inhabit this campus, and despite semesters away, January Term courses and breaks spent elsewhere, my friends are my roots. The Gazelle published a special issue last fall about mental health at NYUAD, and time and again, students used those pages to emphasize the need for more connection and support among friends. The people that make up NYUAD and the relationships forged in these peculiar circumstances are what give this place meaning, and what keeps us all coming back. <br /></p><p><em>Annie Bauer is Deputy Copy Chief. Email her at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "returning-to-nyuad",
            "title": "Returning to NYUAD",
            "issueId": "76",
            "category": "commentary",
            "teaser": "Amidst the transience of our student body, what anchors us to our home campus?",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "letter"]},
                { $type: "ref", value: ["articlesBySlug", "picking-courses"]},
            ],
        },
        "art-in-ad": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "larayb-abrar"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/Art-in-AD.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/Art-in-AD.jpg'></img></p><p><em>Graphic by Grace Huang</em></p><p><strong>1. Etihad Modern Art Gallery/ The Art House</strong></p><p>Located in the Al Bateen area, the <a href='http://www.etihadmodernart.com'>Etihad Modern Art Gallery</a> showcases work from both well-established and upcoming Emirati and international artists. In the past, the Etihad Modern Art Gallery has organized art shows and local heritage exhibitions. Connected to it is the Art House Caf&eacute;, which embodies a unique artistic concept wherein furniture is made into art using waste materials. The Art House Caf&eacute; also hosts monthly poetry open mics. &nbsp;</p><p><strong>2. Abu Dhabi Art Hub</strong></p><p>The <a href='http://www.adah.ae'>Abu Dhabi Art Hub</a> is a community of artists here in Abu Dhabi. Every month the Hub showcases local and international artwork. Themes include the identity of the UAE, ancient cultures and islander culture. Exhibitions are set up in different locations all over Abu Dhabi. Check out the Abu Dhabi Art Hub&rsquo;s <a href='https://www.facebook.com/Abu-Dhabi-Art-Hub-1375196236120485/?fref=ts'>Facebook page</a> for more information on events and exhibitions.</p><p><strong>3. Warehouse 421</strong></p><p><a href='http://www.warehouse421.ae/en/'>Warehouse 421</a>, launched in 2015, transformed an industrial warehouse in Mina Zayed into a contemporary art space. The Warehouse is an all-purpose artistic platform that organizes film screenings, workshops, performances, panel discussions and exhibitions. Much of the artwork showcased in Warehouse 421 focuses on the reimagination and changed perceptions of common ideas. &nbsp;</p><p><strong>4. Salwa Zeidan Gallery</strong></p><p><a href='http://salwazeidangallery.com/'>Salwa Zeidan</a> is a contemporary art gallery located at the St. Regis Saadiyat Island Resort. The gallery features the creations of well-known international and Middle Eastern artists working across a range of media, from paintings, installations and performances to sculptures and performance art.</p><p><strong>5. NYUAD Arts Center</strong></p><p>Not in the mood to get off campus, but still want to engage with the cultural life of Abu Dhabi? The <a href='http://www.nyuad-artscenter.org/'>NYUAD Arts Center</a> almost always has something going on. Once a month, the Arts Center hosts Rooftop Rhythms, a poetry open mic and slam. The theatre department also showcases student work and productions. Additionally, there are musical performances ranging from jazz to rock throughout the year. </p><p><em>Larayb Abrar is Features Editor. Email her at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "art-in-ad",
            "title": "Five Places in AD To See Art",
            "issueId": "76",
            "category": "off-campus",
            "teaser": "Tired of the malls, desert and frequent IKEA trips? The Gazelle lists five places to explore art in Abu Dhabi.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-ad-secrets-challenge"] },
                { $type: "ref", value: ["articlesBySlug", "picking-courses"]},
            ],
        },
        "post-grad": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "krushika-uday-patankar"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/life-after-graduation.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/life-after-graduation.jpg'></img></p><p><em>Illustration by Reine Defranco</em></p><p>April 26, 2015<br>10 p.m.<br>Saadiyat Island</p><p>It is my birthday and I am in the Black Box of the NYU Abu Dhabi Arts Center, close to collapsing. I&rsquo;m in the middle of my second to last technical rehearsal, very obviously breaking down as I am unable to rehearse my own play, while everyone else, apart from my dedicated and loving team, is outside jamming and dancing to Just A Band. Lizzy, my tech manager, tells me, &ldquo;Go home Krush. You&rsquo;re not going to get much done within the next hour. Get some rest and make the last tech worth it.&rdquo;</p><p>My mom sent me a cake to celebrate turning 22. There is a picture somewhere on Facebook where I&rsquo;m holding that cake and I can&rsquo;t believe what I look like in it. I&rsquo;m smiling but my eyes tell a different story &mdash; I am sad and terrified of everything coming my way, in that moment frozen in time.</p><span class='section-break'></span><p>The day I graduated was probably one of the saddest days of my life. I made faces, walked successfully in my heels, sang Learn to Love and Live and smiled with everyone. Outwardly, I was fine because I was graduating. On the inside, I was a drowning ship. My friends were going away to graduate school on scholarships and were going to start fancy jobs after graduation &mdash; everyone seemed to have a plan. All I could think of was how my dad, who should have been there, wasn&rsquo;t. All I could worry about was when my dad would call and if I would be able to find the strength to not break my phone into pieces. All I could feel was the constant burden of keeping it together on the one day that was supposed to be mine.</p><p>After graduating, I stayed on campus until July. To say that those hot, sunny months of Abu Dhabi were the darkest I&rsquo;ve seen in my life is an understatement of gross proportions. I had a comfortable roof over my head, a sufficient supply of food and a summer research position that paid me very well but I was depressed &mdash; dreadfully depressed. Anyone who knew me then knew this. My world had broken apart before my last January Term because of my parents deciding to split, causing every plan I had for after graduation to fall through. All my friends were managing their capstones and job applications during their last semester. I was scrambling to make it from one day to another without considering dropping out so close to the end.</p><p>I didn&rsquo;t find a job until January of this year. In the span of August 2015 to January 2016, I was practically friendless in my hometown, sitting at home, sending out multiple versions of the same resume and cover letter to anyone who cared to look, while I dealt with a silent and systematic ostracization of my mother and me due to my parents&rsquo; imminent divorce. I watched all my friends score great jobs and have a fabulous time in graduate school while all I did was sit at home, waiting for an employer somewhere, anywhere, to notice that I was worthy of employment.</p><p>And it killed me. This wasn&rsquo;t the narrative I expected, this wasn&rsquo;t the narrative I ever wanted to be telling anyone. But the truth is this &mdash; NYUAD is gorgeous and beautiful. The real world, not so much. Nobody wants to tell you this narrative because it doesn&rsquo;t match up to the optimism of the videos they play at graduation. I lost touch with professors I cared about, I disconnected from my friends because their Facebook posts made me sink deeper. I wanted to be in London, New York, Sydney, Mumbai, anywhere. I didn&rsquo;t want to be in Muscat and I was sitting here, unemployed, depressed and far from where I dreamed I would be after finishing four years in a place I came to love more than life itself.</p><span class='section-break'></span><p>April 26, 2016<br>11.30 p.m.<br>Muscat</p><p>It is my birthday and I am driving alone on the Qurum-Darsait flyover, belting out Beyonc&eacute;&rsquo;s Sorry because Lemonade just dropped and why wouldn&rsquo;t I? It&rsquo;s Beyonc&eacute;. I&rsquo;m jamming to the music, my middle fingers waggling as I follow the lyrics &mdash; middle fingers up, put &rsquo;em hands high &mdash; before resting back on the steering to keep it steady because my car is just shy of touching 120 kmph on the dashboard.</p><p>I&rsquo;ve got half an hour left until I stop becoming special and all I&rsquo;m hoping for is the road to extend, magically, so that I don&rsquo;t have to go home. </p><span class='section-break'></span><p>I learned how to drive about seven months ago. I&rsquo;ve always been terrified of vehicles, always hated the idea of driving anything after nearly crashing my cousin&rsquo;s scooter into an old man&rsquo;s car as a 13-year-old. But when you&rsquo;re in Muscat, your ticket to freedom is driving and there&rsquo;s no other way of getting around it. And so, I learned. I took baby steps &mdash; I reached out to any contacts that I had, kept driving around, kept meeting people through the only friend I had in the city. Today, approximately a year later, I&rsquo;m happy &mdash; a statement I was convinced I&rsquo;d never be able to say. I have a job that teaches me everyday, I have a small but faithful group of friends I passive smoke with religiously and a life that is hectic but filled with things that help me work toward my goals, despite the fact that money is sometimes short and time is sometimes too slow.</p><p>Life at NYUAD was like being a princess in a castle where everything actually worked. NYUAD was a well oiled machine with its wheels moving smoothly enough, save for a few solvable glitches here and there. There was a solution to everything &mdash; okay, well almost everything. Life after graduation has been a long, long drive that doesn&rsquo;t seem to end. You stumble a lot figuring out when to use the brakes and when to use the accelerator and then somehow you coordinate the two. You can&rsquo;t stop midway because that&rsquo;s going to cause an accident. You have to keep driving until you get where you are. Potholes will get your car stuck in a rut and sometimes, your car will simply break down. Most times, you&rsquo;ll have no clue where you&rsquo;re going. Most times, you&rsquo;ll want to hit the brakes but you won&rsquo;t be able to. Often, you&rsquo;ll land up in the wrong place and you&rsquo;ll need to turn back to get to the right place. Some people will hop in for a ride with you and leave on the way. You&rsquo;ll have some great conversations about the road ahead, about the best kind of music. You&rsquo;ll meet people at pit stops that will change how you feel about the road ahead. And the best part of it all is that you&rsquo;ll get really tired along the way but you&rsquo;ll keep going.</p><p>And so, I learned to drive. Drive fast. Drive away. Take sharp turns. Be a little reckless, but only just a little bit. I learned how to drive away from NYUAD but I&rsquo;ve got some sand in the back of my car to remind me that I was there. I wish I could say, &ldquo;I never left.&rdquo; But that&rsquo;s not true. I left, in the wake of sadness, and found my little corner of happiness as I drove away, back to my hometown. I drove into the rough underbelly of the real world and I am grateful for the darkness I left in. I found the light a long year later and it can get really bad, but it can be really good too, if you only realize that your heart is truly strong and your education gave you something beyond just a degree &mdash; it gave you the freedom to think, to feel and to love.</p><p><em>Krushika Patankar is a contributing writer. Email her at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "post-grad",
            "title": "Driving Into My Life",
            "issueId": "76",
            "category": "commentary",
            "teaser": "Be a little reckless, but only just a little bit.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "whitewashing-hollywood"]},
                { $type: "ref", value: ["articlesBySlug", "nyuad-survival-guide"]},
            ],
        },
        "changes-with-marhaba": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "suka-naja"] },
                { $type: "ref", value: ["authorsBySlug", "taj-chapman"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/changes-to-marhaba.png",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/changes-to-marhaba.png'></img><p><em>Graphic by Alejandra Trejo/The Gazelle</em></p></p><p>Aug. 19 marked the beginning of the annual Marhaba event for the incoming Class of 2020 at NYU Abu Dhabi. Although the size of the incoming class hasn&rsquo;t increased drastically since last year, the Marhaba program has undergone some major changes.</p><p>A large class size of 325 freshmen is likely to result in the use of an enormous amount of resources which, in turn, will generate a large quantity of waste. This year, therefore, one of the main objectives when planning Marhaba was to promote the idea of sustainability and inculcate a sense of responsibility among freshmen as they enter the NYUAD community.</p><p>In the past, students have received goodie bags &mdash; referred to as NYUAD Swag Bags &mdash; containing items useful for their transition to life at university. This year, these items include reusable take-away boxes and water bottles. Boxes of plastic water bottles around campus have been replaced by water coolers so that students can refill their water bottles instead.</p><p>Another major change to Marhaba is its duration. According to feedback from last year, many students felt that the events were too condensed in the one-week period. In response, the Marhaba team spread everything out over 10 days so that students are not overwhelmed. In addition, the Marhaba team came up with student-led optional workshops to give students the chance to learn about various aspects of student life at NYUAD. These workshops included Dining at NYUAD 101, How to Make Your Dorm Feel Like Home and Budgeting. While these workshops are useful in their own right, they are also intended to encourage greater interaction between the freshmen and the Marhaba leaders, a group of 16 upperclassmen who are helping run Marhaba.</p><p>The effort to encourage interaction between freshmen and upperclassmen continues with the final Marhaba activity, the Marhaba Carnival. Marhaba Carnival will act as an introduction to the College Parent Program, an initiative started by 2015-16 Freshman Class Representative Chris Wheeler. In this program, two upperclassmen are paired with up to five incoming freshmen to act as their student mentors.</p><p>Overall, this year's Marhaba program aims to create a balance between freshmen getting to know each other and becoming acquainted with their new community.</p><p><em>Saka Naja and Taj Chapman are contributing writers. Email them at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "changes-with-marhaba",
            "title": "A Rundown on Marhaba 2016",
            "issueId": "76",
            "category": "on-campus",
            "teaser": "Annual welcome focuses on sustainability and interaction.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "dear-freshmen"] },
                { $type: "ref", value: ["articlesBySlug", "visas"] },
            ],
        },
        "visas": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "connor-pearce"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/visas.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/visas.jpg'></img><p><em>Illustration by Tayla McHardie</em></p><p>Prior to commencing their studies at NYU Abu Dhabi, at least three students admitted to the Class of 2020 have had their visas rejected or delayed by the UAE. This means that these students will not be able to begin their studies until January Term at the earliest.</p><p>This is not the first time that students have had to delay their studies due to visa issues. In a Facebook thread discussing the delay, students from the Class of 2018 and the Class of 2019 also shared their experiences of having their visas delayed or rejected. All the students who said that their visas had been previously delayed were nationals of countries in the Middle East and North Africa, including Turkey, Lebanon and Egypt.</p><p>Incoming freshman Doğukan Avcı and rising junior Majed BouGhanem both suggested that their nationalities, Turkish and Lebanese respectively, were the reason for their visas being delayed.</p><p>In an email to The Gazelle, the Dean of Students Kyle Farley wrote, 	&#34;It has not been our experience that all students from any specific country will consistently experience a delay with visa processing, so we cannot make any assumptions about who will experience a delay in their visa.&#34;</p><p>Tunisian alumnus Imen Haddad had high praise for the university&rsquo;s response and spent the beginning of the fall semester in New York before being flown to Abu Dhabi when her visa was approved 10 days later.</p><p>&ldquo;I was amazed by the support and special care that NYUAD staff and faculty had offered me throughout that process, and I realized that this university was the best fit for me. I received daily phone calls from the [then] Dean of Students, Julie Avina, and from other admissions staff,&rdquo; wrote Haddad.</p><p>In contrast to Haddad's experience, Avcı was only offered the possibility of commencing his studies in J-Term. Similarly, BouGhanem was given the choice of either starting during J-Term or attending NYU Polytechnic &mdash; now known as NYU Tandon &mdash; but without the financial aid that was offered to him to attend NYUAD.</p><p>Farley noted, &#34;We work closely with the student to identify alternative solutions &mdash; which include starting school in the spring semester or deferring their admission until the following academic year. It is not an option for an NYUAD student to first begin their studies in New York as our priority is integrating the student into the NYUAD community as soon as their visa is approved.	&#34;</p><p>Farley also noted that he personally spoke with each student experiencing a delay. 	&#34;I am impressed with how understanding and patient they have been,	&#34; he wrote.</p><p>In a written conversation with The Gazelle, Avcı noted, &#34;This is not an incident that would make me change my university decision.&#34; Like Haddad, Avcı went on to praise the university&rsquo;s response. He also praised the NYUAD student body for the support he had received from them, saying, &#34;The aid I received from students was the main morale booster. The support I acquired made me feel [like] a part of the NYUAD community. &rdquo;&nbsp;</p><p>BouGhanem had less praise for the university's response; in written correspondence, BouGhanem noted that the &#34;complete lack of updates didn&rsquo;t help.&#34; He was disenchanted with NYUAD, and felt that the process that he went through demonstrated the distance between the ideals of the global university and the realities of citizenship.</p><p>	&#34;NYUAD is a place that respects and appreciates diversity and the idea of global citizenship, but I just found my situation very ironic; one can get accepted and funded, but can&rsquo;t actually go there because your entry relies on a booklet that apparently defines who you are,&#34; wrote BouGhanem.</p><p>Haddad saw the university as breaking down the barriers that are imposed by passport regulations, noting, &ldquo;You have to work with what you got to get the best outcome and try to affect as many people as you can, that&rsquo;s what NYUAD is doing one student visa at a time.&rdquo;</p><p>Timing was also an issue for students, who only found out about the visa delays after having rejected alternative offers in accordance with academic integrity conventions and the Common Application&rsquo;s regulations.</p><p>&#34;By the time I was told of the delays, I had lost all the alternatives &mdash; I had rejected my other offers beforehand &hellip; Of course if I had known of the high probability of the four months delay, I would have left my other choices open,&#34; said BouGhanem. </p><p>Farley also identified this as an issue, writing, 	&#34;We recognize that students will have likely turned down offers at other institutions, so we do everything we can to ensure they can attend NYUAD.&#34;</p><p>Avcı suggested that students should be told of the possibility of their visas being delayed prior to beginning the visa process, if not during Candidate Weekend.</p><p>Farley noted, &#34;We are looking at how to best manage expectations around this process for future students as the class sizes increase.&#34;</p><p><em>Connor Pearce is editor-in-chief. Email him at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "visas",
            "title": "Students left waiting due to visa delays",
            "issueId": "76",
            "category": "on-campus",
            "teaser": "At least three freshmen have had their visas delayed and may not start with the rest of their class.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "dear-freshmen"] },
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
            ],
        },
        "whitewashing-hollywood": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "joey-bui"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/meganeloisejoeyfixed.gif",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/meganeloisejoeyfixed.gif'></img></p><p><em>Graphic by Megan Eloise/The Gazelle</em></p><p>There are many things wrong with whitewashing &mdash;&nbsp;a term for Hollywood&rsquo;s tendency to massively underrepresent people of color in its movies. Asians receive only <a href='http://annenberg.usc.edu/pages/~/media/MDSCI/CARDReport%20FINAL%2022216.ashx'>1% of lead roles</a> in Hollywood, making them the most invisible among the large minority groups in the U.S. 2.7% of <a href='https://www.facebook.com/ajplusenglish/photos/a.409210322553814.1073741828.407570359384477/690215501119960/?type=1&amp;theater'>lead roles</a> go to Latino actors and 14.3% go to black actors. Yet what particularly hurts about the way Asians are kept off-screen is that it reveals how people treat Asians as weak and easy to ignore.</p><p>Rather than roles that see Asians as human, Asians are often cast as stereotypes: the emasculated Asian man or the submissive, sexually objectified Asian woman. Both these tropes have one attribute in common: weakness. Ken Jeong as Mr Chow in The Hangover is emasculated &mdash; an extensive bit is done on how small his genitals are; he is absurd, barely intelligible and uses an exaggerated Chinese accent when he does speak. When I heard that Olivia Munn, a half-Chinese actor, was playing Psylocke in X-Men: Apocalypse, I was excited for a year in anticipation. Finally, I thought, an Asian woman gets a major superhero role. Finally, someone to show Asian-American girls that they can be heroes too, rather than just sidekicks.</p><p>But Olivia Munn&rsquo;s Psylocke was a disappointment. She had about three lines and stood around as a prop for most of the movie. Another silent and hypersexualized Asian character. All the media had to say about her role was how she <a href='http://www.cinemablend.com/new/Olivia-Munn-Needs-Lube-Squeeze-Her-Tight-X-Men-Costume-72545.html'>used</a> lubricant to squeeze into her skintight costume.</p><p>Forms of discrimination against Asians in the U.S. are sometimes accepted even when they would be seen as outrageous against other minorities. For example, as the criticism of whitewashing reached a high with the 2016 #OscarsSoWhite controversy &mdash; leading to protests and celebrities like Will Smith boycotting the ceremony &mdash;&nbsp;Chris Rock <a href='http://www.nytimes.com/2016/03/01/movies/chris-rocks-asian-joke-at-oscars-provokes-backlash.html'>still made use</a> of racist Asian stereotypes while hosting the ceremony. He herded three small Asian children onstage and introduced them as accountants, playing on the stereotype that Asians are nerdy, silent and good at math. While Rock was scathing about racism against African-Americans, Asians, as usual, didn&rsquo;t seem to matter. This double standard operates on the same, tired belief that Asians are easy to bully.</p><p>Jokes based on racial stereotypes can be funny, but it wasn&rsquo;t so funny during the Oscars because Asians were not represented as human &mdash; or equals &mdash; anywhere else in the ceremony. Rock&rsquo;s bit might not have been as offensive if Asians were not treated like passive objects all the time on the public stage. Flatly representing Asians as docile, silent and ultimately inferior in their need for representation is further damaging to the cause of racial equality. </p><p>Far too many times to count, white actors have been cast as Asian characters. But criticisms leveled against directors and producers who cast white actors for Asian roles are often waved away as annoying and ultimately unimportant. Take the casting of Scarlett Johansson as the Japanese character Major Kusanagi in the anime Ghost in the Shell. Leaked emails from Paramount showed that producers had brainstormed ways to <a href='http://screencrush.com/ghost-in-the-shell-whitewashing-scarlett-johnasson-vfx/'>digitally edit</a> Asian features onto Johansson &mdash; &nbsp;a digital yellowface that would be unimaginable today, for example, in the case of black features edited onto a white actor.</p><p>A common <a href='https://www.theguardian.com/film/2016/apr/18/max-landis-denies-defence-of-scarlett-johansson-ghost-in-the-shell'>excuse</a> for castings such as Johansson's is that no Asian actress has enough star power to play these roles and movies need star power to make money &mdash; that&rsquo;s just how the industry works. Producer Steven Paul also insists that he sees Ghost in the Shell as international and not Japanese. The same kinds of responses were seen when Emma Stone played a half-Chinese woman in Aloha, when white actors played lead Egyptian characters in Exodus: Gods and Kings and when Tilda Swinton was <a href='http://mobile.nytimes.com/2016/04/27/world/asia/china-doctor-strange-tibet.html'>chosen</a> <a href='http://mobile.nytimes.com/2016/04/27/world/asia/china-doctor-strange-tibet.html'>last month </a>to play an originally Tibetan monk in Doctor Strange. In Swinton&rsquo;s case, the producers wrote out the monk&rsquo;s Asian heritage in the script and made the character white, while still placing him in Buddhist temples in Asia &mdash; whitewashing if I ever saw it. The director&rsquo;s <a href='http://mobile.nytimes.com/2016/04/27/world/asia/china-doctor-strange-tibet.html'>defence</a> is really bizarre: he suggests that by being liberal in terms of gender, he could get away with the race problem.</p><p>Saying that this is just how the industry works is the laziest excuse for directors and producers who want to dodge the blame. It is pathetic to dismiss whitewashing as something happening outside of your control, leaving you helpless against it. Producers and directors of major Hollywood movies: you are powerful agents of the industry. You are making the decisions on whether to cast Asian actors or not. You are the industry. There are so few Asian stars in Hollywood because you never give them a chance in the first place. And the worst irony of all is that, if only you cast aside your prejudice, diverse casting could actually help you make more money, as this <a href='http://www.bunchecenter.ucla.edu/wp-content/uploads/2015/02/2015-Hollywood-Diversity-Report-2-25-15.pdf'>recent study</a> suggests. </p><p>And unfortunately, when you fail us, it matters. It matters because this casting aside of Asian actors in movies mirrors and perpetuates the way that Asian-Americans are kept invisible and unheard in the U.S. It matters because for Asian children, dressing up for Halloween so often means dressing up as white characters. It matters because Asian children grow up surrounded by popular images that tell them they never get to be the main character, never the hero, never very important &mdash; sometimes not even fully human. It matters beyond the U.S. because people all over the world watch Hollywood movies and the way they see &mdash; no, don&rsquo;t see &mdash; Asians, can affect how they view Asians in reality. It matters because we fight the silencing and the undermining of Asians everyday. &nbsp;</p><p>Asians are speaking up. The fanmade <a href='http://starringjohncho.com/'>#StarringJohnCho</a> campaign photoshopped Asian American actor John Cho onto movie posters such as those of James Bond and Iron Man to show that it is not unimaginable or ridiculous to see Asians as leads. Cho has supported the campaign, <a href='http://mobile.nytimes.com/2016/07/24/movies/john-cho-sulu-of-star-trek-beyond-navigates-a-beckoning-universe.html'>saying</a>, &ldquo;Movies may be as close to a document of our national culture as there is; they&rsquo;re supposed to represent what we believe ourselves to be. So when you don&rsquo;t see yourself at all &mdash; or see yourself erased &mdash; that hurts.&rdquo; Aziz Ansari&rsquo;s show Master of None <a href='http://www.bustle.com/articles/122532-aziz-ansaris-master-of-none-episode-indians-on-tv-gets-representation-painfully-right'>shows</a> how producers can want one Indian actor as a token minority &mdash; but add one more Indian actor and it&rsquo;s not OK because it becomes a so-called Indian show. The TV show Fresh off the Boat features Asians as a real family &mdash; a rare find &mdash; and its lead actress Constance Wu has become increasingly <a href='https://twitter.com/ConstanceWu/status/759086955816554496'>fierce</a> about the underrepresentation of Asians in Hollywood. Mindy Kaling is an all around boss &mdash; producer, director, creator and main star of her show &mdash; &nbsp;and in Agents of S.H.I.E.L.D. Ming-Na Wen kicks ass, literally. </p><p>Asians are not easy to bully. Perhaps a reason we haven&rsquo;t always been too vocal is because we know that the U.S. has problems with race more serious than ours &mdash; African Americans face much more damaging discrimination. But silence is no longer an option because it encourages others to treat Asians as jokes, as irrelevant.</p><p><em>Joey Bui is a contributing writer. Email her at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "whitewashing-hollywood",
            "title": "How Whitewashing Treats Asians as Easy to Bully",
            "issueId": "76",
            "category": "commentary",
            "teaser": "The poor depiction of Asians in Hollywood perpetuates discrimination.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "nyuad-survival-guide"]},
                { $type: "ref", value: ["articlesBySlug", "letter"]},
            ],
        },
        "letter": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "connor-pearce"] },
                { $type: "ref", value: ["authorsBySlug", "khadeeja-farooqui"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2015/12/EDITOR-LETTER-1200x594.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2015/12/EDITOR-LETTER-1200x594.jpg'></img></p><p><em>Graphic by Megan Eloise/The Gazelle</em></p><p>School hasn&rsquo;t started but Marhaba 2016 is in full swing at NYU Abu Dhabi. The feeling of getting caught up in a new endeavor is one that we should all cherish, and for many of us, the fresh faces, the bright Marhaba flags, the purple lanyards and the first weeks of a new semester can remind us of what it felt like to be part of that initial rush. New friendships were formed, new places were discovered, a new city was explored and the whole world seemed to have opened its doors to us.</p><p>However, this feeling of newfound independence and the idea that the entire world is at our feet can be blinding, and in the rush to take up everything that is on offer, we can miss the structures and dynamics that shape what goes on around us. The Gazelle, now approaching its fourth year, hopes to be a place where the bigger questions can be asked &mdash; questions that will encourage us, as a student body, to pause and look at what&rsquo;s going on around us, what impacts us and what we do. And moreover, ask why.</p><p>These questions can range from Supriya&rsquo;s questioning of the academic plan to Annie&rsquo;s queries about how a barely built Saadiyat Island can feel like home to Krushika&rsquo;s explanation of the sudden end to college and what follows next. We hope that you, the freshmen &mdash; and the disorientated returning upperclassmen &mdash; can take a step back and start to wonder at all the things that Abu Dhabi has to offer, consequently turning these questions into a productive conversation from which we can all learn.</p><p>In this overwhelming period of Marhaba activities &mdash;&nbsp;which includes everything from IKEA trips to intercultural educational sessions and from laundry workshops to sessions aimed at resolving major-related dilemmas &mdash;&nbsp;The Gazelle hopes to bring to the forefront some of the thoughts and opinions of the multifaceted NYUAD student body. We hope that by bringing a fraction of our collective experiences and dilemmas into the limelight, perhaps you &mdash; the incoming class &mdash; might be able to view NYUAD, our city and perhaps even the world, through other paradigms and perspectives. To the rest of our student body and community, we wish you a spectacular end to your break, wherever that was. The Gazelle will be back in action starting Sept. 4.</p><p>Your Editors-in-Chief,</p><p>Connor and Khadeeja.</p><p><em>Khadeeja Farooqui and Connor Pearce are Editors-in-Chief. Email them at feedback@thegazelle.org.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "letter",
            "title": "Letter From The Editors",
            "issueId": "76",
            "category": "letters",
            "teaser": "Pause and look at what’s going on around us, what impacts us and what we do. And ask why.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "returning-to-nyuad"]},
                { $type: "ref", value: ["articlesBySlug", "picking-courses"]},
            ],
        },
        "picking-courses": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "supriya-kamath"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/picking-courses.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/picking-courses.jpg'></img></p><p><em>Illustration by Joaquin Kunkel</em></p><p>In the summer before freshman year, I made a scientific breakthrough.</p><p>Having spent weeks poring over a worn-out copy of the NYU Abu Dhabi Academic Bulletin and having filled out every academic planning resource I could unearth from the darkest, creepiest depths of the NYUAD Student Portal, I hit upon a formula for academic success.</p><p>This was a formula that would allow me to fulfil my lifelong academic dream of completing two majors, two concentrations and my cores. A formula that would let me earn credits beyond my wildest imagination.</p><p>But it all hinged on one tiny, reasonable assumption: that I would get three out of the eight courses I had listed on my course enrollment preference form.</p><p>I got two.</p><p>Having been brutally spurned by the Gods of course enrollment, I spent the next year doing things I would have never dreamt of doing. With my plan in tatters, I took courses outside of my intended majors. I took cores outside of my comfort zone. In the beginning, it was horrifying.</p><p>And then, it wasn&rsquo;t.</p><p>In fact, it&rsquo;s probably one of the best things that happened to me in freshman year. Here&rsquo;s what I learned:</p><p><strong>College Is the Best Time to Get Yourself Some Mad Skillz:</strong> In the summer before freshman fall, my parents suggested that I take a coding course in college. As a prospective literature major, my reaction was, Bah! Humbug. Everybody knew that when the apocalypse came around and the Wi-Fi went out, the only thing left would be the written word. What would I do with &lt;print (&ldquo;Hello world!&rdquo;)&gt; when there was no world left to say hello to?</p><p>As a lover of the humanities, I also didn&rsquo;t see how learning about algorithms and compilers could possibly help me as an artist. Instead, shouldn&rsquo;t I use my college years to improve my literary knowledge as much as I possibly can? &nbsp;&nbsp;&nbsp;</p><p>&ldquo;Words are my jam,&rdquo; I informed my parents. &ldquo;I&rsquo;m hella good at words, fam.&rdquo; &nbsp;</p><p>But my eloquence did not persuade them, and neither did my argumentative essay titled, Lit is Lit but Science has No Chill. They persisted, and in the spring, I decided to take a computer science core class.</p><p>It changed my life.</p><p>It was incredibly empowering to be able to create a website from scratch. I now know that if I ever need to develop a website for one of my literary pursuits, I&rsquo;d be able to do it without having to rely on a gum-chewing, baseball cap-wearing web developer. Or at the very least, I&rsquo;d understand that when the web developer said the word back-end they&rsquo;d simply be doing their job and not making inappropriate anatomical references.</p><p>The truth is that a literature major needs to study programming because we don&rsquo;t live in a Maze-Runner-like world, where everyone&rsquo;s job description comprises a single task. Stories today are told digitally, and writers must adapt to survive. A physics major needs to take a course in world history because most scientific breakthroughs have occurred during periods of great historical turmoil. A computer science major must take an interest in literature to understand Maze Runner references.</p><p>College is a time to grow, and the best way to grow is to skill up.</p><p><strong>Never Trust Your High School Instincts:</strong> Your academic tastes in school should not be the yardstick by which you make decisions in college. In school, I disliked classes for all sorts of irrational reasons. For instance, the extent to which I disliked a class was directly proportional to how many flights of stairs I had to climb to get to the classroom.</p><p>So by the time I graduated high school, I wasn&rsquo;t sure about my major, but I was convinced about what I didn&rsquo;t want to study. I didn&rsquo;t want to study math, because it&rsquo;s always made me sad. I didn&rsquo;t want to study economics, because it was rumored to involve math. I didn&rsquo;t want to study chemistry, because my second grade science teacher was a meanie. I was convinced that this process of elimination would lead me to my major.</p><p>I was wrong.</p><p>In school, subjects are compartmentalized into boxes so as to not confuse 12-year-olds. But in college, the assumption is that you can handle a class that tackles a single subject via two or more disciplines: psychology and philosophy, math and anthropology, film and biology.</p><p>I was thrown into a state of disarray. I didn&rsquo;t know which courses to take because in school, psychology class had been on the second floor and philosophy on the sixth. Math had been taught on the fourth floor. Biology class had been in a different building altogether.</p><p>Eventually, I learned to question everything high school had taught me about my academic preferences. As a humanities major, I used to believe that stepping into the science building would give me cooties, but when I finally took a science class, I found out that cooties spread through contact and not by air. It changed my life.</p><p>Saying that you&rsquo;re not a science person is a terrible excuse to not take a science class, and saying that you&rsquo;re not a writing person is a terrible excuse to not take a humanities class. At NYU Abu Dhabi, you&rsquo;re a liberal arts person and you can take any class you want.</p><p><strong>Don&rsquo;t Judge A Course By Its Name:</strong> So how do you actually pick your courses? &nbsp;Read the course description, you might reply. If it sounds interesting, take it.</p><p>Wrong answer. There&rsquo;s a certain extent to which course descriptions help. You may think that a core called What Does An Infection Do? will be related to biology but it may actually be all about zombie movies. It all depends on the professor teaching the course.</p><p>So the first step is to look up the professor&rsquo;s areas of interest, and then head to the bookstore and take a look at the course reading list. And if all else fails, take advantage of Add/ Drop week. In my first semester I had benevolent concerns like, if I drop this class the professor might feel bad, as well as comforting socialist rationales: I&rsquo;ve made friends here so maybe it&rsquo;s safe to just stick with this incredibly hard class because if we fail, at least we&rsquo;ll all fail together.</p><p>Course enrollment is an individual endeavor. If you&rsquo;re convinced you can&rsquo;t do it, drop it. </p><p><strong>If You Love Your Academic Plan, Let it Go:</strong> Last year, if someone had told me that I should explore subjects like science and philosophy in my freshman year, I would&rsquo;ve flashed two thumbs up, said &ldquo;Sure, alrighty!&rdquo; and then I would&rsquo;ve turned my head and snorted, &ldquo;Hippie&rdquo;.</p><p>Today, I have embraced the spirit of the liberal arts.</p><p>Yes, it&rsquo;s good to have a plan. Great, even. But there&rsquo;s a fine line between a plan being a useful guide and a plan being the thing that cripples you. You know you&rsquo;ve crossed the line when you find yourself saying, &ldquo;I want to take this incredible course but I can&rsquo;t because then I won&rsquo;t be able to do this particular psychology course in my second semester of junior year, and then my life will start crumbling around me.&rdquo;</p><p>I certainly don&rsquo;t encourage setting your academic plan on fire, but cut yourself some slack this freshman year. Go wild and fill an elective or two with classes that you never imagined you would do. If you really love your four-year academic plan, let it go. Give it some space to live and breathe.</p><p>And if it really loves you, it will come back.</p><p><em>Supriya Kamath is Copy Chief. Email her at feedback@thegazelle.org</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "picking-courses",
            "title": "Course Enrollment Tips: Thinking Outside of Your Major",
            "issueId": "76",
            "category": "commentary",
            "teaser": "If you really love your academic plan, let it go.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "returning-to-nyuad"]},
                { $type: "ref", value: ["articlesBySlug", "letter"]},
            ],
        },
        "nyuad-survival-guide": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "safa-salim"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/arabic-playlist.jpg",
            "html": "<p><img src='//thegazelle.s3.amazonaws.com/gazelle/2016/02/arabic-playlist.jpg'></img></p><p><em>Illustration by Shenuka Corea</em></p><p>College life is a fantastic experience. It is so thoroughly fascinating that it has been the central theme of many a movie and novel. The very notion of embarking on your university journey, particularly at a university like NYU Abu Dhabi, is one that likely fills you with an invigorating mixture of excitement and apprehension.</p><p>By now, of course, you must be well-versed in lingo befitting a global leader. You are probably filled with a great sense of purpose and pride. You stand ready to shoulder all the responsibilities a global leader should &mdash; global leader, you will have noticed, is an NYUAD buzzword; another one is diversity. You are in all likelihood currently emboldened by the unassailable knowledge that you will one day make a profound change in the world. NYUAD promises to equip you with the tools necessary to do so, but before that, I will take it upon myself to caution you about certain challenges you may face as you transition into college life. These aforementioned challenges might appear risible to you but, nonetheless, they are significant. It is my unsupported opinion that even the most seasoned global leaders face them.</p><p>Without further ado and in no particular order, I will enlighten you about possible challenges and obstacles that can arise in the life of a global leader at NYUAD.</p><p><strong>Procrastination</strong></p><p>Ah, procrastination &mdash; that sweet, sweet foe. Where do I begin? Or more accurately, when do I begin? It happens to the best of us. A two-minute shut-eye turns into a two-hour snooze fest. You have an assignment due at 12 a.m., and you brazenly submit it at 11:59 p.m., feeling strangely rebellious. But beware. Experience teaches me that NYU Classes, the portal used for submitting assignments, isn&rsquo;t always cooperative. You might have the harrowing experience of almost submitting an assignment late and losing an entire letter grade. A promise to watch just one more amusing cat video culminates in a rapid, downward spiral and three hours later, you find yourself watching your tenth compilation of gymnastics fails &mdash;&nbsp;it has to be stressed here that the Recommended Videos section on YouTube is your biggest enemy; it is virtually impossible to resist its enchanting siren call. You decide to begin your work at exactly 3:35 p.m., and come 3:36 p.m. you decide spontaneously that you will only commence your work when the clock strikes the next multiple of five. Creativity knows no bounds during a healthy session of procrastination.</p><p>Soon enough, you will find that procrastination is rife even in the hallowed halls of NYUAD, where global leaders are churned out by the hundreds. There is no easy way to combat this fatal phenomenon, but there are certain methods proven to be somewhat effective, and I recommend that you give them a go.</p><p>This first solution is scheduling: make a thoroughly comprehensive schedule that even accounts for procrastination. So if you&rsquo;re certain you&rsquo;ll need only two hours to finish that response paper, allot three hours for it in your schedule. Add even minor things like laundry and nail clipping to your to-do list. The insurmountable sense of accomplishment you experience from striking items off your list might just motivate you to get more done.</p><p>Another solution is to succumb to peer pressure &mdash;&nbsp;yes, you read that correctly. Sometimes, peer pressure is useful. Surrounding yourself with people who are apparently busy can often force you to get your work done effectively. Because now if you take a break to watch a K-pop video, you have to do it on the sly and worry about people judging you, so it&rsquo;s best to work diligently or at the very least, give the impression that you are. &nbsp; &nbsp;</p><p><strong>Vanishing funds</strong></p><p>If you&rsquo;re the recipient of a full financial aid package, you are armed with 14 meal swipes a week and 330 Campus Dirhams every two weeks. You receive a generous stipend. And somehow, mysteriously, you exhaust your entire supply of meal swipes, find yourself down to your last four paltry campus dirhams and have a meager 50 dirhams in your bank account. How did it happen? Where did it all go? Can&rsquo;t remember? Budgeting is the way to go. Keep tabs on how much you&rsquo;re spending and on how often you&rsquo;re using your credit or debit cards. It&rsquo;s okay to indulge in retail therapy now and then, but try not to make too big a dent in your account. As for the meal swipes and Campus Dirhams, pace yourself. There is no way you&rsquo;re going to go hungry on campus with that much money set aside for just food and grocery items. You don&rsquo;t absolutely have to eat at the Marketplace everyday. I also assure you that survival is possible without two Starbucks lattes a day. If all fails, you can always find yourself a friend perpetually flush with meal swipes and Campus Dirhams. Such people, rare as they are, do exist. But this should only be a last resort.</p><p><strong>Insecurity</strong></p><p>This is where things start to get a little serious &mdash; and a wee bit self-help-ish. The great thing about a place like NYUAD is that you&rsquo;re surrounded by inspiring people who&rsquo;ve accomplished admirable feats at young ages. However, that can also be the most frustrating thing at times. When your classmates include an Olympian athlete, a United Nations delegate, an NGO founder and a recreational mountain-climber &mdash; all of whom are under the age of 20 &mdash; the A you got for your research paper on notions of belongingness in the face of neoliberalism seems downright pathetic.</p><p>You start to question your self-worth, you feel this pressure to get on the bandwagon and do something worth talking about. You belittle yourself and battle a stinging sense of inadequacy. Learning to unlearn this cultivated self-deprecation will be difficult. But it must be done. Insecurities are an inextricable fact of growing up. Everyone has something they&rsquo;re good at, and something they wished they were good at. Everyone. Even here at NYUAD. You can actually bake a batch of cookies without burning them? That&rsquo;s brilliant. You&rsquo;re an expert parallel parker? Great! You&rsquo;re a good listener? That&rsquo;s phenomenal. Not many people are. Learn to take pride in the ostensibly unimportant things you excel at. Because they&rsquo;re not insignificant. Not by a long shot. Visit the counselor if you need to. Talk to a friend. Stick cheery Love Thyself notes around your room even if people find that corny. Learn to appreciate your own worth, and you&rsquo;ll carve a niche for yourself here soon enough.</p><p>To all the incoming freshmen: I wish you the best of luck. If you find yourselves unable to relate to any of the above, then consider this piece a whimsical, semi-autobiographical account by an indecisive sophomore reflecting on her first year at NYUAD.</p><p><em>Safa Salim is Deputy Opinion Editor. Email her at </em><a href='mailto:feedback@thegazelle.org'><em>feedback@thegazelle.org</em></a><em>.</em></p>",
            "image": null,
            "published_at": "2016-08-22T05:58:09.000Z",
            "slug": "nyuad-survival-guide",
            "title": "NYUAD Survival Guide: Chapter One",
            "issueId": "76",
            "category": "commentary",
            "teaser": "Tips to combat the challenges of college life",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "letter"]},
                { $type: "ref", value: ["articlesBySlug", "picking-courses"]},
            ],
        },
        "freshman-year-in-review-what-i-learned-2": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "lina-elmusa"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/firstyearinreview.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/firstyearinreview.jpg" alt="Year in Review" />
<em>Illustration by Devaki Banerjee</em></p>

<p>Freshman year was the year that I learned how to be myself. During Marhaba I was sure I knew myself, and I went around presenting one aspect of myself: the extrovert Lina who’ll talk to anyone and everyone and who has no shame whatsoever. I liked that Lina. I still like that Lina. However, it took time for me to realize that this was not all there was to me.</p>

<p>Three weeks into university, Tea with Lina became a thing. Or so I was told. I was the tea enthusiast. I loved it. It helped facilitate my transition into college, and making new friends became so much easier. But, you know what? Tea with Lina didn’t stop me from drinking coffee. I still enjoyed my solitary cup of coffee. People found my love for coffee unbelievable, since they were convinced that I was a tea person. </p>

<p>That’s when I realized that binaries were not for me. I can be both a tea and a coffee person.</p>

<p>Freshman year was the year I questioned what it means to be me. “I’m Lina,” I would smile. “I’m from Jordan but I’m Palestinian.” I would smile again. It was the year I had multiple identity crises and emotional traumas. I learned what it means to be an extroverted introvert.</p>

<p>As sure as I was that I was an extrovert, I was sure that I couldn’t wait to leave home. After 17 years of living in the same place and falling into an uncomfortable routine, I was ready to go. </p>

<p>I love my parents, yet I didn’t miss them much while I was away. I loved being independent far too much. That is, if living at NYU Abu Dhabi — with its dining hall and free washing machines — is considered living independently.</p>

<p>It hit me midway that I am not really independent. Other communities are not as kind as NYUAD, and I only realized that when I went away for spring break and experienced real independence for the first time. I realized that on a budget, I had to make some tough choices: tea or coffee? </p>

<p>I came in with no idea what to expect. Was the entire year going to be like Candidate Weekend or Marhaba? During Marhaba I thought that if college was going to be like that, I was dropping out. And during that same week, I spent more than 500 AED on unnecessary clothes and more than 400 on items from IKEA — things no one in the world should ever do. </p>

<p>I came in aiming for that 4.0 GPA, and to complete as many concentrations as possible — Literature and Creative Writing was my calling but I wanted to do other things too. Things did change, and I learned so much. Too much to put into one essay. </p>

<p>I came in with the idea that I had to travel around the world as much as I could. I already knew that a semester in Paris was a must. I didn’t really think about discovering Abu Dhabi and the UAE until I got here and the campus became far too small, far too quickly. I needed to get out, and I came to realize that this is one beautiful city. </p>

<p>It’s visually odd and sometimes uncomfortably humid. Yet, I knew there were things for me to do. If I had nothing planned, I would take the shuttle to the city with some friends, walk around aimlessly and find someplace new. And when I needed personal space, I’d take my laptop and find a new place to try different coffees or teas.</p>

<p>A spontaneous trip to Al Ain came up, and getting lost in an oasis there with a friend was definitely one of the highlights of my freshman year. I visited Dubai every once in a while to meet up with family and family friends – and for a reality check. A break from this beautiful campus is definitely necessary every now and then. </p>

<p>I learned that small talk and insincere conversations were not for me. I learned that I’m not that great in person, and that my personality and academics need polishing. I had to get over my stubbornness and pride. I accepted failure, and at some point actually kind of embraced it. I realized that, as clichéd as it sounds, you really do learn from your mistakes. And you know what? Sometimes you don’t, and you need to make that same mistake four times before you get your act straight. </p>

<p>I learned to open up and trust. I told some people things about myself that I could never say before. While making sure I never dump too much on one person, I found that counseling is a wonderful resource if you need someone to talk to. I learned that a small conversation could make my day. </p>

<p>The hardest part for me was losing my uncle while being in Abu Dhabi. I could have gone home, but there were two weeks left in the semester and everyone around me helped me push through. Grief and loss support sessions were wonderful — they helped me figure out how to deal with my feelings and talk things out. In dealing with difficulty, I found people whom I can now call family.</p>

<p>I decided that I was not going to make university about grades. There’s far too much out there for me to only fixate my energy on academics. They are certainly important, but they are not everything. I learned that the arts make me truly happy – everything from visual arts and film to literature and theater. I hung around the Imagine Science film festival for all three days of the weekend, and pulled all-nighters just because I had to attend those concerts on Saturday evenings. I fell in love with the NYUAD Arts Center. </p>

<p>This love of the arts was sparked when I took a course called Jazz in my second semester. I never knew that I could possibly love a course so much. I never knew that I could get so emotionally attached to a class and group of people, both my classmates and the guests that I met for a couple of hours, the guests that I will probably never see again. I know, you hear it over and again, but you really never know where you’ll find your favorite course. </p>

<p>My first year was great. I was able to embrace my ability and need to be alone. I also figured out that I was brave on two occasions: when my uncle, one the people closest to my heart, passed away, and when I asked a guy out. </p>

<p>After a really long time, I became comfortable in my own skin. I started taking pride in the brown Arab woman that I am, and I have to say that so much of it is due to NYUAD and the people here. </p>

<p>The one thing I think would definitely make your life here easier is to be yourself — no, not the person you think people want to meet, but yourself. That way you’ll make genuine friends who share your vibe. Also, be open. Be open-minded, and be open to new experiences and people. This city and campus have so much to offer — take advantage of it. Time passes by far too quickly. </p>

<p><em>Lina El Musa is a Staff Writer. Email her at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "freshman-year-in-review-what-i-learned-2",
            "title": "Freshman Year in Review: What I Learned",
            "issueId": "76",
            "category": "commentary",
            "teaser": "How to be a tea and coffee person.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"]},
            ],
        },
        "the-weekly-graze-2": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "the-gazelle-staff"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/04/gazelle-graze-new.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/04/gazelle-graze-new.jpg" alt="The Weekly Graze" />
<em>Graphic by Joaquín Kunkel Edited by Koh Terai/The Gazelle</em></p>

<p>Here at The Gazelle, we work hard to bring you interesting, informative content that you can enjoy and engage with. But what do we read when we aren’t in production every Saturday, working late into the night? The Weekly Graze is a series in which The Gazelle’s staff members pick their favorite written reads from the past week, in the hope that you might discover some interesting reads too.</p>

<p>Connor Pearce <br />
Co-Editor in Chief</p>

<p><a href="http://www.goodreads.com/book/show/2497026.The_Watch_Tower"><em>The Watch Tower,</em></a> Elizabeth Harrower</p>

<p>Set on the glistening shores of Sydney Harbour in the 1940s, Elizabeth Harrower writes of two sisters, Laura and Clare, who are abandoned by their mother after their father's death and who come to live with Felix Shaw, Laura's employer and husband. Shaw is a cruel husband who takes away anything the two women have, and psychologically and physically abuses Laura until she becomes a shell. Clare, the younger sister, is luckier and is able to escape Shaw's clutches, but she is unable to save her sister. The Watch Tower is an outstanding work of Australian feminist literature that expertly captures the way in which a patriarchal society hides the constant threat of violence and female subjugation beneath a glittering veneer.</p>

<p>Jocilyn Estes <br />
Opinion Editor</p>

<p><a href="https://www.goodreads.com/book/show/13425592-devil-in-the-grove"><em>Devil in the Grove: Thurgood Marshall, the Groveland Boys, and the Dawn of a New America</em>,</a> Gilbert King</p>

<p>In this Pulitzer Prize-winning piece of nonfiction, Gilbert King delivers an incredible account of one of the most important civil rights cases in U.S. American history. The book follows Thurgood Marshall through the humid swamps of Florida during his career with the National Association for the Advancement of Colored People, years before his days working on the Supreme Court. King, assisted by newly released FBI case files, follows Marshall as he enters the Jim Crow South to take on the Klu Klux Klan. This powerful narrative is a gripping description of what former U.S. Supreme Court Justice Robert Jackson called "one of the best examples of one of the worst menaces to American justice." If you’re excited by law, U.S. American history or social justice movements generally, this one's for you.</p>

<p>Pranav Mehta <br />
Research Editor</p>

<p><a href="https://www.goodreads.com/book/show/1358844.Remember_Me_"><em>Remember Me?</em>,</a> Sophie Kinsella</p>

<p>When a friend caught me giggling at a physics problem because of its intricate story arc, said friend recommended this novel so that I could regain some semblance of so-called normal fiction. And that's exactly what happened — I have never been more invested in a fictional character's life than I was in Lexi's. Waking up brooding in a hospital and remembering you don't conform to society's ideals of beauty and also have a subpar love life can be tough, but hey, she realizes she's aged three years, has an enviable figure, straight teeth and a millionaire husband. The complex plot that follows — marriage problems, retrograde amnesia and attractive men — renders this literary gem a page-turner. What happens next? Will Lexi unravel the truth? I, as I'm sure you too, asked these questions, perched on the periphery of my seat.</p>

<p>Hannah Taylor <br />
Managing Editor</p>

<p><a href="https://www.goodreads.com/book/show/16115612-and-the-mountains-echoed"><em>And the Mountains Echoed</em>,</a> Khaled Hosseini</p>

<p>I bought this book during a layover in Amsterdam that was unexpectedly lengthened by a flight delay. I went for the safe bet, choosing Hosseini because of his incredible popularity and my love for The Kite Runner. The book was the only thing that kept me awake long enough to catch my flight. As always, Hosseini conveys incredible honesty and insight that makes the reader feel as though they’re sitting with the dysfunctional families and friends portrayed in their living rooms, sipping tea and eating biscuits. The running themes were bonds and love with a focus on family dynamics, and unlike in his earlier works, Hosseini focuses on multiple characters and stories. Most of the story threads intertwine only at brief moments, but throughout the book there is a humane truth that everyone can relate to and learn from. I was actually nicer to my mother after reading this book.</p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "the-weekly-graze-2",
            "title": "The Weekly Graze",
            "issueId": "76",
            "category": "in-focus",
            "teaser": "Here at The Gazelle, we work hard to bring you interesting, informative content. But what do we read when we aren’t working late into the night?",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"]},
            ],
        },
        "a-very-subjective-guide-to-eid-break": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "karolina-wilczynska"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/Ras-al-Khaimah-beach.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/Ras-al-Khaimah-beach.jpg" alt="Eid Travels" /></p>

<p><em>Photograph by Karolina Wilczyńska</em></p>

<p>Chances are that many of us will not receive our passports back before Eid break. NYU Abu Dhabi students, with their penchant for traveling everywhere from Mozambique to Nepal over short breaks, will likely have to wait until the next break, in October. While many upperclassmen may be frustrated about not being able to explore new continents, visiting long-unseen pen-friends or simply going home, this is a chance for freshmen to start their college travels in presumably the logical order: small steps first.</p>

<p>NYUAD is likely to eventually take you to a camel race, Yas Waterworld or yet another James Bond premiere, but the UAE also has gems you will need to discover yourself. Today, predicted temperatures range between 38 and 41 degrees Celsius. It might be too early for camping, but there are alternatives.</p>

<p>First of all, souqs. Tight schedules tend to favor quick trips to the mall, but shopping has many faces. There is the enormous Blue Souq and the Old Souq in Sharjah, just a couple of hours from Abu Dhabi. Dubai too offers plenty: the Gold Souq, the Spice Souq and the Perfume Souq, to name a few. Souqs are everywhere around the Emirates, and the Carpet Souq and the Fruit and Vegetable Market are just off Saadiyat Island. It is only a matter of finding them and spending a few hours picking a carpet most suitable for your new room.</p>

<p>Additionally, there is always modern culture to explore. Until mid-September, Yas Island is hosting an event called The District, emulating a micro-city with a set of activities, workshops and events. The platform describes itself as “a one-of-a-kind space where you can socialize, play, create, explore, find inspiration, make connections or even disconnect if that’s what you’re in the mood for.” Another contemporary art site worth visiting is a set of galleries and venues in Al Quoz, an industrial district of Dubai. Some of the warehouses contain cafes that match the trends set by the art around them.</p>

<p>The break can also be an opportunity to escape the city and get lost between the desert and the sea. If renting a car is not an option, there are long-distance buses connecting the emirates. A few hours after leaving the Welcome Center, you can be at Al Badiyah in Fujairah, setting foot in the oldest mosque in the country and then climbing the rocks above it to enjoy the view of the Gulf of Oman and the palm trees at the foot of rocky mountains. Islands of greenery can also be found closer to the city, like in Madhab Park where you can walk through a forest of date palms. </p>

<p>On the other hand, Ras al-Khaimah and Umm al-Quwain have austere coastlines to offer. The beach in Ras al-Khaimah feels worlds apart from Saadiyat Public Beach or the Corniche. Umm al-Quwain’s beach has an enormously long breakwater made of stones, creating a tiny beach at the very tip of the city. The pier is the perfect spot to watch every shade of blue the Gulf has to offer. And of course, there are mountains. Climbing Jebel Hafeet, just outside of Al Ain, is also an effective way of making the temporary passport loss less painful; part of the mountain lies in the territory of Oman, but the summit belongs to the UAE.</p>

<p>Lively ports, so historically and culturally important, can be found in every emirate — even in the smallest, Ajman. In Umm al-Quwain, the port is located at the tip of the city, not far from the pier beach. If you happen to be lucky, an Iranian family currently residing in the UAE might take you there in their own car, seeing how desperately you need a taxi in the scorching heat. There are forts like Abu Dhabi’s Qasr al-Hosn in Fujairah, Dubai and Al Ain. There are museums, for which Sharjah is most famous. Only in Sharjah will you find the Museum of Islamic Civilization, the Art Museum and the Heritage Area. Al Ain and the villages of Liwa, both in Abu Dhabi, are also worth visiting if history is what you’re looking for.</p>

<p>To do justice to the holiday, Eid Break may also be a chance to learn a few phrases in Arabic, visit a mosque or attend a celebratory event on campus, organized by the Muslim Student Association.</p>

<p>Now let’s hope the visas won’t be ready by Eid.</p>

<p><em>Karolina Wilczynska is Research Editor. Email her at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "a-very-subjective-guide-to-eid-break",
            "title": "A Very Subjective Guide to Eid Break",
            "issueId": "76",
            "category": "commentary",
            "teaser": "The UAE has plenty to offer when it comes to exploration during the holidays. Whether it be adventure, history or a good view. Make sure to take advantage of that during the Eid Break.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"]},
            ],
        },
        "new-j-term-course-selection-process": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "kristina-stankovic"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/7.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/7.jpg" alt="Update to J-Term Policy" />
<em>Illustration by Joaquin Kunkel</em></p>

<p>Starting in fall 2016, students are supposed to complete a January Term application on a new point-based system. This system, wherein classes and students are allocated a certain number of points, is designed to accomplish the same results as the previous J-Term allocation process and will still respect the student’s wish list. Students are supposed to apply by listing their seven preferences instead of six, as was the case in previous years. </p>

<p>Each course is given a point value based on the popularity of its location and whether the course fulfills a Core curriculum requirement. Classes have point values between one and seven. Abu Dhabi-based J-Term classes are worth two points whereas those with international trips are worth four points. Paris, Buenos Aires and Sydney are worth the highest number of points — six. The specific class in Paris scheduled for January 2017, Fascism, Antifascism and Culture, is worth seven points because it is also part of the Core curriculum. Apart from New York and Shanghai, which are worth four points each, other global locations are worth five points each.</p>

<p>Students have different point budgets depending on a variety of factors, including the number of J-Terms previously completed abroad as well as their class year. According to the J-Term <a href="https://students.nyuad.nyu.edu/academics/global-education/january-term/j-term-faqs/">Frequently Asked Questions</a>, students who have had two classes in Abu Dhabi that do not count for a Core curriculum class have the most points number of points — 35. Students who have already had two J-Terms in global locations, three J-Terms in total and at least one J-Term class that counts as a Core curriculum class have the fewest points — 16. Everybody else’s points are between 16 and 35.</p>

<p>The new system has sparked conversations among students, both on social media and on campus. Junior Maria Vogel said that the application process was simple to follow, but felt restrictive:</p>

<p>“From the perspective of the university, the changes make sense. But our choice is more limited now. I was shocked that a course featuring an international trip will be considered a J-Term abroad for us upperclassmen.”</p>

<p>Previously, classes based in Abu Dhabi with international trips did not count as J-Terms abroad apart from a few exceptions.</p>

<p>Senior Sarah Hassan agrees with Vogel, voicing that the new system might force students to take classes out of their areas of interest.</p>

<p>“Watching from the sidelines I think that the students are constricted by the rules not previously communicated, especially rules regarding Core classes,” said Hassan, who is not taking a J-Term herself. “These changes make students settle for classes they are not particularly interested in,” says Hassan.</p>

<p>On the other hand, freshman Melinda Demirović says that the J-Term system is fair to freshmen:</p>

<p>“We were always aware that we will have one J-Term in Abu Dhabi, one in Abu Dhabi which includes a trip and one J-Term abroad. I think that it is a fair system — many upperclassmen were promised a possibility of two J-Terms abroad, but ended up with one only. At least we know for sure what our options are,” said Demirović.</p>

<p><em>Kristina Stankovic is News Editor. Email her at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "new-j-term-course-selection-process",
            "title": "New J-Term Course Selection Process",
            "issueId": "76",
            "category": "on-campus",
            "teaser": "New J-term process yields mixed responses.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"]},
            ],
        },
        "ride-hailing-applications-in-trouble": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "connor-pearce"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/ubercareem.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/ubercareem.jpg" alt="Uber" />
<em>Illustration by Joaquin Kunkel</em></p>

<p>On Aug. 27, up to 70 drivers using ride-hailing applications Uber and Careem in Abu Dhabi were arrested and taken into custody, <a href="http://www.thenational.ae/business/technology/uber-and-careem-drivers-detained">according</a> to The National. Both apps subsequently suspended their services to drivers and customers. Uber remains offline, whereas Careem resumed its service earlier this week.</p>

<p>Senior Jose Varias, who has used both apps previously, noted that when trying to use Careem on the evening of Aug. 31 — soon after its service was resumed — the cost was 20 AED more than the regular price of traveling from near Sama Tower to the Saadiyat campus. Varias used the Abu Dhabi Taxi App to hail a taxi instead, and one arrived within 20 minutes of placing the request.</p>

<p>With the low-cost version of Uber, Uber X, which was recently introduced in Abu Dhabi, prices of Uber and Abu Dhabi TransAD taxis were roughly comparable. With promotions often offered by Uber to new customers, taking an Uber X is sometimes cheaper than taking a TransAD taxi. <a href="http://www.thenational.ae/business/technology/why-uber-and-careem-have-suspended-operations-in-abu-dhabi--video">Reports</a> in The National suggest that the undercutting of taxi prices was what prompted the crackdown.</p>

<p>Senior Arame Dieng noted that Careem was also more useful as their cars could accommodate more passengers than Uber, and larger vehicles were more readily available from Careem than from TransAD taxis.</p>

<p>For Varias, the benefits of these apps are simple: "The reason I use Uber or Careem is because I don't carry cash."</p>

<p>"It would cost me [eight AED] to get cash and it's only a five AED difference with a cab, so I'm not paying as much and [Uber] is more comfortable."</p>

<p>Both students said that they were likely to switch to using TransAD taxis if prices for Uber or Careem were permanently increased.</p>

<p><em>Connor Pierce is Editor-in-Chief. Email him at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "ride-hailing-applications-in-trouble",
            "title": "Ride-Hailing Applications in Trouble",
            "issueId": "76",
            "category": "off-campus",
            "teaser": "Uber and Careem apps suspended their services to drivers and customers. Uber remains offline",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"]},
            ],
        },
        "the-long-uncertain-wait-for-asylum-seekers-in-athens": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "annalisa-galgano"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/annalisa.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/annalisa.jpg" alt="asylum seekers" />
<em>Illustration by Joaquin Kunkel</em></p>

<p>This summer, everyone’s eyes were on the 10 refugees who competed in the Rio Olympics. Spectators around the world learned the story of Syrian swimmer Yusra Mardini, who swam three hours in the Mediterranean pushing a boat full of other refugees. U.S. President Barack Obama even <a href="https://twitter.com/POTUS/status/761703867402686464?ref_src=twsrc%5Etfw">tweeted</a> that #TeamRefugees “prove that you can succeed no matter where you are from.” While I wish this idealism were true, I cannot help but think of the thousands of other refugees and asylum seekers I saw this summer, living over 9000 kilometers away from Rio in abandoned Olympic stadiums in Athens, without an audience and certainly without applause. </p>

<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/Barack-Obama-Tweet.png" alt="obama tweet" /></p>

<p>This past weekend also marked a year since the death of Aylan Kurdi, a three-year-old found washed up on a Turkish beach after a boat, meant to carry his family to safety, capsized. Although the photo of Aylan’s body sparked global sympathy and outrage, the circumstances that led to his death have not changed. Yusra Mardini’s three-hour swim was necessary because one year later, there is still no safe route for people fleeing war to apply for asylum in Europe. In order to gain refugee status in the EU, people embark on a deadly journey across the Mediterranean, a route that has already cost over 3,000 people their lives this year. </p>

<p>However, arriving on Greece’s shores is only the beginning of their journey toward asylum. I spent this summer with professor Sophia Kalantzakos in Athens, Greece, researching the refugee situation. We interviewed volunteers, policymakers, service providers and asylum seekers. With this research, I hoped to gain a better understanding of the journeys and conditions for asylum seekers in Athens. In these interviews, asylum seekers in Greece expressed confusion and frustration, and felt that they had been forgotten. </p>

<p>Though the media often conflates refugees with asylum seekers, there is an important distinction. Anyone fleeing their home country to seek protection elsewhere is considered an asylum seeker until the government of the receiving country officially approves their application for refugee status. Formal refugee status grants the refugee the right to healthcare, education, work and reunification with family members.</p>

<p>Since Greece’s northern borders closed in March, an estimated 57,000 asylum seekers are currently stuck in Greece, awaiting information about whether they will be deported or granted refugee status, whether they will be permitted to reunify with family members in other European countries or to relocate at all. Shortly before we arrived in Greece, the government <a href="http://www.aljazeera.com/news/2016/05/greece-begins-idomeni-refugee-camp-evacuation-160524051404401.html">bulldozed</a> the unofficial Idomeni camp at the northern border, where several thousand asylum seekers had settled in the hopes that the borders would re-open again and they could continue their journey to other European countries. Many of the people who had been living at Idomeni returned to Athens after the camp’s destruction to wait for more information.</p>

<p>During our time in Greece, the pre-registration of asylum applicants had begun. All Syrians and Arabic speakers not living in formal camps had to pre-register by calling a single Skype account during a weekly three-hour window. With thousands of people attempting to make contact during this weekly window, it took many people weeks or even months to finally connect their calls. Once they successfully got through on Skype, callers would be given a code that would allow them to pre-register in person at the asylum office in Athens. Several days or weeks after pre-registering, applicants are texted the date and time of their asylum interview appointment, which takes place five to seven months after they pre-registered. In the meantime, all they can do is hope that the wait will be worthwhile.</p>

<p>Syrians who arrived in Greece before the EU-Turkey deal was enacted on March 20 are the most likely to be granted refugee status. Those who arrived on Greece’s shores after March 20 are nervous to even apply for asylum, lest they be deported back to Turkey, where they would likely live in substandard conditions without the right to work. Similarly, Afghans are not eligible for relocation out of Greece, so many choose not to risk applying for asylum at all.</p>

<p>Housing conditions for asylum seekers in Athens vary widely. Some families may apply to be housed in vacant apartments through an organization called Praksis. This option perhaps offers the most independence and comfort, but one family we spoke to also felt more isolated from other asylum seekers — they were worried that they could not stay as informed about the services available to them and the next steps in the asylum process. Other asylum seekers around the city can stay in formal camps, the best of which is run by the municipality of Athens and provides personal containers, beds, running water and educational programming for children. <br />
<img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/Eleonas-Camp.jpg" alt="Eleonas Camp" title="" /><em>Photograph by Annalisa Galgano</em></p>

<p>Asylum seekers staying in the abandoned Olympic hockey and baseball stadiums-turned-UNHCR camps live in standard-issue white UNHCR tents. While the rest of the world cheered on the ten refugee athletes competing at the Rio Olympics, thousands of forgotten asylum seekers passed another week in these old Olympic stadiums, hoping and waiting. </p>

<p>Just outside the stadium is the abandoned Elliniko airport, which has also become an unofficial camp for over a thousand Afghans. Again, the location of the camp stings with irony. The board in the Departures area of the old airport still lists the flight times and gates for forgotten planes departing to Germany, the UK and many other places where Afghans are not eligible for asylum. A similar informal camp was established at Piraeus Port, where many asylum seekers had pitched tents after arriving from the islands. However, this camp was evacuated in July, and residents were asked to move into an alternate camp. Most people express resistance to moving into formal camps, particularly the military-run camps outside of the city, for fear that once their presence is no longer visible in Athens they will be forgotten altogether.</p>

<p>In all the camps, people told us they found it difficult to find ways to pass the time. The food rations, the lack of productive activities, the heat of the summer and the unsettling uncertainty about the future contributed to the high tensions in the camps. However, each of the camps is maintained by the passion and energy of Greek government workers, NGOs and volunteers, both local and foreign. Volunteers largely use social media to keep track of independent individuals and organizations who are helping with the crisis, to channel new volunteers to where they are most needed and to dispel rumors with correct information. Despite the ongoing economic crisis in Greece, everyday citizens have expressed their solidarity with asylum seekers by giving their time, resources and talents to improve the living conditions and maintain the dignity of asylum seekers in Greece. <br />
<img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/Refugees-Welcome.jpg" alt="Refugees Welcome" title="" /><em>Photograph by Annalisa Galgano</em></p>

<p>For example, the residents of Exarcheia — a neighborhood in Greece known for anarchists — have helped convert several abandoned buildings, including an old school and a vacant hotel, into new self-organized accommodations for asylum seekers. Residents in these squats actually seem to thrive more than other asylum seekers we met in camps, partially because the residents themselves are responsible for the squats’ operations. Because most of the squats do not accept assistance from NGOs or the government, residents and local Greek volunteers — who refer to themselves as solidarians — self-organize cooking, cleaning, and childcare rotations. </p>

<p>I had the opportunity to meet several Syrian adults and children who had learned near-fluent English during their stay in Hotel City Plaza, the previously abandoned hotel in Exarcheia. By giving asylum seekers control and choice in small ways, such as allowing them to cook for themselves and pursue educational opportunities, solidarians in Greece restored some measure of dignity to people who have been engulfed by uncontrollable circumstances. </p>

<p>I was constantly struck by the resilience and solidarity of the communities that I met in Athens. Shortly before I left Athens, I was invited to celebrate the end of Ramadan at Hotel City Plaza. That night, Syrians, Afghans and Greeks celebrated Eid together by dancing, sharing desserts, and Skyping loved ones back at home or scattered elsewhere around the world. That evening, it seemed that people felt at one with their new community and with Muslims around the world. That evening, I don’t think anyone felt forgotten.</p>

<p>In recent months, solidarians and asylum seekers have organized several protests in Athens and Thessaloniki to pressure governments and international organizations to act more quickly in establishing safe, legal paths to asylum and family reunification. Families, children, and local volunteers occupy the square in front of the Parliament building and insisting upon their own visibility. Despite the international spotlight moving away from the Olympics and the ‘usual’ recurring images of the refugee crisis, asylum seekers alongside their Greek supporters are asking that the world does not forget them. They need more than two weeks’ applause in a stadium far away. </p>

<p><em>Annalisa Galgano is a contributing writer. Email her at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "the-long-uncertain-wait-for-asylum-seekers-in-athens",
            "title": "The Long, Uncertain Wait for Asylum Seekers in Athens",
            "issueId": "76",
            "category": "commentary",
            "teaser": "While the world cheered on the refugee athletes at the Rio Olympics, thousands of forgotten asylum seekers passed another week in old stadiums, hoping and waiting.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "a-very-subjective-guide-to-eid-break"]},
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"]},
            ],
        },
        "on-adjusting-back": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "liza-tait-bailey"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/liza.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/liza.jpg" alt="On Adjusting Back" />
<em>Illustration by Devaki Banerjee</em></p>

<p>There are many aspects of returning to NYU Abu Dhabi that upperclassmen know all too well: the joyful reunions after months — possibly years — of separation, the endless replies to questions about summers, internships and previous semesters, the staggering back from the bookstore with a fresh set of textbooks and fresh optimism for the coming months. Underlying these familiar experiences for me, though, is the small ripple of a foreign feeling. </p>

<p>Tonight I will be co-facilitating a workshop on Adjusting to NYUAD for freshmen, offering my experience and advice on how to acclimatise to college life. To them, we upperclassmen must seem like we are intimately acquainted with the context in which we find ourselves, and in many ways we are. Yet I find myself going through a period of adjustment too — one that can be easily overlooked in the bustle of a busy new year. </p>

<p>While the buildings fundamentally remain the same — the appearance of brightly coloured walls aside — its inhabitants change. As last year’s seniors progress into the real world and this year’s freshmen burst in with awe-inspiring enthusiasm, those in the middle must accept that this fall is not like the spring before it nor like the fall before that. It sounds trivial to write all of this down — of course, the student body keeps changing, that is the nature of any university — but I cannot be the only one struggling to adjust. Just last week I found myself eating at a table that we referred to as an island of seniors because of the relief we found in familiar faces among a sea of strangers. Moving around the campus is akin to biting into one of my favourite Camel Cookies and finding a different filling: it is still sweet, but not what I was expecting. </p>

<p>Should I have anticipated this feeling of having to readjust? Yes, perhaps. As a senior it’s not my first time coming back, but for some reason the feelings are the strongest they’ve been since I came to NYUAD. The ghosts of friends gone by linger around the spaces that remind me of my memories with them. While I relish my final year as a chance to make new memories and new friends, I find myself going through a period of sadness as I remember that certain people are no longer here. </p>

<p>I know I’m not the only one readjusting, nor is mine the only problem. I spoke to a friend today who told me about the trouble she has with moving between such vastly different contexts. At home, friends and family hold views that are utterly out of place here, and in the first few days, she struggles to fit back into college. The sudden change in pace, too, takes some getting used to. After a peaceful summer in the countryside, the oversubscribed life of NYUAD comes as something of a shock. </p>

<p>Thankfully the sensation never lasts long. As with each year before this, I will soon be swept up by this slightly altered life at NYUAD. Already, new faces are becoming old, and my choice of who to sit with at dinner is beginning to grow rapidly. But as I offer advice to freshmen struggling to settle in, I will take the time to tell them that we too go through an adjustment period. It is subtler and perhaps quicker, but it is there nonetheless, and no one should be ashamed of saying so. Seniors might seem like they know everything, but freshmen aren’t the only ones who can feel lost.</p>

<p><em>Liza Tait-Bailey is Social Media Editor. Email her at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "on-adjusting-back",
            "title": "On Adjusting Back",
            "issueId": "76",
            "category": "commentary",
            "teaser": "Freshmen aren’t the only ones feeling new or lost: a senior’s tale of readjusting back to Abu Dhabi and NYUAD after study abroad.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"]},
            ],
        },
        "reclaiming-identity": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "tom-klein"] },
            ],
            "featuredImage": "http://thegazelle.s3.amazonaws.com/gazelle/2016/02/13.jpg",
            "html": `<p><em>Editor’s Note: At the author’s request we will use the term American to refer to citizens of the United States, as opposed to US American.</em></p>

<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/13.jpg" alt="Reclaiming Identity" /></p>

<p>Since 1999, the Birthright Israel Foundation has paid for young Jews from all over the world to visit Israel. In a free ten-day trip, predominantly high school graduates along with freshman and sophomores in college are marched around Israel in a bid to unite those of Jewish heritage. As I queued for Lufthansa flight 403 to Frankfurt, I observed the latest batch of American Jews bound on such a journey. </p>

<p>While I was not among the group of -bergs and -steins embarking on a Birthright trip, the flight set the tone for the remainder of the summer. Like many of those that accompanied me across the Atlantic, I was an American several generations removed from the boat. Being of Polish and Ashkenazi heritage — ignoring the fact that I had spent less time wearing a yarmulke and more time eating wafers on Sunday — I fit in remarkably well.</p>

<p>As I touched down successively in Krakow and then, a week later, Tel Aviv, I hoped I would feel this greater sense of home I had heard others in line describe in exploring their roots. I wanted that sense of lost kinship that programs like Birthright Israel claimed to restore. Nevertheless, as I departed both Chopin and Ben Gurion airport, my home remained in New Jersey.</p>

<p>After the summer across the Atlantic, I became, if anything, more ardently American. The reasoning behind this was less than simple. In fact, it took me quite a while to realize it myself, but at its core it was a rejection of a common narrative offered by those who reconnect with their heritage. It was a rejection of the idea that a part of one’s culture was lost when their family migrated, and that only by going to this place of origin could they hope to be whole. The concept began to suggest my creole traditions were some bastardization of a truer culture, incapable of being venerated in their own right. After years of challah French toast and kielbasa sandwiches, there was no way that could be the case. </p>

<p>At times, the narrative of cultural bridging stood firm. As I sat in a beer garden in Krakow, these noses distinctive of south Polish heritage stood out to me like I was at another family function back home, bludgeoned by a fury of hugs and kisses from relatives whose names I had forgotten. It came again on the banks of Warsaw’s Vistula river as I heard teenagers belching out a drunken rendition of Sto Lat, a song I’d never heard outside of family birthday parties before. However, these moments of cultural union gave way to larger divisions. Indeed, crappy Israeli bagels, deprived of proper cream cheese and any reasonable sense of sponginess, were indicative of a general Israeli ignorance of all things Yiddish, reducing elements of my family’s lexicon to mere tchotchke’s of Jewish history. Childhood stories of the Polka dancehalls, where my grandparents met, were further replaced in Poland with tales from older generations of the oppression under Stalin. The more I mingled with these Old World cultures, the more I realized, after years in the New World, that we had diverged.</p>

<p>I ultimately understand the attractiveness of looking abroad for a sense of self. Many feel alienated by the country their family migrated to and going abroad is their means to regaining a sense of belonging. But for others, this narrative of getting on a plane to find your roots denies the significance and uniqueness of being a member of an immigrant community. Immigrant identities are unique in their own right and, in my own experience, where I find my lost tribe. </p>

<p><em>Thomas Klein is Opinion Editor. Email him at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "reclaiming-identity",
            "title": "Reclaiming Identity",
            "issueId": "76",
            "category": "commentary",
            "teaser": "The more I mingled with these Old World cultures, the more I realized, after years in the New World, that we had diverged.",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"]},
            ],
        },
        "sunday-sketches-xvi": {
            "authors": [
                { $type: "ref", value: ["authorsBySlug", "sebastian-rojas-cabal"] },
            ],
            "featuredImage": "//thegazelle.s3.amazonaws.com/gazelle/2016/02/Sunday-Sketches-XVI.jpg",
            "html": `<p><img src="http://thegazelle.s3.amazonaws.com/gazelle/2016/02/Sunday-Sketches-XVI.jpg" alt="Sunday Sketch" /></p>

<p><em>Sebastián Rojas Cabal is a contributing writer. Email him at feedback@thegazelle.org</em></p>`,
            "image": null,
            "published_at": "2016-09-04T05:58:09.000Z",
            "slug": "sunday-sketches-xvi",
            "title": "Sunday Sketches, XVI",
            "issueId": "76",
            "category": "commentary",
            "teaser": "",
            "related": [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"]},
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"]},
            ],
        },
    },

    // "sample": {
    //     name: "",
    //     photo: "",
    //     slug: "",
    //     title: "",
    //     biography: "",
    //     articles: [
    //         { $type: "ref", value: ["articlesBySlug", ""] },
    //   ],
    // },
    authorsBySlug: {
        "khadeeja-farooqui": {
            "name": 'Khadeeja Farooqui',
            "photo": '//thegazelle.s3.amazonaws.com/gazelle/2015/10/Ka.jpg',
            "slug": 'khadeeja-farooqui',
            "title": 'Editor-in-Chief',
            "biography": "Khadeeja can often be found juggling Norton’s literature anthologies and a mug of Lipton. Hailing from Pakistan, she loves all things Pakistani, which primarily include naans, paans, laughter and monsoon. In her year away from The Gazelle, she has warmly welcomed back the Oxford comma in her life, but alas that is about to change. She studies postcolonial theory and literature and hopes to make a career out of it. Apparently, this semester she is also learning how to code, in case postcolonial theory doesn’t work out, you know.",
            "articles": [
                { $type: "ref", value: ["articlesBySlug", "50-things"] },
                { $type: "ref", value: ["articlesBySlug", "letter"] },
            ],
        },
        "joey-bui": {
            name: 'Joey Bui',
            photo: '//thegazelle.s3.amazonaws.com/gazelle/2013/09/JOEY22.jpg',
            slug: 'joey-bui',
            title: 'Contributer',
            biography: 'Joey Bui is a Vietnamese Australian senior. She is principally interested in immigration policy, literature and coffee. In her free time, Joey enjoys making cà phê sữa đá and testing walls for Platform Nine and Three Quarters potential.',
            articles: [
                { $type: "ref", value: ["articlesBySlug", "50-things"] },
                { $type: "ref", value: ["articlesBySlug", "whitewashing-hollywood"] },
            ],
        },
        "jamie-sutherland": {
            name: "Jamie Sutherland",
            photo: "//1.gravatar.com/avatar/51fd76c08da7d64e4daf0d15c1ee1738?s=200&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G",
            slug: "jamie-sutherland",
            title: "Contributer",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "50-things"] },
            ],
        },
        "zoe-hu": {
            name: "Zoe Hu",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2013/08/ZOE2.jpg",
            slug: "zoe-hu",
            title: "Contributer",
            biography: "Zoe Hu is a senior Literature major from Hong Kong and the United States. Her goals for the year include conquering her capstone thesis, keeping up with her Arabic and figuring out how to not feel so bad about the stack of unread books by her bed.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "fixing-a-tire"] },
            ],
        },
        "tessa-ayson": {
            name: "Tessa Ayson",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2014/09/TSP.jpg",
            slug: "tessa-ayson",
            title: "Contributer",
            biography: "Tessa is a senior majoring in Economics, but is frequently told she 'doesn't look like an econ major,' so there's that. She likes to spend her spare time searching for cardamom-flavoured ice cream near Madinat Zayed and being confused about why she has spare time — it's a busy year. Tessa does not enjoy chocolate, slow walkers or personal jokes. She would also be very happy if the Oxford comma were in the list of dislikes published in her bio.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "dear-freshmen"] },
            ],
        },
        "karolina-wilczynska": {
            name: "Karolina Wilczynska",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2015/04/karolina.jpg",
            slug: "karolina-wilczynska",
            title: "Contributor",
            biography: "Karolina is a sophomore passionate about social sciences and where the world is going. When she is not busy drinking her coffee, Karolina likes to tests her luck playing capoeira and the guitar. She was drawn to journalism by the conviction that what we know influences our views and actions; she thinks it coincides nicely with her preference to talk about the world around her rather than herself.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "post-marhaba-feels"] },
                { $type: "ref", value: ["articlesBySlug", "a-very-subjective-guide-to-eid-break"]},
            ],
        },
        "the-gazelle-staff": {
            name: "The Gazelle Staff",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2013/09/gazelleTEAM.jpg",
            slug: "the-gazelle-staff",
            title: "",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "the-ad-secrets-challenge"] },
                { $type: "ref", value: ["articlesBySlug", "the-weekly-graze-2"]}
            ],
        },
        "lina-elmusa": {
            name: "Lina Elmusa",
            photo: "//0.gravatar.com/avatar/aa8fd14652d66e2a2059736cb3fb9b60?s=200",
            slug: "lina-elmulsa",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "freshman-year-in-review-what-i-learned-2"] },
            ],
        },
        "annie-bauer": {
            name: "Annie Bauer",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2015/04/Annie.jpg",
            slug: "annie-bauer",
            title: "Deputy Copy Chief",
            biography: "Annie is a sophomore studying Psychology who frequently changes her mind on possible concentrations. She likes coffee and editing, which is why she enjoys being deputy copy chief. She grew up on a farm in northern Vermont and though she loves Abu Dhabi, she still misses alpine skiing and big mountains.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "returning-to-nyuad"] },
            ],
        },
        "larayb-abrar": {
            name: "Larayb Abrar",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2015/10/1_0.jpg",
            slug: "larayb-abrar",
            title: "Contributor",
            biography: "Larayb is a very cool and charming individual who often likes to maintain a healthy sense of humility. She is double-majoring in Literature and Social Research and Public Policy. In her free time, she can be found eavesdropping on conversations to find material for her writing.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "art-in-ad"] },
            ],
        },
        "krushika-uday-patankar": {
            name: "Krushika Patankar",
            photo: "//0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G",
            slug: "krushika-uday-patankar",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "post-grad"] },
            ],
        },
        "connor-pearce": {
            name: "Connor Pearce",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2015/04/connor.jpg",
            slug: "connor-pearce",
            title: "Co-Editor-In-Chief",
            biography: "Connor Pearce is a tenacious junior who hails from the beautiful coast of Sydney, Australia. His interests revolve primarily around cycling, and you’ll likely find him scrolling through avant-garde Facebook memes in his room, alone, in the dark. Undertaking a History major gives Connor the privilege to write the token history article every special issue.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "visas"] },
                { $type: "ref", value: ["articlesBySlug", "letter"] },
                { $type: "ref", value: ["articlesBySlug", "ride-hailing-applications-in-trouble"]},
            ],
        },
        "supriya-kamath": {
            name: "Supriya Kamath",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2016/01/Sup.jpg",
            slug: "supriya-kamath",
            title: "Contributor",
            biography: "Supriya is a Taurus, an ISFJ and a freshman from Mumbai, India. A big believer in the comedic power of Winnie-the-Pooh and Stalinism, she aspires to write sitcoms about pigeons trying to make it in a man’s world. Some say that she’s a huge fan of the British television show Top Gear, but all we know is that she has strong emotional reactions to sans serif typefaces and global warming. She intends to major in Psychology, because she savors the thought of exploring the darkest recesses of the human psyche. She’s also considering Literature, because it’s rad.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "picking-courses"] },
            ],
        },
        "safa-salim": {
            name: "Safa Salim",
            photo: "//0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G",
            slug: "safa-salim",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "nyuad-survival-guide"] },
            ],
        },
        "suka-naja": {
            name: "Suka Naja",
            photo: "//0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G",
            slug: "suka-naja",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
            ],
        },
        "taj-chapman": {
            name: "Taj Chapman",
            photo: "//0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G",
            slug: "taj-chapman",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "changes-with-marhaba"] },
            ],
        },
        "kristina-stankovic": {
            name: "Kristina Stanković",
            photo: null,
            slug: "kristina-stankovic",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "new-j-term-course-selection-process"] },
            ],
        },
        "annalisa-galgano": {
            name: "Annalisa Galgano",
            photo: null,
            slug: "annalisa-galgano",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "the-long-uncertain-wait-for-asylum-seekers-in-athens"] },
            ],
        },
        "liza-tait-bailey": {
            name: "Liza Tait-Bailey",
            photo: "//thegazelle.s3.amazonaws.com/gazelle/2015/10/liza.jpg",
            slug: "liza-tait-bailey",
            title: "Social Media Consultant",
            biography: "Liza comes from rainy England, and realized that she spent so much time on social media that she might as well do something useful with it. When she is not tweeting or Instagramming she can be found running around campus with a Vanilla Latte in hand, thinking of new ideas for her advice and travel blog. She is currently in Ghana, trying to eat as many mangoes as humanly possible.",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "on-adjusting-back"] },
            ],
        },
        "tom-klein": {
            name: "Tom Klein",
            photo: null,
            slug: "tom-klein",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "reclaiming-identity"] },
            ],
        },
        "sebastian-rojas-cabal": {
            name: "Sebastián Rojas Cabal",
            photo: null,
            slug: "sebastian-rojas-cabal",
            title: "Contributor",
            biography: "",
            articles: [
                { $type: "ref", value: ["articlesBySlug", "sunday-sketches-xvi"] },
            ],
        },
    },
};

export default data;
