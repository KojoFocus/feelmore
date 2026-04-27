import ChatThread from '@/components/messages/ChatThread'

const NAMES: Record<string, string> = {
  support: 'feelmore. Support',
}

export default function MessageThreadPage({ params }: { params: { id: string } }) {
  const name = NAMES[params.id] ?? 'Chat'
  return <ChatThread id={params.id} name={name} />
}
