'use client'

import { AppHeader } from '@/components/app-header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { NovaCalendar } from '@/components/nova/nova-calendar'
import { NovaInbox } from '@/components/nova/nova-inbox'
import { NovaPillars } from '@/components/nova/nova-pillars'
import { inboxMessages } from '@/lib/data'

export default function NovaPage() {
  return (
    <>
      <AppHeader title="Nova" />
      <div className="px-4 pt-4">
        <Tabs defaultValue="calendrier">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1">
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
            <TabsTrigger value="inbox" className="gap-1.5">
              Inbox
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {inboxMessages.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="piliers">Piliers</TabsTrigger>
          </TabsList>

          <TabsContent value="calendrier" className="mt-5">
            <NovaCalendar />
          </TabsContent>
          <TabsContent value="inbox" className="mt-5">
            <NovaInbox />
          </TabsContent>
          <TabsContent value="piliers" className="mt-5">
            <NovaPillars />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
