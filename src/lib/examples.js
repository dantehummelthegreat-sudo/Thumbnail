import weakUrl from '../assets/examples/weak.jpg'
import strongUrl from '../assets/examples/strong.jpg'

// Built-in example thumbnails shown on first load, so a new visitor sees the
// whole tool working before uploading anything.
export function exampleThumbs() {
  return [
    {
      id: 'example-weak',
      url: weakUrl,
      title: 'my vlog episode 24 (new)',
      channel: 'Example Channel',
      isExample: true,
      exampleKind: 'weak',
    },
    {
      id: 'example-strong',
      url: strongUrl,
      title: 'I Quit Sugar for 30 Days — Here’s What Happened',
      channel: 'Example Channel',
      isExample: true,
      exampleKind: 'strong',
    },
  ]
}
