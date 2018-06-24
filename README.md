# Project

This project aims at rectifying and improving parts of the Gazelle CMS to enhance the workflow for publishing by reducing time spent on unnecessary tasks. The project is closely linked to the Gazelle and so the existing codebase will be expanded and refactored. All work is linked to tickets and milestones which can be found on the [issues page](https://github.com/thegazelle-ad/gazelle-server/labels/SWE%20final%20project) and will take place on the [swe-final-project branch](https://github.com/thegazelle-ad/gazelle-server/tree/swe-final-project).

# Developers

This project is developed by Emil Goldsmith Olesen, Frederik Brinck Jensen, and William Held

# Progress

Progress is tracked using milestones. Currently, the following milestones are being worked on

- [ ] MVP1 - [Removing Ghost](https://github.com/thegazelle-ad/gazelle-server/milestone/1)
- [ ] MVP2 - [Google Docs Feature Replication](https://github.com/thegazelle-ad/gazelle-server/milestone/2)

Each milestone is structured into a set of epics, each epic having multiple issues. For an example, see [Admin Frontend to Replace Ghost](https://github.com/thegazelle-ad/gazelle-server/issues/303).

Based on how the progress moves along, we might include another milestone.

## MVP1 - Removing Ghost

Currently, the Gazelle workflow depends on publishing articles through a slim Wordpress CMS called Ghost after they have been extensively developed on google docs. Porting the articles into Ghost is a bottleneck as it bloats the code and increases the entry barriers for new developers. Moreover, it takes valuable time away for the Gazelle editors having to copy/paste everything into that portal. This milestone therefore removes Ghost by

1.  restructuring Ghost DB fields and merge them with the Gazelle fields,
2.  implementing simple editor and meta tags in the Gazelle CMS,
3.  testing and implementing the solution into the current Gazelle workflow.

The major work consists in merging custom tables made specifically for the Gazelle with the Ghost standard fields. To ensure backwards compatibility with previous Gazelle issues the data must be migrated for all of them. In addition, the database API calls made through Falcor must be updated to reflect the new structure.

Upon transitioning to the new table structure, a simple markdown text editor must be implemented into the CMS so that editors can put in the articles and ensure that metadata and tags have been set appropriately. In the future, this would provide a better editing experience through milestone two and due to the fact that custom features can be implemented such as error flagging and style guiding.

The last step involves testing it. As there is currently not a QA server setup with a separate database, this will probably be done manually.

## MVP2 - Google Docs Feature Replication

This milestone demarcates the successful replication of the Google Docs editing features. This replication is necessary in order to provide a MVP that makes a transition possible for the editor's team from the Google Docs to the native Gazelle CMS. It is of utmost importance that these features are streamlined and well-tested since, if the editing experience falls short of the current experience, the system will not be adopted. In the future, moving everything to the Gazelle portal helps implementing custom features that will increase the efficiency. In more details, this milestone comprises an editor which

1.  allows multiple users to write and edit in a document
2.  allows users to suggest and accept changes on an article
3.  allows users to comment on suggested changes in threads
4.  allow users to tag other users to send them automatic notifications

To implement these features, we will most likely use [ShareDB](https://github.com/share/sharedb) and so a big part of this milestone is to figure out how to use ShareDB and integrate it into the existing database setup. On top of that, we will have to support markdown edits, comment threads for each user to comment on parts of the text. This requires that a minimum permission control system is implemented in order to associate comments and tags with logged-in users. The permission control system will be a simple role and key-based system that can be extended with newer roles as the system gets developed and the permission needs get cleared with the Gazelle team.

# Wiki

It can be found [here](https://github.com/thegazelle-ad/gazelle-server/wiki/SWE-Final-Project).

# License

The MIT License

Copyright (c) 2016 The Gazelle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
