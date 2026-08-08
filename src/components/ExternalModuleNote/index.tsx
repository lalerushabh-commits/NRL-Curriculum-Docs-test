import React, {type ReactNode} from 'react';

export type ExternalModuleVia = 'video' | 'course' | 'course-and-playlist';

const MESSAGES: Record<ExternalModuleVia, string> = {
  video:
    "This module is taught through a video walkthrough rather than written notes here — follow along as you watch.",
  course:
    "This module is taught through Onshape's own interactive course rather than written notes here.",
  'course-and-playlist':
    "This module is taught through Onshape's own interactive course and a video playlist rather than written notes here.",
};

/** Standard intro sentence for modules taught entirely through an external video/course rather than original prose. */
export default function ExternalModuleNote({via}: {via: ExternalModuleVia}): ReactNode {
  return <p>{MESSAGES[via]}</p>;
}
