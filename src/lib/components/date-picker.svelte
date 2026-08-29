<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { getLocalTimeZone } from "@internationalized/date";
  import type { CalendarDate } from "@internationalized/date";
  import { generateRandomString } from "better-auth/crypto";
 
  let { 
    id = generateRandomString(10), 
    value = $bindable<CalendarDate | undefined>(),
    timeValue = $bindable("10:30")
  } = $props();
 
  
  let open = $state(false);
</script>
 
<div class="flex gap-4">
 <div class="flex flex-col gap-3">
  <Label for="{id}-date" class="px-1">Data</Label>
  <Popover.Root bind:open>
   <Popover.Trigger id="{id}-date">
    {#snippet child({ props })}
     <Button
      {...props}
      variant="outline"
      class="w-32 justify-between font-normal"
     >
      {value
       ? value.toDate(getLocalTimeZone()).toLocaleDateString()
       : "Select date"}
      <ChevronDownIcon />
     </Button>
    {/snippet}
   </Popover.Trigger>
   <Popover.Content class="w-auto overflow-hidden p-0" align="start">
    <Calendar
     type="single"
     bind:value
     onValueChange={() => {
      open = false;
     }}
     captionLayout="dropdown"
    />
   </Popover.Content>
  </Popover.Root>
 </div>
 <div class="flex flex-col gap-3">
  <Label for="{id}-time" class="px-1">Orario</Label>
  <Input
    type="time"
    id="{id}-time"
    step="0"
    lang="it"
    bind:value={timeValue}
    class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
  />
 </div>
</div>