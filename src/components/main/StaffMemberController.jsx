import React from 'react';
import Helmet from 'react-helmet'; // Add <head> data=
import FalcorController from 'lib/falcor/FalcorController';

// Components
import StaffMember from 'components/main/StaffMember';
import NotFound from 'components/main/NotFound';

export default class StaffMemberController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/staff-member/:staffSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      [
        'staff',
        'bySlug',
        params.staffSlug,
        ['name', 'biography', 'slug', 'job_title', 'image_url'],
      ],
      [
        'staff',
        'bySlug',
        params.staffSlug,
        'articles',
        { to: 50 },
        ['title', 'image_url', 'teaser', 'issueNumber', 'slug'],
      ],
      [
        'staff',
        'bySlug',
        params.staffSlug,
        'articles',
        { to: 50 },
        'category',
        'slug',
      ],
      [
        'staff',
        'bySlug',
        params.staffSlug,
        'articles',
        { to: 50 },
        'authors',
        { to: 10 },
        ['name', 'slug'],
      ],
    ];
  }

  static getOpenGraphInformation(urlParams, falcorData) {
    const { staffSlug } = urlParams;
    // Access data fetched via Falcor
    const staffData = falcorData.staff.bySlug[staffSlug];
    return [
      { property: 'og:title', content: `${staffData.name} | The Gazelle` },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: `https://www.thegazelle.org/staff-member/${staffData.slug}`,
      },
      {
        property: 'og:image',
        content: staffData.image_url,
      },
      { property: 'og:description', content: staffData.biography },
    ];
  }

  render() {
    if (this.state.ready) {
      if (
        this.state.data == null ||
        Object.keys(this.state.data).length === 0
      ) {
        return <NotFound />;
      }

      const { staffSlug } = this.props.params;
      const staffData = this.state.data.staff.bySlug[staffSlug];
      if (!staffData.image_url) {
        // Default image for staff member without one
        staffData.image_url =
          'https://gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536?s=300';
      }
      if (!staffData.job_title) {
        // Default job title for staff member without one
        staffData.job_title = 'Contributor';
      }
      const meta = [
        // Search results
        { name: 'description', content: staffData.biography },

        // Social media
        ...StaffMemberController.getOpenGraphInformation(
          this.props.params,
          this.state.data,
        ),
      ];
      return (
        <div>
          <Helmet meta={meta} title={`${staffData.name} | The Gazelle`} />
          <StaffMember staffMember={staffData} />
        </div>
      );
    }

    return <div>Loading</div>;
  }
}
