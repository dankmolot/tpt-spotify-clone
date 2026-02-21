import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlist/$playlistID')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/playlist/$playlistID"!</div>
}
